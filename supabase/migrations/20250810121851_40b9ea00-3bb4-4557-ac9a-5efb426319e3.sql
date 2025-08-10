
-- 1) Ensure the first admin exists in admin_users (idempotent)
insert into public.admin_users (email, is_active, created_at)
select 'ankurvaibhav22@gmail.com', true, now()
where not exists (
  select 1 from public.admin_users where email = 'ankurvaibhav22@gmail.com'
);

-- 2) Fast lookup index for phone-based login
create index if not exists idx_users_phone on public.users (phone);

-- 3) RPC to safely get email by phone (bypasses RLS via SECURITY DEFINER)
create or replace function public.get_email_by_phone(_raw_phone text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.email
  from public.users u
  where u.phone = public.normalize_phone(_raw_phone)
  limit 1
$$;

-- Restrict and grant execution for frontend usage
revoke all on function public.get_email_by_phone(text) from public;
grant execute on function public.get_email_by_phone(text) to anon, authenticated;
