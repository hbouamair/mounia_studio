-- Fix: confirmed ≠ paid.
-- The first migration wrongly marked all confirmed/completed bookings as paid.
-- Run this in Supabase SQL editor once.
--
-- After this, only bookings you explicitly mark as paid (admin button) count in CA.
-- Re-mark the ones that were actually paid via « Enregistrer le paiement ».

update public.bookings
set
  payment_status = 'unpaid',
  updated_at = now()
where coalesce(is_internal, false) = false
  and payment_status = 'paid'
  and status in ('pending', 'confirmed', 'completed');

-- Internals stay paid / irrelevant for CA
update public.bookings
set payment_status = 'paid'
where coalesce(is_internal, false) = true
  and payment_status is distinct from 'paid';
