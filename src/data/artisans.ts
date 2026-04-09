export interface Artisan {
  id: string;
  name: string;
  storeName: string;
  avatar: string;
  banner: string;
  specialty: string;
  description: string;
  rating: number;
  totalProducts: number;
  location: string;
  categories: string[];
  activeCoupons: { code: string; discount: number; minValue: number }[];
  memberSince: string;
}

// Base estatica desativada: a aplicacao deve priorizar dados reais do banco.
export const artisans: Artisan[] = [];
