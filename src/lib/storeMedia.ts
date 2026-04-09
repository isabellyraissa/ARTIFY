import { supabase } from "@/lib/supabase";
import type { PostgrestError } from "@supabase/supabase-js";

export const isMissingImageColumnError = (error?: PostgrestError | null) => {
  if (!error) return false;
  if (error.code === "42703" || error.code === "PGRST204") return true;
  const message = (error.message ?? "").toLowerCase();
  return message.includes("schema cache") || message.includes("column");
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Falha ao converter imagem para Data URL."));
    };
    reader.onerror = () => reject(new Error("Falha ao ler arquivo de imagem."));
    reader.readAsDataURL(file);
  });

export const uploadStoreBackground = async (storeId: string, file: File) => {
  const imageDataUrl = await fileToDataUrl(file);
  const result = await supabase
    .from("loja")
    .update({ background_image_data_url: imageDataUrl })
    .eq("id", storeId)
    .select("id")
    .maybeSingle();

  if (!result.error && !result.data) {
    return {
      ...result,
      error: {
        code: "NO_ROWS_UPDATED",
        message: "Nenhuma loja foi atualizada para salvar o plano de fundo.",
        details: "",
        hint: "",
        name: "PostgrestError",
      } as PostgrestError,
    };
  }

  return result;
};

export const uploadProductImage = async (productId: string, file: File) => {
  const imageDataUrl = await fileToDataUrl(file);
  const result = await supabase
    .from("produto")
    .update({ image_data_url: imageDataUrl })
    .eq("id", productId)
    .select("id")
    .maybeSingle();

  if (!result.error && !result.data) {
    return {
      ...result,
      error: {
        code: "NO_ROWS_UPDATED",
        message: "Nenhum produto foi atualizado para salvar a imagem.",
        details: "",
        hint: "",
        name: "PostgrestError",
      } as PostgrestError,
    };
  }

  return result;
};

export const uploadArtisanProfileImage = async (artesaoId: string, file: File) => {
  const imageDataUrl = await fileToDataUrl(file);
  const result = await supabase
    .from("users")
    .update({ avatar_image_data_url: imageDataUrl })
    .eq("id", artesaoId)
    .select("id")
    .maybeSingle();

  if (!result.error && !result.data) {
    return {
      ...result,
      error: {
        code: "NO_ROWS_UPDATED",
        message: "Nenhum perfil de artesao foi atualizado para salvar a foto.",
        details: "",
        hint: "",
        name: "PostgrestError",
      } as PostgrestError,
    };
  }

  return result;
};

export const removeStoreBackground = async (storeId: string) => {
  return supabase.from("loja").update({ background_image_data_url: null }).eq("id", storeId);
};

export const removeProductImage = async (productId: string) => {
  return supabase.from("produto").update({ image_data_url: null }).eq("id", productId);
};

export const removeArtisanProfileImage = async (artesaoId: string) => {
  return supabase.from("users").update({ avatar_image_data_url: null }).eq("id", artesaoId);
};
