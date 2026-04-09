import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/data/products";

const PRODUCTS_QUERY_KEY = ["database-products"];
const STORES_QUERY_KEY = ["database-stores"];

export interface DbStore {
  id: string;
  nome: string;
  artesao_id: string;
}

export interface DatabaseProduct extends Product {
  loja_id: string;
}

const toUiProduct = (
  row: { id: string; nome: string; descricao: string | null; preco: number; loja_id: string },
  storesById: Map<string, DbStore>,
  usersById: Map<string, { id: string; nome: string; tipo: string }>,
): DatabaseProduct => {
  const store = storesById.get(row.loja_id);
  const artisan = store ? usersById.get(store.artesao_id) : null;

  return {
    id: row.id,
    name: row.nome,
    description: row.descricao ?? "Sem descricao informada.",
    price: Number(row.preco),
    artist: artisan?.nome ?? "Artesao",
    category: "Artesanal",
    image: "/placeholder.svg",
    materials: ["Nao informado"],
    stock: 999,
    loja_id: row.loja_id,
  };
};

const fetchStores = async (): Promise<DbStore[]> => {
  const { data, error } = await supabase.from("loja").select("id, nome, artesao_id").order("nome");
  if (error) throw error;
  return data ?? [];
};

const fetchProducts = async (): Promise<DatabaseProduct[]> => {
  const [{ data: productRows, error: productError }, { data: stores, error: storesError }, { data: users, error: usersError }] =
    await Promise.all([
      supabase.from("produto").select("id, nome, descricao, preco, loja_id").order("nome"),
      supabase.from("loja").select("id, nome, artesao_id"),
      supabase.from("users").select("id, nome, tipo"),
    ]);

  if (productError) throw productError;
  if (storesError) throw storesError;
  if (usersError) throw usersError;

  const storesById = new Map((stores ?? []).map((store) => [store.id, store]));
  const usersById = new Map((users ?? []).map((user) => [user.id, user]));

  return (productRows ?? []).map((row) => toUiProduct(row, storesById, usersById));
};

export const useDatabaseProducts = () => {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchProducts,
  });
};

export const useDatabaseStores = () => {
  return useQuery({
    queryKey: STORES_QUERY_KEY,
    queryFn: fetchStores,
  });
};

export const useCreateDatabaseProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { nome: string; descricao: string; preco: number; loja_id: string }) => {
      const { data, error } = await supabase
        .from("produto")
        .insert({
          nome: input.nome,
          descricao: input.descricao,
          preco: input.preco,
          loja_id: input.loja_id,
        })
        .select("id")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};

export const useDeleteDatabaseProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase.from("produto").delete().eq("id", productId);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};
