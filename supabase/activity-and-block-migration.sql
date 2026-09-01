-- Activity type + description on bookings, and internal calendar blocks.
-- Run in Supabase SQL editor.

alter table public.bookings
  add column if not exists activity_type text;

alter table public.bookings
  add column if not exists activity_description text;

-- Internal / personal blocks: occupy calendar, excluded from revenue.
alter table public.bookings
  add column if not exists is_internal boolean not null default false;

comment on column public.bookings.activity_type is
  'Type d''activité choisi par le client (danse, yoga, etc.).';

comment on column public.bookings.activity_description is
  'Précisions sur l''activité (optionnel).';

comment on column public.bookings.is_internal is
  'Blocage interne (séance perso / maintenance) : occupe le créneau, prix 0, hors CA.';

create index if not exists bookings_is_internal_idx
  on public.bookings (is_internal)
  where is_internal = true;
