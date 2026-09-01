"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2, Pencil, Save, X } from "lucide-react";
import type {
  BookingWithStudio,
  CourseType,
  PaymentMethod,
  Studio,
} from "@/lib/booking/types";
import { ACTIVITY_TYPES } from "@/lib/booking/types";
import {
  durationOptions,
  formatDurationLabel,
  minutesToTimeString,
  SLOT_STEP_MINUTES,
} from "@/lib/booking/pricing";
import { updateBooking } from "@/app/admin/actions";
import { useAdminFeedback } from "@/components/admin/AdminFeedback";

const START_OPTIONS = Array.from(
  { length: (24 - 6) * 2 },
  (_, i) => 6 * 60 + i * SLOT_STEP_MINUTES
);

function resolveActivity(booking: BookingWithStudio): {
  type: string;
  description: string;
} {
  let type = booking.activity_type?.trim() || "";
  let description = booking.activity_description?.trim() || "";
  if ((!type || !description) && booking.note) {
    const typeMatch = booking.note.match(/Activité\s*:\s*([^·|]+)/i);
    const descMatch = booking.note.match(
      /(?:Détail|Description)\s*:\s*([^·|]+)/i
    );
    if (!type && typeMatch?.[1]) type = typeMatch[1].trim();
    if (!description && descMatch?.[1]) description = descMatch[1].trim();
  }
  return { type, description };
}

export default function EditBookingDialog({
  booking,
  studios,
  open,
  onClose,
}: {
  booking: BookingWithStudio;
  studios: Studio[];
  open: boolean;
  onClose: () => void;
}) {
  const activity = resolveActivity(booking);
  const [studioId, setStudioId] = useState(booking.studio_id);
  const [date, setDate] = useState(booking.date);
  const [startMinutes, setStartMinutes] = useState(booking.start_minutes);
  const [duration, setDuration] = useState(booking.duration_minutes);
  const [name, setName] = useState(booking.customer_name);
  const [email, setEmail] = useState(booking.customer_email);
  const [phone, setPhone] = useState(booking.customer_phone);
  const [courseType, setCourseType] = useState<CourseType>(
    booking.course_type === "private" ? "private" : "group"
  );
  const [activityType, setActivityType] = useState(activity.type);
  const [activityDescription, setActivityDescription] = useState(
    activity.description
  );
  const [note, setNote] = useState(booking.note ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    booking.payment_method
  );
  const [totalPriceMad, setTotalPriceMad] = useState(
    String(Number(booking.total_price_mad))
  );
  const [recalculatePrice, setRecalculatePrice] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useAdminFeedback();

  // Reset form when dialog opens for this booking
  useEffect(() => {
    if (!open) return;
    const next = resolveActivity(booking);
    setStudioId(booking.studio_id);
    setDate(booking.date);
    setStartMinutes(booking.start_minutes);
    setDuration(booking.duration_minutes);
    setName(booking.customer_name);
    setEmail(booking.customer_email);
    setPhone(booking.customer_phone);
    setCourseType(booking.course_type === "private" ? "private" : "group");
    setActivityType(next.type);
    setActivityDescription(next.description);
    setNote(booking.note ?? "");
    setPaymentMethod(booking.payment_method);
    setTotalPriceMad(String(Number(booking.total_price_mad)));
    setRecalculatePrice(false);
  }, [open, booking]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isPending, onClose]);

  const labelClass =
    "block text-[10px] font-bold uppercase tracking-[0.1em] text-white/40 mb-1.5";
  const inputClass = "admin-input";
  const canEdit =
    booking.status === "pending" || booking.status === "confirmed";

  function submit() {
    if (!canEdit) return;
    startTransition(async () => {
      const result = await updateBooking(booking.id, {
        studioId,
        date,
        startMinutes,
        durationMinutes: duration,
        name,
        email,
        phone,
        note: note || undefined,
        activityType: activityType || undefined,
        activityDescription: activityDescription || undefined,
        courseType,
        paymentMethod,
        recalculatePrice: booking.is_internal ? false : recalculatePrice,
        totalPriceMad: booking.is_internal
          ? 0
          : Number(totalPriceMad.replace(",", ".")),
      });
      if (!result.ok) {
        toast.error("Échec", result.error ?? "Impossible de modifier.");
        return;
      }
      toast.success("Réservation modifiée", result.message);
      onClose();
    });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={() => {
        if (!isPending) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-booking-title"
    >
      <div
        className="admin-card-soft w-full max-w-2xl p-5 sm:p-6 my-8 shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-300/80 mb-1">
              Modification
            </p>
            <h2
              id="edit-booking-title"
              className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-2"
            >
              <Pencil className="w-5 h-5 text-teal-300 shrink-0" aria-hidden />
              {booking.reference}
            </h2>
            <p className="text-sm text-white/45 mt-1">
              {booking.customer_name}
              {booking.is_internal ? " · Interne" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="admin-btn-ghost min-w-11 min-h-11 p-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!canEdit && (
          <p className="mb-4 text-sm text-amber-200/90 bg-amber-400/10 border border-amber-400/20 rounded-xl px-3 py-2">
            Cette réservation ({booking.status}) ne peut plus être modifiée.
          </p>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Studio</label>
              <select
                value={studioId}
                onChange={(e) => setStudioId(Number(e.target.value))}
                className={inputClass}
                disabled={!canEdit || isPending}
              >
                {studios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Type de cours</label>
              <select
                value={courseType}
                onChange={(e) => setCourseType(e.target.value as CourseType)}
                className={inputClass}
                disabled={!canEdit || isPending || booking.is_internal}
              >
                <option value="group">Groupe</option>
                <option value="private">Privé</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
                disabled={!canEdit || isPending}
              />
            </div>
            <div>
              <label className={labelClass}>Heure de début</label>
              <select
                value={startMinutes}
                onChange={(e) => setStartMinutes(Number(e.target.value))}
                className={inputClass}
                disabled={!canEdit || isPending}
              >
                {START_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {minutesToTimeString(m)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Durée</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={inputClass}
                disabled={!canEdit || isPending}
              >
                {durationOptions().map((d) => (
                  <option key={d} value={d}>
                    {formatDurationLabel(d)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Paiement</label>
              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
                className={inputClass}
                disabled={!canEdit || isPending || booking.is_internal}
              >
                <option value="cash">Espèces</option>
                <option value="virement">Virement</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                disabled={!canEdit || isPending}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                disabled={!canEdit || isPending || booking.is_internal}
              />
            </div>
            <div>
              <label className={labelClass}>Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                disabled={!canEdit || isPending || booking.is_internal}
              />
            </div>
          </div>

          {!booking.is_internal && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Type d&apos;activité</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className={inputClass}
                  disabled={!canEdit || isPending}
                >
                  <option value="">—</option>
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Description activité</label>
                <input
                  type="text"
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  className={inputClass}
                  disabled={!canEdit || isPending}
                  placeholder="Précisez l'activité…"
                />
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Note client</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputClass}
              disabled={!canEdit || isPending}
            />
          </div>

          {!booking.is_internal && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div>
                <label className={labelClass}>Prix (MAD)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={totalPriceMad}
                  onChange={(e) => {
                    setTotalPriceMad(e.target.value);
                    setRecalculatePrice(false);
                  }}
                  className={inputClass}
                  disabled={!canEdit || isPending || recalculatePrice}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-white/75 pb-2">
                <input
                  type="checkbox"
                  checked={recalculatePrice}
                  onChange={(e) => setRecalculatePrice(e.target.checked)}
                  className="w-4 h-4 rounded accent-teal-400"
                  disabled={!canEdit || isPending}
                />
                Recalculer le prix selon le tarif studio
              </label>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-white/[0.07]">
            <button
              type="button"
              onClick={onClose}
              className="admin-btn-ghost min-h-11"
              disabled={isPending}
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!canEdit || isPending}
              className="admin-btn-primary min-h-11"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
