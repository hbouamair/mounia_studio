-- Payment status separate from booking confirmation.
-- Run in Supabase SQL editor.
--
-- Flow:
--   pending   = réservation reçue, à confirmer côté admin
--   confirmed = créneau confirmé (pas forcément payé)
--   payment_status = unpaid | paid  (marqué manuellement, parfois après la séance)

alter table public.bookings
  add column if not exists payment_status text;

-- Backfill: confirmation is NOT payment. Everything starts unpaid
-- (except internal blocks). Admin marks paid separately.
update public.bookings
set payment_status = case
  when coalesce(is_internal, false) = true then 'paid'
  else 'unpaid'
end
where payment_status is null;

alter table public.bookings
  alter column payment_status set default 'unpaid';

alter table public.bookings
  alter column payment_status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_payment_status_check'
  ) then
    alter table public.bookings
      add constraint bookings_payment_status_check
      check (payment_status in ('unpaid', 'paid'));
  end if;
end $$;

comment on column public.bookings.payment_status is
  'Paiement reçu (paid) ou non (unpaid). Indépendant du statut de réservation.';

create index if not exists bookings_payment_status_idx
  on public.bookings (payment_status);
