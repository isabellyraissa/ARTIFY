import { supabase } from "@/lib/supabase";

export const testarConexaoSupabase = async () => {
  const [{ count: usersCount, error: usersError }, { count: storesCount, error: storesError }] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("loja").select("*", { count: "exact", head: true }),
  ]);

  return {
    ok: !usersError && !storesError,
    usersCount: usersCount ?? 0,
    storesCount: storesCount ?? 0,
    usersError,
    storesError,
  };
};
