-- Execute no SQL Editor do Supabase APENAS se quiser zerar os dados atuais de teste do app.
-- Isso limpa tabelas public.* usadas pelo projeto.

begin;

truncate table public.item_pedido restart identity cascade;
truncate table public.pedido restart identity cascade;
truncate table public.produto restart identity cascade;
truncate table public.loja restart identity cascade;
truncate table public.users restart identity cascade;

commit;
