import { createClient } from "@supabase/supabase-js";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          nome: string;
          tipo: string;
        };
        Insert: {
          id: string;
          nome: string;
          tipo: string;
        };
        Update: {
          id?: string;
          nome?: string;
          tipo?: string;
        };
        Relationships: [];
      };
      loja: {
        Row: {
          id: string;
          nome: string;
          artesao_id: string;
        };
        Insert: {
          id?: string;
          nome: string;
          artesao_id: string;
        };
        Update: {
          id?: string;
          nome?: string;
          artesao_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "loja_artesao_id_fkey";
            columns: ["artesao_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      produto: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          preco: number;
          loja_id: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          preco: number;
          loja_id: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          preco?: number;
          loja_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "produto_loja_id_fkey";
            columns: ["loja_id"];
            referencedRelation: "loja";
            referencedColumns: ["id"];
          },
        ];
      };
      pedido: {
        Row: {
          id: string;
          comprador_id: string;
          criado_em: string | null;
        };
        Insert: {
          id?: string;
          comprador_id: string;
          criado_em?: string | null;
        };
        Update: {
          id?: string;
          comprador_id?: string;
          criado_em?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "pedido_comprador_id_fkey";
            columns: ["comprador_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      item_pedido: {
        Row: {
          id: string;
          pedido_id: string;
          produto_id: string;
          quantidade: number;
        };
        Insert: {
          id?: string;
          pedido_id: string;
          produto_id: string;
          quantidade: number;
        };
        Update: {
          id?: string;
          pedido_id?: string;
          produto_id?: string;
          quantidade?: number;
        };
        Relationships: [
          {
            foreignKeyName: "item_pedido_pedido_id_fkey";
            columns: ["pedido_id"];
            referencedRelation: "pedido";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "item_pedido_produto_id_fkey";
            columns: ["produto_id"];
            referencedRelation: "produto";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variaveis ausentes: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
