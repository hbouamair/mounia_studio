"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, Loader2, Plus, Repeat, X } from "lucide-react";
import type { PaymentMethod, PeakWindow, Studio } from "@/lib/booking/types";
import {
  computeBookingPrice,
  durationOptions,
  formatDurationLabel,
  formatMad,
  minutesToTimeString,
  SLOT_STEP_MINUTES,
} from "@/lib/booking/pricing";
import {
  createManualBooking,
  createRecurringInternalBlocks,
  createRecurringManualBookings,
  type RecurringMonths,
} from "@/app/admin/actions";

/** Start-time options every 30 min between 06:00 and 23:30. */
const START_OPTIONS = Array.from(
  { length: (24 - 6) * 2 },
  (_, i) => 6 * 60 + i * SLOT_STEP_MINUTES
);

const WEEKDAY_FR = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
] as const;

const MONTH_OPTIONS: RecurringMonths[] = [1, 2, 3, 6];

function weekdayLabel(date: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const [y, m, d] = date.split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return WEEKDAY_FR[dow] ?? null;
}

function estimateWeeklyCount(startDate: string, months: RecurringMonths): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return 0;
  const [y, m, d] = startDate.split("-").map(Number);
  const start = Date.UTC(y, m - 1, d);
  const endDt = new Date(Date.UTC(y, m - 1, d));
  endDt.setUTCMonth(endDt.getUTCMonth() + months);
  const end = endDt.getTime();
  let n = 0;
  for (let t = start; t < end; t += 7 * 24 * 60 * 60 * 1000) n += 1;
  return n;
}

export default function ManualBookingButton({
  studios,
  peakWindows,
}: {
  studios: Studio[];
  peakWindows: PeakWindow[];
}) {
  const [open, setOpen] = useState(false);
  const [studioId, setStudioId] = useState(studios[0]?.id ?? 0);
  const [date, setDate] = useState("");
  const [startMinutes, setStartMinutes] = useState(18 * 60);
  const [duration, setDuration] = useState(60);
  const [isInternal, setIsInternal] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [recurringMonths, setRecurringMonths] = useState<RecurringMonths>(3);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [status, setStatus] = useState<"pending" | "confirmed">("confirmed");
  const [sendEmail, setSendEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const dayName = weekdayLabel(date);
  const estimatedSlots = recurring
    ? estimateWeeklyCount(date, recurringMonths)
    : 0;

  const studio = studios.find((s) => s.id === studioId) ?? studios[0];

  const calculatedPriceMad = useMemo(() => {
    if (isInternal || !studio || !date) return null;
    try {
      return computeBookingPrice(
        studio,
        date,
        startMinutes,
        duration,
        peakWindows
      ).totalMad;
    } catch {
      return null;
    }
  }, [isInternal, studio, date, startMinutes, duration, peakWindows]);

  const pricePreview =
    customPrice.trim() !== ""
      ? Number(customPrice.replace(",", "."))
      : calculatedPriceMad;

  const seriesTotalPreview =
    !isInternal &&
    recurring &&
    estimatedSlots > 0 &&
    pricePreview != null &&
    Number.isFinite(pricePreview)
      ? pricePreview * estimatedSlots
      : null;

  function setMode(internal: boolean) {
    setIsInternal(internal);
    setError(null);
    setSuccess(null);
    if (internal) {
      setName((n) => (n.trim() && n !== "Blocage interne" ? n : "Blocage interne"));
      setEmail("");
      setPhone("");
      setStatus("confirmed");
      setSendEmail(false);
      setPaymentMethod("cash");
      setCustomPrice("");
      if (!note.trim()) setNote("Séance perso / indisponible");
    } else {
      setName((n) => (n === "Blocage interne" ? "" : n));
      setSendEmail(true);
      if (note === "Séance perso / indisponible") setNote("");
    }
  }

  function resetFormAfterSuccess() {
    setName("");
    setEmail("");
    setPhone("");
    setNote("");
    setCustomPrice("");
    setIsInternal(false);
    setRecurring(false);
    setRecurringMonths(3);
    setSendEmail(true);
    setStatus("confirmed");
    setPaymentMethod("cash");
  }

  function closeModal() {
    setOpen(false);
    setError(null);
    setSuccess(null);
  }

  function submit() {
    setError(null);
    setSuccess(null);
    if (!date) {
      setError("La date est requise.");
      return;
    }
    if (!isInternal && (!name.trim() || !email.trim() || !phone.trim())) {
      setError("Nom, email et téléphone sont requis.");
      return;
    }
    if (!isInternal && customPrice.trim() !== "") {
      const n = Number(customPrice.replace(",", "."));
      if (!Number.isFinite(n) || n < 0) {
        setError("Prix invalide.");
        return;
      }
    }

    startTransition(async () => {
      if (recurring && isInternal) {
        const result = await createRecurringInternalBlocks({
          studioId,
          startDate: date,
          startMinutes,
          durationMinutes: duration,
          months: recurringMonths,
          name: name.trim() || "Cours régulier (blocage)",
          note: note || undefined,
        });
        if (!result.ok) {
          setError(result.error ?? "Erreur");
          return;
        }
        setSuccess(result.message ?? "Créneaux bloqués.");
        resetFormAfterSuccess();
        return;
      }

      if (recurring && !isInternal) {
        const custom =
          customPrice.trim() !== ""
            ? Number(customPrice.replace(",", "."))
            : undefined;
        const result = await createRecurringManualBookings({
          studioId,
          startDate: date,
          startMinutes,
          durationMinutes: duration,
          months: recurringMonths,
          name: name.trim(),
          email,
          phone,
          note: note || undefined,
          paymentMethod,
          status,
          sendEmail,
          totalPriceMad: custom,
        });
        if (!result.ok) {
          setError(result.error ?? "Erreur");
          return;
        }
        setSuccess(result.message ?? "Réservations créées.");
        resetFormAfterSuccess();
        return;
      }

      const custom =
        !isInternal && customPrice.trim() !== ""
          ? Number(customPrice.replace(",", "."))
          : undefined;
      const result = await createManualBooking({
        studioId,
        date,
        startMinutes,
        durationMinutes: duration,
        name: isInternal ? name.trim() || "Blocage interne" : name,
        email,
        phone,
        note: note || undefined,
        paymentMethod,
        status: isInternal ? "confirmed" : status,
        sendEmail: isInternal ? false : sendEmail,
        isInternal,
        totalPriceMad: custom,
      });
      if (!result.ok) {
        setError(result.error ?? "Erreur");
        return;
      }
      setSuccess(
        isInternal
          ? `Créneau bloqué (${result.reference}).`
          : `Réservation ${result.reference} créée.`
      );
      resetFormAfterSuccess();
    });
  }

  const inputClass = "admin-input";
  const labelClass =
    "block text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1.5";

  const ctaLabel = isPending
    ? null
    : recurring && isInternal
      ? `Bloquer ${estimatedSlots || "…"} créneaux`
      : recurring && !isInternal
        ? `Créer ${estimatedSlots || "…"} réservations`
        : isInternal
          ? "Bloquer le créneau"
          : "Créer la réservation";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="admin-btn-primary min-h-11"
      >
        <Plus className="w-4 h-4" aria-hidden />
        Réservation manuelle
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="manual-booking-title"
        >
          <div
            className="admin-card-soft w-full max-w-xl my-6 sm:my-10 overflow-hidden flex flex-col max-h-[min(92vh,880px)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-white/[0.07]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-300/80 mb-1">
                  Admin
                </p>
                <h2
                  id="manual-booking-title"
                  className="text-xl font-display font-bold text-white tracking-tight"
                >
                  Nouvelle réservation
                </h2>
                <p className="text-xs text-white/40 mt-1 leading-relaxed">
                  Client ou blocage interne — ponctuel ou hebdomadaire.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="admin-btn-ghost min-w-10 min-h-10 p-0 shrink-0"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
              {/* Mode */}
              <div>
                <p className={labelClass}>Type</p>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setMode(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      !isInternal
                        ? "bg-teal-400/15 text-teal-200 border border-teal-400/35"
                        : "text-white/50 hover:text-white/80 border border-transparent"
                    }`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode(true)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isInternal
                        ? "bg-violet-400/15 text-violet-200 border border-violet-400/35"
                        : "text-white/50 hover:text-white/80 border border-transparent"
                    }`}
                  >
                    Blocage interne
                  </button>
                </div>
                {isInternal && (
                  <p className="mt-2 text-[11px] text-white/40 leading-relaxed">
                    Occupe le calendrier · 0 MAD · hors CA · pas d&apos;email
                  </p>
                )}
              </div>

              {/* Recurrence */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded accent-teal-400"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Repeat className="w-3.5 h-3.5 text-teal-300/80 shrink-0" />
                      Récurrence hebdomadaire
                    </span>
                    <span className="block text-xs text-white/45 mt-0.5 leading-relaxed">
                      Ex. chaque lundi pendant 1, 2, 3 ou 6 mois.
                    </span>
                  </span>
                </label>

                {recurring && (
                  <div className="space-y-2.5 pl-7">
                    <p className={labelClass}>Durée de la série</p>
                    <div className="flex flex-wrap gap-2">
                      {MONTH_OPTIONS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setRecurringMonths(m)}
                          className={`min-h-9 px-3.5 rounded-lg text-sm font-semibold border transition-colors ${
                            recurringMonths === m
                              ? "border-teal-400/50 bg-teal-400/15 text-teal-200"
                              : "border-white/10 bg-white/[0.03] text-white/55 hover:text-white/80"
                          }`}
                        >
                          {m} mois
                        </button>
                      ))}
                    </div>
                    {dayName && estimatedSlots > 0 && (
                      <p className="text-xs text-white/50 leading-relaxed flex items-start gap-2">
                        <CalendarDays className="w-3.5 h-3.5 mt-0.5 text-teal-300/70 shrink-0" />
                        <span>
                          Tous les{" "}
                          <span className="text-white/80 font-medium">
                            {dayName}s
                          </span>{" "}
                          ≈{" "}
                          <span className="text-teal-300 font-semibold">
                            {estimatedSlots} créneaux
                          </span>
                          . Les jours déjà pris ou hors horaires sont ignorés.
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Slot */}
              <div>
                <p className={labelClass}>Créneau</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className={labelClass}>Studio</label>
                    <select
                      value={studioId}
                      onChange={(e) => setStudioId(Number(e.target.value))}
                      className={inputClass}
                    >
                      {studios.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className={labelClass}>
                      {recurring ? "1ʳᵉ date (définit le jour)" : "Date"}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={inputClass}
                    />
                    {recurring && dayName && (
                      <p className="mt-1.5 text-[11px] text-white/40">
                        Jour répété : chaque {dayName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Heure</label>
                    <select
                      value={startMinutes}
                      onChange={(e) => setStartMinutes(Number(e.target.value))}
                      className={inputClass}
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
                    >
                      {durationOptions().map((d) => (
                        <option key={d} value={d}>
                          {formatDurationLabel(d)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Client fields */}
              {!isInternal && (
                <div className="space-y-3">
                  <p className={labelClass}>Client & paiement</p>
                  <div>
                    <label className={labelClass}>Nom</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      placeholder="Nom du client"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Téléphone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Prix / séance (MAD) — optionnel
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className={inputClass}
                      placeholder={
                        calculatedPriceMad != null
                          ? `Auto : ${calculatedPriceMad}`
                          : "Vide = calcul auto"
                      }
                    />
                    <p className="mt-1.5 text-[11px] text-white/40 leading-relaxed">
                      {customPrice.trim()
                        ? "Prix personnalisé par séance."
                        : date && calculatedPriceMad != null
                          ? `Auto (${studio?.name ?? "studio"}) : ${formatMad(calculatedPriceMad)}`
                          : "Choisissez une date pour le tarif auto."}
                    </p>
                    {pricePreview != null &&
                      Number.isFinite(pricePreview) &&
                      pricePreview >= 0 && (
                        <p className="mt-2 text-sm font-semibold text-teal-300">
                          {recurring && estimatedSlots > 0
                            ? `${formatMad(pricePreview)} × ${estimatedSlots} = ${formatMad(seriesTotalPreview ?? 0)}`
                            : `Total : ${formatMad(pricePreview)}`}
                        </p>
                      )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Paiement</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as PaymentMethod)
                        }
                        className={inputClass}
                      >
                        <option value="cash">Espèces au studio</option>
                        <option value="virement">Virement bancaire</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Statut</label>
                      <select
                        value={status}
                        onChange={(e) =>
                          setStatus(e.target.value as "pending" | "confirmed")
                        }
                        className={inputClass}
                      >
                        <option value="confirmed">Confirmée (payée)</option>
                        <option value="pending">En attente</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 text-sm text-white/75 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 rounded accent-teal-400"
                    />
                    {recurring
                      ? "Envoyer un email (1ʳᵉ séance)"
                      : "Envoyer un email au client"}
                  </label>
                </div>
              )}

              {/* Internal label */}
              {isInternal && (
                <div>
                  <label className={labelClass}>Libellé (calendrier)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder={
                      recurring ? "Ex. Cours Bachata" : "Blocage interne"
                    }
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>
                  {isInternal ? "Motif (optionnel)" : "Note (optionnel)"}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={inputClass}
                  placeholder={
                    recurring
                      ? isInternal
                        ? "Ex. Regular class Bachata"
                        : "Ex. Pack hebdo lundi"
                      : undefined
                  }
                />
              </div>

              {error && (
                <p className="text-sm font-semibold text-rose-300 bg-rose-400/10 border border-rose-400/25 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm font-semibold text-teal-300 bg-teal-400/10 border border-teal-400/25 rounded-xl px-4 py-3">
                  {success}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-4 border-t border-white/[0.07] bg-black/20 flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="admin-btn-ghost min-h-11 px-4"
                disabled={isPending}
              >
                Fermer
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={submit}
                className="admin-btn-primary min-h-11 px-5 sm:min-w-[220px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création…
                  </>
                ) : (
                  ctaLabel
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
