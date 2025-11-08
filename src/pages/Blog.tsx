import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, ArrowRight } from "lucide-react";

const categories = [
  "Todos", "Técnicas", "Histórias", "Sustentabilidade", "Tendências", "DIY", "Feiras"
];

const blogPosts = [
  {
    id: 1,
    title: "A Arte da Cerâmica: Tradição Milenar",
    excerpt: "Descubra como a cerâmica artesanal conecta gerações através do tempo.",
    author: "Maria Silva",
    date: "15 de Março, 2024",
    category: "Técnicas",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Sustentabilidade no Artesanato",
    excerpt: "Como artesãos estão revolucionando a indústria com práticas sustentáveis.",
    author: "João Santos",
    date: "10 de Março, 2024",
    category: "Sustentabilidade",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Feira de Artesanato: Guia Completo",
    excerpt: "Tudo que você precisa saber para expor seus produtos em feiras.",
    author: "Ana Costa",
    date: "5 de Março, 2024",
    category: "Feiras",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Macramê: Do Básico ao Avançado",
    excerpt: "Aprenda todas as técnicas de macramê com nosso guia completo.",
    author: "Pedro Lima",
    date: "1 de Março, 2024",
    category: "Técnicas",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    title: "História do Artesanato Brasileiro",
    excerpt: "Uma viagem pelas raízes do artesanato no Brasil.",
    author: "Carla Mendes",
    date: "25 de Fevereiro, 2024",
    category: "Histórias",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    title: "Tendências 2024: Arte em Resina",
    excerpt: "Descubra as novas técnicas e estilos que estão dominando o mercado.",
    author: "Lucas Oliveira",
    date: "20 de Fevereiro, 2024",
    category: "Tendências",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    title: "DIY: Velas Aromáticas Personalizadas",
    excerpt: "Aprenda a criar suas próprias velas decorativas em casa.",
    author: "Juliana Rocha",
    date: "15 de Fevereiro, 2024",
    category: "DIY",
    image: "/placeholder.svg",
  },
  {
    id: 8,
    title: "Bordado Contemporâneo: Nova Onda",
    excerpt: "Como o bordado tradicional ganhou um toque moderno.",
    author: "Mariana Souza",
    date: "10 de Fevereiro, 2024",
    category: "Tendências",
    image: "/placeholder.svg",
  },
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-5xl font-bold">Blog ARTIFY</h1>
              <p className="text-xl text-muted-foreground">
                Inspire-se com histórias, técnicas e tendências do mundo artesanal
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Buscar artigos..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container px-4 md:px-6 py-12">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="artisan-card group cursor-pointer">
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 right-4">{post.category}</Badge>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <Button variant="link" className="px-0 group/btn">
                    Ler Mais
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum artigo encontrado para "{searchQuery}" na categoria "{selectedCategory}"
              </p>
            </div>
          )}

          <div className="text-center">
            <Button size="lg" variant="outline">
              Carregar Mais Artigos
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
