import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Como Cuidar de Peças de Cerâmica Artesanal",
    excerpt: "Dicas essenciais para manter suas peças de cerâmica sempre bonitas e duráveis.",
    author: "Maria Silva",
    date: "15 Mar 2024",
    category: "Dicas",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "A História do Crochê no Brasil",
    excerpt: "Conheça a rica tradição do crochê e como ela se desenvolveu no país.",
    author: "Ana Costa",
    date: "12 Mar 2024",
    category: "História",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Tendências em Decoração Artesanal para 2024",
    excerpt: "Descubra as cores, materiais e estilos que estão em alta este ano.",
    author: "João Santos",
    date: "10 Mar 2024",
    category: "Tendências",
    image: "/placeholder.svg",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog ARTIFY</h1>
            <p className="text-xl opacity-90 mb-8">
              Histórias, dicas e inspirações do mundo artesanal
            </p>
            <div className="max-w-2xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar artigos..." 
                className="pl-10 bg-background text-foreground"
              />
            </div>
          </div>
        </section>

        <section className="container px-4 md:px-6 py-12">
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary" className="cursor-pointer">Todos</Badge>
            <Badge variant="outline" className="cursor-pointer">Dicas</Badge>
            <Badge variant="outline" className="cursor-pointer">História</Badge>
            <Badge variant="outline" className="cursor-pointer">Tendências</Badge>
            <Badge variant="outline" className="cursor-pointer">Tutoriais</Badge>
            <Badge variant="outline" className="cursor-pointer">Artesãos</Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="artisan-card overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 space-y-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <h3 className="font-display text-xl font-bold line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full mt-2">
                    Ler Mais
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">Carregar Mais Artigos</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
