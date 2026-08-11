"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { resetAllBookings } from "@/app/admin/actions";
import { useAdminFeedback } from "@/components/admin/AdminFeedback";

/** Danger-zone control to wipe all bookings (test data). */
export default function ResetBookingsButton() {
  const { confirm, toast } = useAdminFeedback();
  const [isPending, startTransition] = useTransition();

  async function handleReset() {
    const ok = await confirm({
      title: "Réinitialiser toutes les réservations ?",
      description:
        "Cette action est irréversible. Toutes les réservations (tests et réelles) seront définitivement supprimées, et les compteurs d'utilisation des codes promo seront remis à zéro. Studios, horaires et paramètres restent inchangés.",
      confirmLabel: "Tout supprimer",
      cancelLabel: "Annuler",
      tone: "danger",
    });
    if (!ok) return;

    startTransition(async () => {
      const result = await resetAllBookings();
      if (!result.ok) {
        toast.error("Échec", result.error ?? "Impossible de tout supprimer.");
        return;
      }
      toast.success("Réinitialisation terminée", result.message);
    });
  }

  return (
    <section className="admin-card p-5 sm:p-6 space-y-4 border border-rose-400/25 bg-rose-400/[0.04]">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-300/80">
          Zone dangereuse
        </p>
        <h2 className="text-lg font-display font-bold text-white tracking-tight mt-1">
          Réinitialiser les réservations
        </h2>
        <p className="text-sm text-white/45 mt-1.5 leading-relaxed">
          Supprime toutes les réservations de la base (idéal après des tests).
          Les studios, tarifs et paramètres ne sont pas touchés.
        </p>
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={handleReset}
        className="inline-flex items-center gap-2 min-h-11 px-5 rounded-xl text-sm font-semibold text-white bg-rose-500/90 hover:bg-rose-500 border border-rose-300/30 disabled:opacity-60 transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Suppression…
          </>
        ) : (
          <>
            <Trash2 className="w-4 h-4" />
            Tout supprimer
          </>
        )}
      </button>
    </section>
  );
}
