"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  Booking,
  OpeningHours,
  PaymentMethod,
  PeakWindow,
  Settings,
  Studio,
  PromoDiscountType,
} from "@/lib/booking/types";
import {
  computeBookingPrice,
  bookingStartUtc,
  intervalsOverlap,
  openingForDate,
} from "@/lib/booking/pricing";
import {
  expireStalePendingBookings,
  fetchBusySlots,
  fetchSettings,
  generateBookingReference,
} from "@/lib/booking/db";
import { normalizeGalleryUrls } from "@/lib/booking/studio-images";
import { normalizePromoCode } from "@/lib/booking/promo";
import {
  sendBookingCancelledEmail,
  sendBookingConfirmedEmail,
  sendBookingReceivedEmail,
} from "@/lib/booking/emails";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/constants";
import type {
  AboutPageContent,
  ContactPageContent,
  SitePageSlug,
} from "@/lib/site-content/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
  message?: string;
  warning?: string;
}

async function requireAdmin(): Promise<void> {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé");
}

async function fetchBookingWithStudio(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, studios(id, name)")
    .eq("id", id)
    .single();
  if (error || !data) throw new Error("Réservation introuvable");
  return data as Booking & { studios: Pick<Studio, "id" | "name"> };
}

async function updateBookingStatus(
  id: string,
  status: string
): Promise<Booking> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Mise à jour impossible");
  return data as Booking;
}

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/income");
}

/** Admin confirms that payment was received. Sends the confirmation email. */
export async function confirmBooking(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const existing = await fetchBookingWithStudio(id);
    if (existing.status !== "pending") {
      return { ok: false, error: "Seules les réservations en attente peuvent être confirmées." };
    }
    const booking = await updateBookingStatus(id, "confirmed");
    const settings = await fetchSettings();
    const emailResult = await sendBookingConfirmedEmail({
      booking,
      studio: existing.studios,
      settings,
    });
    revalidateAdmin();
    if (!emailResult.ok) {
      return {
        ok: true,
        warning: `Réservation confirmée, mais l'email client n'a pas pu être envoyé : ${emailResult.error}`,
      };
    }
    return {
      ok: true,
      message: `Réservation confirmée. Email de confirmation envoyé à ${existing.customer_email}.`,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

/** Resend the confirmation email for an already confirmed booking. */
export async function resendBookingConfirmationEmail(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const existing = await fetchBookingWithStudio(id);
    if (existing.status !== "confirmed") {
      return {
        ok: false,
        error: "Seules les réservations confirmées peuvent recevoir un email de confirmation.",
      };
    }
    const settings = await fetchSettings();
    const emailResult = await sendBookingConfirmedEmail({
      booking: existing,
      studio: existing.studios,
      settings,
    });
    if (!emailResult.ok) {
      return { ok: false, error: emailResult.error };
    }
    return {
      ok: true,
      message: `Email de confirmation renvoyé à ${existing.customer_email}.`,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

export async function cancelBooking(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const existing = await fetchBookingWithStudio(id);
    if (!["pending", "confirmed"].includes(existing.status)) {
      return { ok: false, error: "Cette réservation ne peut pas être annulée." };
    }
    const booking = await updateBookingStatus(id, "cancelled");
    const settings = await fetchSettings();
    await sendBookingCancelledEmail(
      { booking, studio: existing.studios, settings },
      "cancelled"
    );
    revalidateAdmin();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

/** Confirm all pending sessions of a multi-booking package (one client email). */
export async function confirmPackageBookings(
  ids: string[]
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!ids.length) return { ok: false, error: "Aucune réservation." };

    const rows = await Promise.all(ids.map((id) => fetchBookingWithStudio(id)));
    const pending = rows.filter((b) => b.status === "pending");
    if (pending.length === 0) {
      return {
        ok: false,
        error: "Aucune séance en attente dans ce forfait.",
      };
    }

    for (const b of pending) {
      await updateBookingStatus(b.id, "confirmed");
    }

    const settings = await fetchSettings();
    const primary = [...pending].sort((a, b) => {
      const ai = a.package_index ?? 999;
      const bi = b.package_index ?? 999;
      return ai - bi || a.date.localeCompare(b.date);
    })[0];

    const packageTotal =
      Math.round(
        pending.reduce((s, b) => s + Number(b.total_price_mad), 0) * 100
      ) / 100;
    const sessionLines = [...pending]
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) || a.start_minutes - b.start_minutes
      )
      .map(
        (b) =>
          `${b.date} · ${String(Math.floor(b.start_minutes / 60)).padStart(2, "0")}:${String(b.start_minutes % 60).padStart(2, "0")} [${b.reference}]`
      )
      .join("\n");

    const emailBooking = {
      ...primary,
      total_price_mad: packageTotal,
      note: `Forfait ${pending.length} séances confirmées :\n${sessionLines}`,
    };

    const emailResult = await sendBookingConfirmedEmail({
      booking: emailBooking,
      studio: primary.studios,
      settings,
    });

    revalidateAdmin();
    if (!emailResult.ok) {
      return {
        ok: true,
        warning: `${pending.length} séance(s) confirmée(s), mais l'email n'a pas pu être envoyé : ${emailResult.error}`,
      };
    }
    return {
      ok: true,
      message: `Forfait confirmé (${pending.length} séance${pending.length > 1 ? "s" : ""}). Email envoyé à ${primary.customer_email}.`,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

/** Cancel all cancellable sessions of a package (one client email). */
export async function cancelPackageBookings(
  ids: string[]
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!ids.length) return { ok: false, error: "Aucune réservation." };

    const rows = await Promise.all(ids.map((id) => fetchBookingWithStudio(id)));
    const cancellable = rows.filter((b) =>
      ["pending", "confirmed"].includes(b.status)
    );
    if (cancellable.length === 0) {
      return {
        ok: false,
        error: "Aucune séance annulable dans ce forfait.",
      };
    }

    const settings = await fetchSettings();
    const primary = cancellable[0];
    for (const b of cancellable) {
      await updateBookingStatus(b.id, "cancelled");
    }

    const packageTotal =
      Math.round(
        cancellable.reduce((s, b) => s + Number(b.total_price_mad), 0) * 100
      ) / 100;
    await sendBookingCancelledEmail(
      {
        booking: {
          ...primary,
          total_price_mad: packageTotal,
          status: "cancelled",
          note: `Forfait ${cancellable.length} séances annulé.`,
        },
        studio: primary.studios,
        settings,
      },
      "cancelled"
    );

    revalidateAdmin();
    return {
      ok: true,
      message: `Forfait annulé (${cancellable.length} séance${cancellable.length > 1 ? "s" : ""}).`,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

export async function completeBooking(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const existing = await fetchBookingWithStudio(id);
    if (existing.status !== "confirmed") {
      return { ok: false, error: "Seules les réservations confirmées peuvent être terminées." };
    }
    await updateBookingStatus(id, "completed");
    revalidateAdmin();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

export async function saveAdminNote(
  id: string,
  note: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("bookings")
      .update({
        admin_note: note.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidateAdmin();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

export interface UpdateBookingInput {
  studioId: number;
  date: string;
  startMinutes: number;
  durationMinutes: number;
  name: string;
  email: string;
  phone: string;
  note?: string;
  activityType?: string;
  activityDescription?: string;
  courseType?: "group" | "private";
  paymentMethod: PaymentMethod;
  /** If true, recompute price from studio rates (ignored for internal blocks). */
  recalculatePrice?: boolean;
  /** Manual price override when recalculatePrice is false. */
  totalPriceMad?: number;
}

/** Edit an existing booking (slot, client, activity, price). */
export async function updateBooking(
  id: string,
  input: UpdateBookingInput
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = getSupabaseAdmin();
    const existing = await fetchBookingWithStudio(id);

    if (["cancelled", "expired"].includes(existing.status)) {
      return {
        ok: false,
        error: "Impossible de modifier une réservation annulée ou expirée.",
      };
    }

    if (
      !Number.isInteger(input.studioId) ||
      input.studioId <= 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(input.date) ||
      !Number.isInteger(input.startMinutes) ||
      input.startMinutes < 0 ||
      input.startMinutes >= 1440 ||
      input.startMinutes % 30 !== 0 ||
      !Number.isInteger(input.durationMinutes) ||
      input.durationMinutes < 60 ||
      input.durationMinutes % 30 !== 0
    ) {
      return { ok: false, error: "Créneau invalide." };
    }

    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const phone = input.phone.trim();
    if (!name || name.length > 100) {
      return { ok: false, error: "Le nom est requis." };
    }
    if (!existing.is_internal) {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { ok: false, error: "Email invalide." };
      }
      if (!phone || phone.length > 30) {
        return { ok: false, error: "Téléphone invalide." };
      }
    }

    const { data: studioData } = await supabase
      .from("studios")
      .select("*")
      .eq("id", input.studioId)
      .single();
    if (!studioData) return { ok: false, error: "Studio introuvable." };
    const studio = studioData as Studio;
    const settings = await fetchSettings(supabase);

    const opening = openingForDate(settings.opening_hours, input.date);
    const end = input.startMinutes + input.durationMinutes;
    if (!opening || input.startMinutes < opening.open || end > opening.close) {
      return { ok: false, error: "Créneau en dehors des horaires d'ouverture." };
    }

    await expireStalePendingBookings(supabase);

    const { data: sameDay } = await supabase
      .from("bookings")
      .select("id, start_minutes, duration_minutes")
      .eq("studio_id", input.studioId)
      .eq("date", input.date)
      .in("status", ["pending", "confirmed"])
      .neq("id", id);

    const conflict = (sameDay ?? []).some((b) =>
      intervalsOverlap(
        input.startMinutes,
        end,
        b.start_minutes,
        b.start_minutes + b.duration_minutes
      )
    );
    if (conflict) {
      return { ok: false, error: "Ce créneau chevauche une autre réservation." };
    }

    let totalPriceMad = Number(existing.total_price_mad);
    if (existing.is_internal) {
      totalPriceMad = 0;
    } else if (input.recalculatePrice) {
      const price = computeBookingPrice(
        studio,
        input.date,
        input.startMinutes,
        input.durationMinutes,
        settings.peak_windows
      );
      totalPriceMad = price.totalMad;
    } else if (
      input.totalPriceMad != null &&
      Number.isFinite(input.totalPriceMad) &&
      input.totalPriceMad >= 0
    ) {
      totalPriceMad = Math.round(input.totalPriceMad * 100) / 100;
    }

    const activityType = input.activityType?.trim() || null;
    const activityDescription = input.activityDescription?.trim() || null;

    const patch: Record<string, unknown> = {
      studio_id: input.studioId,
      date: input.date,
      start_minutes: input.startMinutes,
      duration_minutes: input.durationMinutes,
      customer_name: name,
      customer_email: email || existing.customer_email,
      customer_phone: phone || existing.customer_phone,
      note: input.note?.trim() || null,
      payment_method: input.paymentMethod,
      total_price_mad: totalPriceMad,
      updated_at: new Date().toISOString(),
    };

    if (input.courseType === "group" || input.courseType === "private") {
      patch.course_type = input.courseType;
    }

    if (activityType != null || activityDescription != null) {
      patch.activity_type = activityType;
      patch.activity_description = activityDescription;
    }

    let { error } = await supabase.from("bookings").update(patch).eq("id", id);

    if (
      error &&
      (error.code === "42703" ||
        error.message?.includes("activity_type") ||
        error.message?.includes("activity_description"))
    ) {
      delete patch.activity_type;
      delete patch.activity_description;
      const activityBits = [
        activityType ? `Activité: ${activityType}` : null,
        activityDescription ? `Description: ${activityDescription}` : null,
      ].filter(Boolean);
      if (activityBits.length) {
        const base =
          typeof patch.note === "string" && patch.note ? patch.note : "";
        patch.note = [activityBits.join(" · "), base].filter(Boolean).join(" · ");
      }
      ({ error } = await supabase.from("bookings").update(patch).eq("id", id));
    }

    if (error) {
      if (error.code === "23P01") {
        return { ok: false, error: "Ce créneau chevauche une autre réservation." };
      }
      throw new Error(error.message);
    }

    revalidateAdmin();
    return { ok: true, message: "Réservation mise à jour." };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

export interface ManualBookingInput {
  studioId: number;
  date: string;
  startMinutes: number;
  durationMinutes: number;
  name: string;
  email: string;
  phone: string;
  note?: string;
  paymentMethod: PaymentMethod;
  status: "pending" | "confirmed";
  sendEmail: boolean;
  /** Personal / internal calendar block — price 0, no revenue. */
  isInternal?: boolean;
  /**
   * Optional custom price. If omitted / empty, price is calculated from
   * studio rates + peak windows for the selected date/time/duration.
   */
  totalPriceMad?: number;
}

/** Manual booking created by the admin (phone / WhatsApp / internal block). */
export async function createManualBooking(
  input: ManualBookingInput
): Promise<ActionResult & { reference?: string }> {
  try {
    await requireAdmin();
    const supabase = getSupabaseAdmin();
    const isInternal = Boolean(input.isInternal);

    const { data: studioData } = await supabase
      .from("studios")
      .select("*")
      .eq("id", input.studioId)
      .single();
    if (!studioData) return { ok: false, error: "Studio introuvable." };
    const studio = studioData as Studio;
    const settings = await fetchSettings(supabase);

    const opening = openingForDate(settings.opening_hours, input.date);
    const end = input.startMinutes + input.durationMinutes;
    if (!opening || input.startMinutes < opening.open || end > opening.close) {
      return { ok: false, error: "Créneau en dehors des horaires d'ouverture." };
    }

    await expireStalePendingBookings(supabase);
    const busy = await fetchBusySlots(input.studioId, input.date, supabase);
    if (
      busy.some((b) =>
        intervalsOverlap(
          input.startMinutes,
          end,
          b.start_minutes,
          b.start_minutes + b.duration_minutes
        )
      )
    ) {
      return { ok: false, error: "Ce créneau est déjà réservé." };
    }

    const calculated = isInternal
      ? { totalMad: 0 }
      : computeBookingPrice(
          studio,
          input.date,
          input.startMinutes,
          input.durationMinutes,
          settings.peak_windows
        );

    let totalPriceMad = calculated.totalMad;
    if (isInternal) {
      totalPriceMad = 0;
    } else if (
      input.totalPriceMad != null &&
      Number.isFinite(input.totalPriceMad) &&
      input.totalPriceMad >= 0
    ) {
      totalPriceMad = Math.round(input.totalPriceMad * 100) / 100;
    }

    const status = isInternal ? "confirmed" : input.status;
    const deadlineMs =
      status === "confirmed"
        ? bookingStartUtc(input.date, input.startMinutes).getTime()
        : Math.min(
            Date.now() + settings.confirmation_deadline_hours * 3_600_000,
            bookingStartUtc(input.date, input.startMinutes).getTime()
          );

    const customerName = (
      input.name.trim() || (isInternal ? "Blocage interne" : "")
    ).slice(0, 100);
    if (!customerName) return { ok: false, error: "Le nom est requis." };

    const customerEmail = isInternal
      ? (input.email.trim() || CONTACT_EMAIL).toLowerCase()
      : input.email.trim().toLowerCase();
    const customerPhone = isInternal
      ? input.phone.trim() || CONTACT_PHONE_DISPLAY
      : input.phone.trim();

    if (!isInternal) {
      if (!customerEmail || !customerPhone) {
        return { ok: false, error: "Email et téléphone sont requis." };
      }
    }

    const row: Record<string, unknown> = {
      reference: generateBookingReference(),
      studio_id: input.studioId,
      date: input.date,
      start_minutes: input.startMinutes,
      duration_minutes: input.durationMinutes,
      total_price_mad: totalPriceMad,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      note: input.note?.trim() || null,
      payment_method: input.paymentMethod,
      status,
      payment_deadline: new Date(deadlineMs).toISOString(),
      admin_note: isInternal
        ? "Blocage interne — hors CA"
        : "Créée manuellement par l'admin",
      is_internal: isInternal,
      activity_type: isInternal ? "Interne" : null,
      activity_description: isInternal
        ? input.note?.trim() || "Séance personnelle / indisponible"
        : null,
    };

    let { data, error } = await supabase
      .from("bookings")
      .insert(row)
      .select("*")
      .single();

    if (
      error &&
      (error.code === "42703" ||
        error.message?.includes("is_internal") ||
        error.message?.includes("activity_type") ||
        error.message?.includes("activity_description"))
    ) {
      const legacy = { ...row };
      delete legacy.is_internal;
      delete legacy.activity_type;
      delete legacy.activity_description;
      if (isInternal) {
        legacy.total_price_mad = 0;
        legacy.admin_note = "Blocage interne — hors CA (migration à exécuter)";
        const noteBits = [
          typeof legacy.note === "string" ? legacy.note : null,
          "BLOCAGE INTERNE",
        ].filter(Boolean);
        legacy.note = noteBits.join(" · ");
      }
      ({ data, error } = await supabase
        .from("bookings")
        .insert(legacy)
        .select("*")
        .single());
    }

    if (error || !data) {
      if (error?.code === "23P01") {
        return { ok: false, error: "Ce créneau est déjà réservé." };
      }
      if (
        error?.message?.includes("is_internal") ||
        error?.message?.includes("activity_")
      ) {
        return {
          ok: false,
          error:
            "Exécutez supabase/activity-and-block-migration.sql dans Supabase.",
        };
      }
      throw new Error(error?.message ?? "Insertion impossible");
    }
    const booking = data as Booking;

    if (!isInternal && input.sendEmail) {
      const ctx = { booking, studio, settings };
      if (status === "confirmed") {
        const emailResult = await sendBookingConfirmedEmail(ctx);
        if (!emailResult.ok) {
          return {
            ok: true,
            reference: booking.reference,
            warning: `Réservation créée, mais l'email de confirmation n'a pas pu être envoyé : ${emailResult.error}`,
          };
        }
      } else {
        await sendBookingReceivedEmail(ctx);
      }
    }

    revalidateAdmin();
    return {
      ok: true,
      reference: booking.reference,
      message: isInternal ? "Créneau bloqué." : "Réservation créée.",
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

export interface RecurringInternalBlockInput {
  studioId: number;
  /** First occurrence (YYYY-MM-DD) — defines the weekday. */
  startDate: string;
  startMinutes: number;
  durationMinutes: number;
  /** How far ahead to block every week. */
  months: 1 | 3 | 6;
  name: string;
  note?: string;
}

function addMonthsYmd(date: string, months: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCMonth(dt.getUTCMonth() + months);
  return dt.toISOString().slice(0, 10);
}

/** Weekly dates from startDate inclusive until untilExclusive (exclusive). */
function enumerateWeeklyDates(
  startDate: string,
  untilExclusive: string
): string[] {
  const out: string[] = [];
  const [y, m, d] = startDate.split("-").map(Number);
  let t = Date.UTC(y, m - 1, d);
  const [ey, em, ed] = untilExclusive.split("-").map(Number);
  const end = Date.UTC(ey, em - 1, ed);
  while (t < end) {
    out.push(new Date(t).toISOString().slice(0, 10));
    t += 7 * 24 * 60 * 60 * 1000;
  }
  return out;
}

/**
 * Creates weekly internal blocks from a first date for 1 / 3 / 6 months
 * (e.g. Bachata every Wednesday). Occupies the calendar, 0 MAD, hors CA.
 */
export async function createRecurringInternalBlocks(
  input: RecurringInternalBlockInput
): Promise<
  ActionResult & {
    created?: number;
    skippedClosed?: number;
    skippedBusy?: number;
    groupId?: string;
  }
> {
  try {
    await requireAdmin();
    const supabase = getSupabaseAdmin();

    if (![1, 3, 6].includes(input.months)) {
      return { ok: false, error: "Durée invalide (1, 3 ou 6 mois)." };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startDate)) {
      return { ok: false, error: "Date de début invalide." };
    }

    const { data: studioData } = await supabase
      .from("studios")
      .select("*")
      .eq("id", input.studioId)
      .single();
    if (!studioData) return { ok: false, error: "Studio introuvable." };

    const settings = await fetchSettings(supabase);
    const untilExclusive = addMonthsYmd(input.startDate, input.months);
    const dates = enumerateWeeklyDates(input.startDate, untilExclusive);
    if (dates.length === 0) {
      return { ok: false, error: "Aucune date à bloquer." };
    }

    const end = input.startMinutes + input.durationMinutes;
    const label = (
      input.name.trim() || "Cours régulier (blocage)"
    ).slice(0, 100);
    const motif =
      input.note?.trim() ||
      `Cours régulier — chaque semaine × ${input.months} mois`;
    const groupId = crypto.randomUUID();

    await expireStalePendingBookings(supabase);

    let created = 0;
    let skippedClosed = 0;
    let skippedBusy = 0;
    let packageIndex = 0;

    for (const date of dates) {
      const opening = openingForDate(settings.opening_hours, date);
      if (
        !opening ||
        input.startMinutes < opening.open ||
        end > opening.close
      ) {
        skippedClosed += 1;
        continue;
      }

      const busy = await fetchBusySlots(input.studioId, date, supabase);
      if (
        busy.some((b) =>
          intervalsOverlap(
            input.startMinutes,
            end,
            b.start_minutes,
            b.start_minutes + b.duration_minutes
          )
        )
      ) {
        skippedBusy += 1;
        continue;
      }

      packageIndex += 1;
      const deadlineMs = bookingStartUtc(date, input.startMinutes).getTime();
      const row: Record<string, unknown> = {
        reference: generateBookingReference(),
        studio_id: input.studioId,
        date,
        start_minutes: input.startMinutes,
        duration_minutes: input.durationMinutes,
        total_price_mad: 0,
        customer_name: label,
        customer_email: CONTACT_EMAIL.toLowerCase(),
        customer_phone: CONTACT_PHONE_DISPLAY,
        note: motif,
        payment_method: "cash",
        status: "confirmed",
        payment_deadline: new Date(deadlineMs).toISOString(),
        admin_note: `Blocage récurrent — hors CA · ${input.months} mois`,
        is_internal: true,
        activity_type: "Interne",
        activity_description: motif,
        package_group_id: groupId,
        package_index: packageIndex,
        regular_course_count: dates.length,
      };

      let { error } = await supabase.from("bookings").insert(row);

      if (
        error &&
        (error.code === "42703" ||
          error.message?.includes("is_internal") ||
          error.message?.includes("activity_type") ||
          error.message?.includes("activity_description") ||
          error.message?.includes("package_group_id") ||
          error.message?.includes("package_index") ||
          error.message?.includes("regular_course_count"))
      ) {
        const legacy = { ...row };
        delete legacy.is_internal;
        delete legacy.activity_type;
        delete legacy.activity_description;
        if (error.message?.includes("package_")) {
          delete legacy.package_group_id;
          delete legacy.package_index;
          delete legacy.regular_course_count;
        }
        legacy.total_price_mad = 0;
        legacy.admin_note = `Blocage récurrent — hors CA · ${input.months} mois · série ${groupId}`;
        const noteBits = [
          typeof legacy.note === "string" ? legacy.note : null,
          "BLOCAGE INTERNE RÉCURRENT",
        ].filter(Boolean);
        legacy.note = noteBits.join(" · ");
        ({ error } = await supabase.from("bookings").insert(legacy));
      }

      if (error) {
        if (error.code === "23P01") {
          skippedBusy += 1;
          packageIndex -= 1;
          continue;
        }
        if (
          error.message?.includes("is_internal") ||
          error.message?.includes("activity_")
        ) {
          return {
            ok: false,
            error:
              "Exécutez supabase/activity-and-block-migration.sql dans Supabase.",
            created,
            skippedClosed,
            skippedBusy,
          };
        }
        throw new Error(error.message ?? "Insertion impossible");
      }
      created += 1;
    }

    if (created === 0) {
      return {
        ok: false,
        error:
          skippedBusy > 0
            ? "Tous les créneaux étaient déjà réservés."
            : "Aucun créneau créé (studio fermé ces jours-là ?).",
        created: 0,
        skippedClosed,
        skippedBusy,
      };
    }

    revalidateAdmin();
    const parts = [`${created} créneau${created > 1 ? "x" : ""} bloqué${created > 1 ? "s" : ""}`];
    if (skippedBusy > 0) parts.push(`${skippedBusy} déjà pris`);
    if (skippedClosed > 0) parts.push(`${skippedClosed} hors horaires`);
    return {
      ok: true,
      message: parts.join(" · "),
      created,
      skippedClosed,
      skippedBusy,
      groupId,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

export interface StudioUpdateInput {
  name: string;
  subtitle: string;
  size_label: string;
  capacity_label: string;
  price_peak_mad: number;
  price_offpeak_mad: number;
  popular: boolean;
  active: boolean;
  gallery_urls: string[];
}

export async function updateStudio(
  id: number,
  input: StudioUpdateInput
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (
      !input.name.trim() ||
      !Number.isFinite(input.price_peak_mad) ||
      !Number.isFinite(input.price_offpeak_mad) ||
      input.price_peak_mad < 0 ||
      input.price_offpeak_mad < 0
    ) {
      return { ok: false, error: "Valeurs invalides." };
    }
    const gallery = normalizeGalleryUrls(input.gallery_urls ?? []);
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("studios")
      .update({
        name: input.name.trim(),
        subtitle: input.subtitle.trim() || null,
        size_label: input.size_label.trim() || null,
        capacity_label: input.capacity_label.trim() || null,
        price_peak_mad: Math.round(input.price_peak_mad),
        price_offpeak_mad: Math.round(input.price_offpeak_mad),
        popular: input.popular,
        active: input.active,
        gallery_urls: gallery,
        image_url: gallery[0] ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/studios");
    revalidatePath("/reservation");
    revalidatePath("/studios");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

export interface SettingsUpdateInput {
  opening_hours: OpeningHours;
  peak_windows: PeakWindow[];
  paypal_email: string;
  paypal_link: string;
  bank_details: string;
  confirmation_deadline_hours: number;
  reminder_hours_before: number;
}

export async function updateSettings(
  input: SettingsUpdateInput
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (
      !Number.isInteger(input.confirmation_deadline_hours) ||
      input.confirmation_deadline_hours < 1 ||
      input.confirmation_deadline_hours > 336
    ) {
      return { ok: false, error: "Délai de confirmation invalide (1 à 336 heures)." };
    }
    if (
      !Number.isInteger(input.reminder_hours_before) ||
      input.reminder_hours_before < 1 ||
      input.reminder_hours_before > 168
    ) {
      return {
        ok: false,
        error: "Délai de relance invalide (1 à 168 heures avant la séance).",
      };
    }
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    for (const day of Object.keys(input.opening_hours)) {
      const entry = input.opening_hours[day];
      if (entry === null) continue;
      if (
        !timeRegex.test(entry.open) ||
        !timeRegex.test(entry.close) ||
        entry.open >= entry.close
      ) {
        return { ok: false, error: "Horaires d'ouverture invalides." };
      }
    }
    for (const w of input.peak_windows) {
      if (
        !Array.isArray(w.days) ||
        !timeRegex.test(w.start) ||
        !timeRegex.test(w.end) ||
        w.start >= w.end
      ) {
        return { ok: false, error: "Plages d'heures pleines invalides." };
      }
    }

    const supabase = getSupabaseAdmin();
    const update: Partial<Settings> & { updated_at: string } = {
      opening_hours: input.opening_hours,
      peak_windows: input.peak_windows,
      paypal_email: input.paypal_email.trim() || null,
      paypal_link: input.paypal_link.trim() || null,
      bank_details: input.bank_details.trim() || null,
      confirmation_deadline_hours: input.confirmation_deadline_hours,
      reminder_hours_before: input.reminder_hours_before,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("settings").update(update).eq("id", 1);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/settings");
    revalidatePath("/reservation");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

export interface PromoCodeInput {
  code: string;
  label: string;
  discount_type: PromoDiscountType;
  discount_value: number;
  min_amount_mad: number | null;
  max_uses: number | null;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
}

function validatePromoInput(input: PromoCodeInput): string | null {
  const code = normalizePromoCode(input.code);
  if (!code || code.length > 32) return "Code promo invalide (max 32 caractères).";
  if (!["percent", "fixed"].includes(input.discount_type)) {
    return "Type de réduction invalide.";
  }
  if (!Number.isFinite(input.discount_value) || input.discount_value <= 0) {
    return "Valeur de réduction invalide.";
  }
  if (input.discount_type === "percent" && input.discount_value > 100) {
    return "La réduction en pourcentage ne peut pas dépasser 100%.";
  }
  if (
    input.min_amount_mad != null &&
    (!Number.isFinite(input.min_amount_mad) || input.min_amount_mad < 0)
  ) {
    return "Montant minimum invalide.";
  }
  if (
    input.max_uses != null &&
    (!Number.isInteger(input.max_uses) || input.max_uses < 1)
  ) {
    return "Nombre d'utilisations max invalide.";
  }
  if (input.valid_from && input.valid_until) {
    if (new Date(input.valid_from) >= new Date(input.valid_until)) {
      return "La date de fin doit être après la date de début.";
    }
  }
  return null;
}

export async function createPromoCode(
  input: PromoCodeInput
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validationError = validatePromoInput(input);
    if (validationError) return { ok: false, error: validationError };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("promo_codes").insert({
      code: normalizePromoCode(input.code),
      label: input.label.trim() || null,
      discount_type: input.discount_type,
      discount_value: input.discount_value,
      min_amount_mad: input.min_amount_mad,
      max_uses: input.max_uses,
      valid_from: input.valid_from || null,
      valid_until: input.valid_until || null,
      active: input.active,
    });
    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "Ce code promo existe déjà." };
      }
      throw new Error(error.message);
    }
    revalidatePath("/admin/promo-codes");
    return { ok: true, message: "Code promo créé." };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

export async function updatePromoCode(
  id: number,
  input: PromoCodeInput
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validationError = validatePromoInput(input);
    if (validationError) return { ok: false, error: validationError };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("promo_codes")
      .update({
        code: normalizePromoCode(input.code),
        label: input.label.trim() || null,
        discount_type: input.discount_type,
        discount_value: input.discount_value,
        min_amount_mad: input.min_amount_mad,
        max_uses: input.max_uses,
        valid_from: input.valid_from || null,
        valid_until: input.valid_until || null,
        active: input.active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "Ce code promo existe déjà." };
      }
      throw new Error(error.message);
    }
    revalidatePath("/admin/promo-codes");
    return { ok: true, message: "Code promo mis à jour." };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

export async function deletePromoCode(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("promo_codes").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/promo-codes");
    return { ok: true, message: "Code promo supprimé." };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

/** Fetch all bookings for one exact calendar day (Excel export). */
export async function fetchBookingsForExportDay(
  date: string,
  filters?: { status?: string; studioId?: number }
): Promise<
  | { ok: true; bookings: (Booking & { studios: Pick<Studio, "id" | "name"> | null })[] }
  | { ok: false; error: string }
> {
  try {
    await requireAdmin();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { ok: false, error: "Date invalide." };
    }

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("bookings")
      .select("*, studios(id, name)")
      .eq("date", date)
      .order("start_minutes", { ascending: true })
      .limit(500);

    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.studioId) query = query.eq("studio_id", filters.studioId);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return {
      ok: true,
      bookings: (data ?? []) as (Booking & {
        studios: Pick<Studio, "id" | "name"> | null;
      })[],
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erreur",
    };
  }
}

function trimOrEmpty(value: string): string {
  return value.trim();
}

function validateContactContent(input: ContactPageContent): string | null {
  if (!trimOrEmpty(input.pageTitle)) return "Le titre de la page contact est requis.";
  if (!trimOrEmpty(input.email)) return "L'email contact est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    return "Email contact invalide.";
  }
  if (!trimOrEmpty(input.address)) return "L'adresse est requise.";
  if (!trimOrEmpty(input.phone)) return "Le téléphone est requis.";
  return null;
}

function validateAboutContent(input: AboutPageContent): string | null {
  if (!trimOrEmpty(input.titlePrefix)) return "Le titre À propos est requis.";
  if (!trimOrEmpty(input.titleHighlight)) return "Le sous-titre mis en avant est requis.";
  if (!input.conceptParagraphs.some((p) => p.trim())) {
    return "Ajoutez au moins un paragraphe pour « Notre concept ».";
  }
  return null;
}

export async function updateSitePageContent(
  slug: SitePageSlug,
  content: ContactPageContent | AboutPageContent
): Promise<ActionResult> {
  try {
    await requireAdmin();

    if (slug === "contact") {
      const err = validateContactContent(content as ContactPageContent);
      if (err) return { ok: false, error: err };
    } else {
      const err = validateAboutContent(content as AboutPageContent);
      if (err) return { ok: false, error: err };
    }

    const supabase = getSupabaseAdmin();
    const payload = {
      slug,
      content,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("site_pages").upsert(payload, {
      onConflict: "slug",
    });
    if (error) throw new Error(error.message);

    revalidatePath("/admin/content");
    revalidatePath("/contact");
    revalidatePath("/about");
    revalidatePath("/preview/contact");
    revalidatePath("/preview/about");

    return { ok: true, message: "Contenu enregistré." };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}

/**
 * Danger zone: wipe all bookings (and reset promo usage counters).
 * Intended for clearing test data before go-live.
 */
export async function resetAllBookings(): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = getSupabaseAdmin();

    const { count, error: countError } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true });
    if (countError) throw new Error(countError.message);

    const total = count ?? 0;

    // Supabase requires a filter on delete — match all rows by created_at
    const { error: deleteError } = await supabase
      .from("bookings")
      .delete()
      .gte("created_at", "1970-01-01T00:00:00.000Z");
    if (deleteError) throw new Error(deleteError.message);

    // Reset promo usage counters so test codes can be reused
    const { error: promoError } = await supabase
      .from("promo_codes")
      .update({ uses_count: 0, updated_at: new Date().toISOString() })
      .gte("id", 0);
    if (promoError) {
      // Non-fatal: bookings are already cleared
      console.error("resetAllBookings: promo reset failed", promoError.message);
    }

    revalidateAdmin();
    revalidatePath("/admin/statistiques");
    revalidatePath("/admin/income");
    revalidatePath("/admin/promo-codes");
    revalidatePath("/reservation");

    return {
      ok: true,
      message:
        total === 0
          ? "Aucune réservation à supprimer."
          : `${total} réservation${total > 1 ? "s" : ""} supprimée${total > 1 ? "s" : ""}. Compteurs promo réinitialisés.`,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur" };
  }
}
