-- Execute no SQL Editor do Supabase
-- Objetivo: ajustar a tabela public.users para fluxo de login com Google

alter table if exists public.users
  alter column tipo set default 'cliente';

alter table if exists public.users
  alter column tipo set not null;

alter table if exists public.users enable row level security;

drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_insert_own" on public.users;
drop policy if exists "users_update_own" on public.users;

create policy "users_select_own"
on public.users
for select
to authenticated
using (id = auth.uid());

create policy "users_insert_own"
on public.users
for insert
to authenticated
with check (id = auth.uid());

create policy "users_update_own"
on public.users
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());
