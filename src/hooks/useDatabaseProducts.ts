import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/data/products";

const PRODUCTS_QUERY_KEY = ["database-products"];
const STORES_QUERY_KEY = ["database-stores"];

export interface DbStore {
  id: string;
  nome: string;
  artesao_id: string;
  background_image_data_url: string | null;
}

export interface DatabaseProduct extends Product {
  loja_id: string;
}

const toUiProduct = (
  row: {
    id: string;
    nome: string;
    descricao: string | null;
    categoria: string | null;
    preco: number;
    loja_id: string;
    image_data_url?: string | null;
  },
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
    category: row.categoria ?? "Artesanal",
    image: row.image_data_url ?? "/placeholder.svg",
    materials: ["Nao informado"],
    stock: 999,
    loja_id: row.loja_id,
  };
};

const fetchStores = async (): Promise<DbStore[]> => {
  const { data, error } = await supabase.from("loja").select("id, nome, artesao_id, background_image_data_url").order("nome");
  if (!error) return data ?? [];

  // Compatibilidade com banco sem coluna nova.
  if (error.code === "42703" || error.code === "PGRST204") {
    const { data: legacyData, error: legacyError } = await supabase.from("loja").select("id, nome, artesao_id").order("nome");
    if (legacyError) throw legacyError;
    return (legacyData ?? []).map((row) => ({ ...row, background_image_data_url: null }));
  }

  throw error;
};

const fetchProducts = async (): Promise<DatabaseProduct[]> => {
  const [{ data: storesWithImage, error: storesWithImageError }, { data: users }] = await Promise.all([
    supabase.from("loja").select("id, nome, artesao_id, background_image_data_url"),
    // Perfil do artesao e opcional aqui; se a policy bloquear, seguimos sem quebrar a tela.
    supabase.from("users").select("id, nome, tipo"),
  ]);

  let stores = storesWithImage;
  let storesError = storesWithImageError;

  if (storesWithImageError?.code === "42703" || storesWithImageError?.code === "PGRST204") {
    const { data: legacyStores, error: legacyStoresError } = await supabase.from("loja").select("id, nome, artesao_id");
    stores = (legacyStores ?? []).map((store) => ({ ...store, background_image_data_url: null }));
    storesError = legacyStoresError;
  }

  const { data: productsWithImageAndCategory, error: productsWithImageAndCategoryError } = await supabase
    .from("produto")
    .select("id, nome, descricao, categoria, preco, loja_id, image_data_url")
    .order("nome");

  let productRows = productsWithImageAndCategory;
  let productError = productsWithImageAndCategoryError;

  // Compatibilidade com banco parcialmente migrado:
  // tenta preservar o maximo de dados possiveis (categoria e/ou imagem).
  if (productsWithImageAndCategoryError?.code === "42703" || productsWithImageAndCategoryError?.code === "PGRST204") {
    const { data: productsWithCategoryOnly, error: productsWithCategoryOnlyError } = await supabase
      .from("produto")
      .select("id, nome, descricao, categoria, preco, loja_id")
      .order("nome");

    if (!productsWithCategoryOnlyError) {
      productRows = (productsWithCategoryOnly ?? []).map((row) => ({ ...row, image_data_url: null }));
      productError = null;
    } else {
      const { data: productsWithImageOnly, error: productsWithImageOnlyError } = await supabase
        .from("produto")
        .select("id, nome, descricao, preco, loja_id, image_data_url")
        .order("nome");

      if (!productsWithImageOnlyError) {
        productRows = (productsWithImageOnly ?? []).map((row) => ({ ...row, categoria: null }));
        productError = null;
      } else {
        const { data: productsLegacy, error: productsLegacyError } = await supabase
          .from("produto")
          .select("id, nome, descricao, preco, loja_id")
          .order("nome");
        productRows = (productsLegacy ?? []).map((row) => ({ ...row, categoria: null, image_data_url: null }));
        productError = productsLegacyError;
      }
    }
  }

  if (productError) throw productError;
  if (storesError) throw storesError;

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
    mutationFn: async (input: { nome: string; descricao: string; categoria: string; preco: number; loja_id: string }) => {
      const { data, error } = await supabase
        .from("produto")
        .insert({
          nome: input.nome,
          descricao: input.descricao,
          categoria: input.categoria,
          preco: input.preco,
          loja_id: input.loja_id,
        })
        .select("id")
        .single();

      if (!error) return data;

      // Banco legado sem coluna `categoria`: faz retry sem esse campo.
      if (error.code === "42703" || error.code === "PGRST204") {
        const { data: legacyData, error: legacyError } = await supabase
          .from("produto")
          .insert({
            nome: input.nome,
            descricao: input.descricao,
            preco: input.preco,
            loja_id: input.loja_id,
          })
          .select("id")
          .single();

        if (legacyError) throw legacyError;
        return legacyData;
      }

      throw error;
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
