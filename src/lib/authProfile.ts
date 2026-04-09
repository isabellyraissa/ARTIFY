import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const pickDisplayName = (user: User) => {
  const metadataName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined);
  if (metadataName && metadataName.trim().length > 0) return metadataName.trim();
  if (user.email) return user.email.split("@")[0];
  return "Usuario";
};

const normalizeTipo = (value: unknown) => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized.length === 0) return null;
  return normalized;
};

export const ensureUserProfile = async (user: User) => {
  const nome = pickDisplayName(user);
  const { data: existingProfile, error: existingProfileError } = await supabase
    .from("users")
    .select("id, tipo")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfileError) return existingProfileError;

  if (existingProfile) {
    const { error } = await supabase.from("users").update({ nome }).eq("id", user.id);
    return error;
  }

  const metadataTipo =
    normalizeTipo(user.user_metadata?.tipo) ??
    normalizeTipo(user.user_metadata?.user_type) ??
    normalizeTipo(user.user_metadata?.role);

  const tipoCandidates = Array.from(
    new Set([metadataTipo, "cliente", "comprador", "usuario", "vendedor", "artesao"].filter(Boolean)),
  ) as string[];

  let lastError: Error | null = null;

  for (const tipo of tipoCandidates) {
    const { error } = await supabase.from("users").insert({
      id: user.id,
      nome,
      tipo,
    });

    if (!error) return null;
    if (error.code === "23505") {
      const { error: updateError } = await supabase.from("users").update({ nome }).eq("id", user.id);
      return updateError;
    }
    lastError = error;
  }

  return lastError;
};
