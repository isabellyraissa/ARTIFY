export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  artist: string;
  category: string;
  description: string;
  materials: string[];
  dimensions?: string;
  stock: number;
}

// Base estatica desativada: a aplicacao deve priorizar dados reais do banco.
export const products: Product[] = [];
