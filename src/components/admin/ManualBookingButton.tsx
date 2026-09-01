"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, Plus, X } from "lucide-react";
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

function weekdayLabel(date: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const [y, m, d] = date.split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return WEEKDAY_FR[dow] ?? null;
}

function estimateWeeklyCount(startDate: string, months: 1 | 3 | 6): number {
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
  const [recurringMonths, setRecurringMonths] = useState<1 | 3 | 6>(3);
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

  function toggleInternal(next: boolean) {
    setIsInternal(next);
    if (next) {
      setName("Blocage interne");
      setEmail("");
      setPhone("");
      setStatus("confirmed");
      setSendEmail(false);
      setPaymentMethod("cash");
      setCustomPrice("");
      if (!note.trim()) setNote("Séance perso / indisponible");
    } else {
      setRecurring(false);
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
  }

  function submit() {
    setError(null);
    setSuccess(null);
    if (!date) {
      setError("La date est requise.");
      return;
    }
    if (!isInternal && (!name.trim() || !email.trim() || !phone.trim())) {
      setError("Date, nom, email et téléphone sont requis.");
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
      if (isInternal && recurring) {
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
        email: isInternal ? email : email,
        phone: isInternal ? phone : phone,
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
    "block text-xs font-semibold uppercase tracking-wider text-white/40 mb-1.5";

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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="manual-booking-title"
        >
          <div
            className="admin-card-soft w-full max-w-lg p-6 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2
                id="manual-booking-title"
                className="text-xl font-display font-bold text-white tracking-tight"
              >
                Réservation manuelle
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="admin-btn-ghost min-w-11 min-h-11 p-0"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => toggleInternal(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-violet-400"
                />
                <span>
                  <span className="block text-sm font-semibold text-white">
                    Blocage interne (séance perso / cours régulier)
                  </span>
                  <span className="block text-xs text-white/45 mt-0.5 leading-relaxed">
                    Occupe le calendrier, prix 0 MAD, hors chiffre
                    d&apos;affaires. Aucun email client.
                  </span>
                </span>
              </label>

              {isInternal && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={recurring}
                      onChange={(e) => setRecurring(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-violet-400"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-white">
                        Récurrence hebdomadaire
                      </span>
                      <span className="block text-xs text-white/45 mt-0.5 leading-relaxed">
                        Ex. Bachata chaque mercredi — un seul réglage pour tous
                        les créneaux.
                      </span>
                    </span>
                  </label>
                  {recurring && (
                    <div>
                      <label className={labelClass}>Durée de la série</label>
                      <select
                        value={recurringMonths}
                        onChange={(e) =>
                          setRecurringMonths(
                            Number(e.target.value) as 1 | 3 | 6
                          )
                        }
                        className={inputClass}
                      >
                        <option value={1}>1 mois</option>
                        <option value={3}>3 mois</option>
                        <option value={6}>6 mois</option>
                      </select>
                      {dayName && estimatedSlots > 0 && (
                        <p className="mt-2 text-xs text-white/50 leading-relaxed">
                          Tous les{" "}
                          <span className="text-white/80 font-medium">
                            {dayName}s
                          </span>{" "}
                          pendant {recurringMonths} mois ≈{" "}
                          <span className="text-teal-300 font-semibold">
                            {estimatedSlots} créneaux
                          </span>
                          . Les jours déjà réservés ou hors horaires sont
                          ignorés.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
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
                <div>
                  <label className={labelClass}>
                    {isInternal && recurring
                      ? "1ʳᵉ date (définit le jour)"
                      : "Date"}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                  />
                  {isInternal && recurring && dayName && (
                    <p className="mt-1.5 text-[11px] text-white/40">
                      Jour répété : chaque {dayName}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Heure de début</label>
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

              {!isInternal && (
                <>
                  <div>
                    <label className={labelClass}>
                      Prix (MAD) — optionnel
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
                          : "Laisser vide = calcul auto"
                      }
                    />
                    <p className="mt-1.5 text-[11px] text-white/40 leading-relaxed">
                      {customPrice.trim()
                        ? "Prix personnalisé appliqué."
                        : date
                          ? calculatedPriceMad != null
                            ? `Calcul auto selon ${studio?.name ?? "studio"} + horaire : ${formatMad(calculatedPriceMad)}`
                            : "Sélectionnez une date valide pour le calcul."
                          : "Choisissez une date pour voir le tarif calculé, ou saisissez un prix."}
                    </p>
                    {pricePreview != null &&
                      Number.isFinite(pricePreview) &&
                      pricePreview >= 0 && (
                        <p className="mt-2 text-sm font-semibold text-teal-300">
                          Total : {formatMad(pricePreview)}
                        </p>
                      )}
                  </div>

                  <div>
                    <label className={labelClass}>Nom du client</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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
                </>
              )}

              {isInternal && (
                <div>
                  <label className={labelClass}>Libellé (calendrier)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder={
                      recurring
                        ? "Ex. Cours Bachata"
                        : "Blocage interne"
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
                    isInternal && recurring
                      ? "Ex. Regular class Bachata"
                      : undefined
                  }
                />
              </div>

              {!isInternal && (
                <>
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
                        <option value="pending">En attente de paiement</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 rounded accent-teal-400"
                    />
                    Envoyer un email au client
                  </label>
                </>
              )}

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

              <button
                type="button"
                disabled={isPending}
                onClick={submit}
                className="admin-btn-primary w-full min-h-11"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création…
                  </>
                ) : isInternal && recurring ? (
                  `Bloquer ${estimatedSlots || "…"} créneaux`
                ) : isInternal ? (
                  "Bloquer le créneau"
                ) : (
                  "Créer la réservation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
