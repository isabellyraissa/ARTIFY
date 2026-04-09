-- Execute no SQL Editor do Supabase
-- Objetivo: corrigir RLS para login Google + fluxo comprador/artesao + loja/produto

alter table if exists public.users
  alter column tipo set default 'cliente';

alter table if exists public.users
  alter column tipo set not null;

alter table if exists public.users enable row level security;
alter table if exists public.loja enable row level security;
alter table if exists public.produto enable row level security;
alter table if exists public.pedido enable row level security;
alter table if exists public.item_pedido enable row level security;

-- USERS
drop policy if exists "users_select_all_authenticated" on public.users;
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_insert_own" on public.users;
drop policy if exists "users_update_own" on public.users;

create policy "users_select_all_authenticated"
on public.users
for select
to authenticated
using (true);

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

-- LOJA
drop policy if exists "loja_select_authenticated" on public.loja;
drop policy if exists "loja_insert_own_artisan" on public.loja;
drop policy if exists "loja_update_own_artisan" on public.loja;
drop policy if exists "loja_delete_own_artisan" on public.loja;

create policy "loja_select_authenticated"
on public.loja
for select
to authenticated
using (true);

create policy "loja_insert_own_artisan"
on public.loja
for insert
to authenticated
with check (
  artesao_id = auth.uid()
  and exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and lower(u.tipo) in ('artesao', 'vendedor')
  )
);

create policy "loja_update_own_artisan"
on public.loja
for update
to authenticated
using (artesao_id = auth.uid())
with check (artesao_id = auth.uid());

create policy "loja_delete_own_artisan"
on public.loja
for delete
to authenticated
using (artesao_id = auth.uid());

-- PRODUTO
drop policy if exists "produto_select_authenticated" on public.produto;
drop policy if exists "produto_insert_on_owned_store" on public.produto;
drop policy if exists "produto_update_on_owned_store" on public.produto;
drop policy if exists "produto_delete_on_owned_store" on public.produto;

create policy "produto_select_authenticated"
on public.produto
for select
to authenticated
using (true);

create policy "produto_insert_on_owned_store"
on public.produto
for insert
to authenticated
with check (
  exists (
    select 1
    from public.loja l
    where l.id = loja_id
      and l.artesao_id = auth.uid()
  )
);

create policy "produto_update_on_owned_store"
on public.produto
for update
to authenticated
using (
  exists (
    select 1
    from public.loja l
    where l.id = loja_id
      and l.artesao_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.loja l
    where l.id = loja_id
      and l.artesao_id = auth.uid()
  )
);

create policy "produto_delete_on_owned_store"
on public.produto
for delete
to authenticated
using (
  exists (
    select 1
    from public.loja l
    where l.id = loja_id
      and l.artesao_id = auth.uid()
  )
);

-- PEDIDO
drop policy if exists "pedido_select_own" on public.pedido;
drop policy if exists "pedido_insert_own" on public.pedido;
drop policy if exists "pedido_update_own" on public.pedido;

create policy "pedido_select_own"
on public.pedido
for select
to authenticated
using (comprador_id = auth.uid());

create policy "pedido_insert_own"
on public.pedido
for insert
to authenticated
with check (comprador_id = auth.uid());

create policy "pedido_update_own"
on public.pedido
for update
to authenticated
using (comprador_id = auth.uid())
with check (comprador_id = auth.uid());

-- ITEM_PEDIDO
drop policy if exists "item_pedido_select_own_order" on public.item_pedido;
drop policy if exists "item_pedido_insert_own_order" on public.item_pedido;
drop policy if exists "item_pedido_update_own_order" on public.item_pedido;
drop policy if exists "item_pedido_delete_own_order" on public.item_pedido;

create policy "item_pedido_select_own_order"
on public.item_pedido
for select
to authenticated
using (
  exists (
    select 1
    from public.pedido p
    where p.id = pedido_id
      and p.comprador_id = auth.uid()
  )
);

create policy "item_pedido_insert_own_order"
on public.item_pedido
for insert
to authenticated
with check (
  exists (
    select 1
    from public.pedido p
    where p.id = pedido_id
      and p.comprador_id = auth.uid()
  )
);

create policy "item_pedido_update_own_order"
on public.item_pedido
for update
to authenticated
using (
  exists (
    select 1
    from public.pedido p
    where p.id = pedido_id
      and p.comprador_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.pedido p
    where p.id = pedido_id
      and p.comprador_id = auth.uid()
  )
);

create policy "item_pedido_delete_own_order"
on public.item_pedido
for delete
to authenticated
using (
  exists (
    select 1
    from public.pedido p
    where p.id = pedido_id
      and p.comprador_id = auth.uid()
  )
);
