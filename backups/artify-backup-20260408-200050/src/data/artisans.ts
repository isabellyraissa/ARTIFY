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

export const artisans: Artisan[] = [
  {
    id: "art1",
    name: "Maria Silva",
    storeName: "Cerâmica da Maria",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&h=400&fit=crop",
    specialty: "Cerâmica Artesanal",
    description: "Criando peças únicas em cerâmica há mais de 15 anos. Cada item é moldado à mão com técnicas tradicionais e esmaltes naturais.",
    rating: 4.9,
    totalProducts: 45,
    location: "São Paulo, SP",
    categories: ["Cerâmica", "Decoração"],
    activeCoupons: [
      { code: "MARIA10", discount: 10, minValue: 100 },
      { code: "PRIMEIRA20", discount: 20, minValue: 200 }
    ],
    memberSince: "2020"
  },
  {
    id: "art2",
    name: "Ana Beatriz",
    storeName: "Macramê & Cia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&h=400&fit=crop",
    specialty: "Macramê e Decoração",
    description: "Apaixonada por macramê e decoração boho. Transformo fios em arte para deixar sua casa mais aconchegante e única.",
    rating: 5.0,
    totalProducts: 38,
    location: "Rio de Janeiro, RJ",
    categories: ["Decoração", "Macramê"],
    activeCoupons: [
      { code: "BEMVINDO15", discount: 15, minValue: 150 }
    ],
    memberSince: "2019"
  },
  {
    id: "art3",
    name: "Juliana Costa",
    storeName: "Joias Artesanais JC",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=400&fit=crop",
    specialty: "Joalheria Artesanal",
    description: "Designer de joias com foco em pedras naturais e metais nobres. Cada peça conta uma história única.",
    rating: 4.8,
    totalProducts: 67,
    location: "Belo Horizonte, MG",
    categories: ["Joias", "Acessórios"],
    activeCoupons: [
      { code: "JOIAS25", discount: 25, minValue: 250 }
    ],
    memberSince: "2021"
  },
  {
    id: "art4",
    name: "Clara Gomes",
    storeName: "Crochê com Amor",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=1200&h=400&fit=crop",
    specialty: "Crochê e Amigurumi",
    description: "Criando amigurumis e peças de crochê cheias de amor e carinho. Cada item é feito com fios de alta qualidade.",
    rating: 4.9,
    totalProducts: 52,
    location: "Curitiba, PR",
    categories: ["Crochê", "Brinquedos", "Decoração"],
    activeCoupons: [],
    memberSince: "2020"
  },
  {
    id: "art5",
    name: "Rafael Pinto",
    storeName: "Arte em Tela",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=400&fit=crop",
    specialty: "Pintura e Escultura",
    description: "Artista plástico especializado em pinturas abstratas e esculturas minimalistas em madeira.",
    rating: 4.7,
    totalProducts: 28,
    location: "Porto Alegre, RS",
    categories: ["Pintura", "Escultura", "Arte"],
    activeCoupons: [
      { code: "ARTE30", discount: 30, minValue: 300 }
    ],
    memberSince: "2018"
  },
  {
    id: "art6",
    name: "Papelaria Aurora",
    storeName: "Aurora Papelaria",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=400&fit=crop",
    specialty: "Papelaria Artística",
    description: "Cadernos, planners e itens de papelaria feitos à mão com muito cuidado e criatividade.",
    rating: 4.8,
    totalProducts: 41,
    location: "Florianópolis, SC",
    categories: ["Papelaria", "Presente"],
    activeCoupons: [
      { code: "PAPEL10", discount: 10, minValue: 50 }
    ],
    memberSince: "2021"
  },
  {
    id: "art7",
    name: "Eco Arte",
    storeName: "Eco Arte Sustentável",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&h=400&fit=crop",
    specialty: "Arte Reciclada",
    description: "Transformando materiais reciclados em arte funcional. Sustentabilidade com estilo.",
    rating: 4.6,
    totalProducts: 33,
    location: "Brasília, DF",
    categories: ["Decoração", "Sustentável", "Reciclagem"],
    activeCoupons: [],
    memberSince: "2022"
  },
  {
    id: "art8",
    name: "Ateliê Personalize",
    storeName: "Personalize Presentes",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&h=400&fit=crop",
    specialty: "Presentes Personalizados",
    description: "Criando presentes únicos e personalizados para tornar momentos especiais ainda mais memoráveis.",
    rating: 4.9,
    totalProducts: 59,
    location: "Recife, PE",
    categories: ["Presente", "Personalizado"],
    activeCoupons: [
      { code: "PRESENTE15", discount: 15, minValue: 100 }
    ],
    memberSince: "2020"
  },
  {
    id: "art9",
    name: "Ateliê Bordar",
    storeName: "Bordados Únicos",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&h=400&fit=crop",
    specialty: "Bordado à Mão",
    description: "Bordados autorais em roupas e acessórios. Cada ponto é feito com dedicação e amor pelo artesanato.",
    rating: 5.0,
    totalProducts: 36,
    location: "Salvador, BA",
    categories: ["Bordado", "Moda", "Acessórios"],
    activeCoupons: [],
    memberSince: "2019"
  },
  {
    id: "art10",
    name: "Vidros & Arte",
    storeName: "Atelier Vidro & Resina",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=1200&h=400&fit=crop",
    specialty: "Vidro e Resina",
    description: "Criações exclusivas em vidro e resina epóxi. Transparência e cores que encantam.",
    rating: 4.7,
    totalProducts: 24,
    location: "Fortaleza, CE",
    categories: ["Decoração", "Arte", "Vidro"],
    activeCoupons: [
      { code: "VIDRO20", discount: 20, minValue: 180 }
    ],
    memberSince: "2021"
  }
];
