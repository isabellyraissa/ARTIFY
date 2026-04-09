import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY antes de rodar o teste.",
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testar() {
  const { data, error } = await supabase.from("item_pedido").select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

testar();
