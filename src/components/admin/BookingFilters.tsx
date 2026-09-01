"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { Studio } from "@/lib/booking/types";
import { BOOKING_STATUS_LABELS } from "@/lib/booking/types";

const ACTIVE_STATUSES = ["pending", "confirmed", "completed"] as const;
const ARCHIVE_STATUSES = ["cancelled", "expired"] as const;

export default function BookingFilters({
  studios,
  archiveMode = false,
}: {
  studios: Studio[];
  archiveMode?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setParam = useCallback(
    (key: string, value: string, resetPage = false) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (resetPage) params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    if (search === (searchParams.get("q") ?? "")) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = search.trim();
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, searchParams, router, pathname]);

  const statusValue = searchParams.get("status") ?? "";
  const statusSelectValue = archiveMode
    ? statusValue === "cancelled" || statusValue === "expired"
      ? statusValue
      : "archive"
    : ACTIVE_STATUSES.includes(statusValue as (typeof ACTIVE_STATUSES)[number])
      ? statusValue
      : "";

  const statusOptions = archiveMode
    ? [
        { value: "archive", label: "Toutes les archives" },
        ...ARCHIVE_STATUSES.map((value) => ({
          value,
          label: BOOKING_STATUS_LABELS[value],
        })),
      ]
    : [
        { value: "", label: "Tous les statuts actifs" },
        ...ACTIVE_STATUSES.map((value) => ({
          value,
          label: BOOKING_STATUS_LABELS[value],
        })),
      ];

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative min-w-[13rem] flex-1 sm:flex-none">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input pl-9"
          placeholder="Client, référence, téléphone…"
          aria-label="Rechercher une réservation"
        />
      </div>

      <select
        value={statusSelectValue}
        onChange={(e) => setParam("status", e.target.value, true)}
        className="admin-input w-auto min-w-[10rem] cursor-pointer"
        aria-label="Filtrer par statut"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value || "all"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("studio") ?? ""}
        onChange={(e) => setParam("studio", e.target.value, true)}
        className="admin-input w-auto min-w-[9rem] cursor-pointer"
        aria-label="Filtrer par studio"
      >
        <option value="">Tous les studios</option>
        {studios.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={searchParams.get("from") ?? ""}
        onChange={(e) => setParam("from", e.target.value, true)}
        className="admin-input w-auto cursor-pointer"
        aria-label="À partir du"
      />
      <span className="text-xs text-white/30" aria-hidden>
        →
      </span>
      <input
        type="date"
        value={searchParams.get("to") ?? ""}
        onChange={(e) => setParam("to", e.target.value, true)}
        className="admin-input w-auto cursor-pointer"
        aria-label="Jusqu'au"
      />
    </div>
  );
}
