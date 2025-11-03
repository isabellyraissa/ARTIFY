import productCeramic from "@/assets/product-ceramic.jpg";
import productMacrame from "@/assets/product-macrame.jpg";
import productJewelry from "@/assets/product-jewelry.jpg";

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

export const products: Product[] = [
  {
    id: "1",
    name: "Conjunto de Tigelas Cerâmica Artesanal",
    price: 189.90,
    image: productCeramic,
    artist: "Maria Silva",
    category: "Cerâmica",
    description: "Conjunto exclusivo de tigelas em cerâmica artesanal. Cada peça é única, moldada e esmaltada à mão com técnicas tradicionais. Perfeito para servir ou decorar.",
    materials: ["Argila natural", "Esmalte atóxico"],
    dimensions: "Variadas: 8cm a 18cm de diâmetro",
    stock: 5,
  },
  {
    id: "2",
    name: "Painel Macramê com Contas de Madeira",
    price: 149.90,
    image: productMacrame,
    artist: "Ana Beatriz",
    category: "Decoração",
    description: "Lindo painel de macramê feito com cordão 100% algodão e contas de madeira natural. Adiciona charme rústico e elegante a qualquer ambiente.",
    materials: ["Cordão de algodão", "Contas de madeira"],
    dimensions: "80cm x 40cm",
    stock: 8,
  },
  {
    id: "3",
    name: "Colar Pedras Naturais Wire Wrap",
    price: 89.90,
    image: productJewelry,
    artist: "Juliana Costa",
    category: "Joias",
    description: "Colar artesanal com pingente de pedras naturais (turquesa e âmbar) envoltas em fio de cobre dourado. Técnica wire wrapping com acabamento premium.",
    materials: ["Fio de cobre dourado", "Pedras naturais", "Corrente"],
    dimensions: "Pingente: 5cm x 3cm, Corrente: 45cm",
    stock: 12,
  },
  {
    id: "4",
    name: "Vaso Rústico em Cerâmica",
    price: 129.90,
    image: productCeramic,
    artist: "Maria Silva",
    category: "Cerâmica",
    description: "Vaso artesanal com textura rústica e acabamento em tons terrosos. Ideal para suculentas e pequenas plantas.",
    materials: ["Argila natural", "Esmalte fosco"],
    dimensions: "15cm altura x 12cm diâmetro",
    stock: 10,
  },
  {
    id: "5",
    name: "Tapete Macramê Boho Chic",
    price: 199.90,
    image: productMacrame,
    artist: "Ana Beatriz",
    category: "Decoração",
    description: "Tapete de macramê estilo boho, perfeito para entrada ou sala. Design contemporâneo com franjas longas.",
    materials: ["Cordão de algodão grosso"],
    dimensions: "60cm x 90cm",
    stock: 6,
  },
  {
    id: "6",
    name: "Brincos Artesanais Dourados",
    price: 69.90,
    image: productJewelry,
    artist: "Juliana Costa",
    category: "Joias",
    description: "Par de brincos delicados com pedras semi-preciosas e acabamento em ouro velho. Leves e elegantes.",
    materials: ["Metal dourado", "Cristais naturais"],
    stock: 15,
  },
  {
    id: "7",
    name: "Jogo de Pratos Cerâmica Verde Sálvia",
    price: 249.90,
    image: productCeramic,
    artist: "Maria Silva",
    category: "Cerâmica",
    description: "Conjunto com 4 pratos em tons de verde sálvia e creme. Design minimalista e contemporâneo.",
    materials: ["Argila", "Esmalte cerâmico"],
    dimensions: "25cm de diâmetro cada",
    stock: 4,
  },
  {
    id: "8",
    name: "Cortina Macramê para Porta",
    price: 279.90,
    image: productMacrame,
    artist: "Ana Beatriz",
    category: "Decoração",
    description: "Cortina divisória em macramê, perfeita para separar ambientes com estilo. Padrão complexo e acabamento impecável.",
    materials: ["Cordão de algodão", "Varão de madeira"],
    dimensions: "200cm x 90cm",
    stock: 3,
  },
];
