import { useState } from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import MainLayout from "@/components/MainLayout";
import { products, Product } from "@/data/products";
import { artisans } from "@/data/artisans";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Star, TrendingUp, Sparkles } from "lucide-react";
import { useFollowedStores } from "@/contexts/FollowedStoresContext";

const Index = () => {
  const { followedStores } = useFollowedStores();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const featuredProducts = products.slice(0, 4);
  const trendingProducts = products.slice(4, 8);
  const featuredArtisans = artisans.slice(0, 3);

  // Recommended products based on followed stores
  const recommendedProducts = followedStores.length > 0
    ? products.filter((p) => {
        const artisan = artisans.find((a) => a.name === p.artist);
        return artisan && followedStores.includes(artisan.id);
      }).slice(0, 4)
    : [];

  return (
    <MainLayout>
      <main className="flex-1">
        <Hero />

        {/* Recommended Section (if following stores) */}
        {recommendedProducts.length > 0 && (
          <section className="container px-4 md:px-6 py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">Recomendado Para Você</h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Com base nas lojas que você segue
              </p>
            </div>
            
            <div className="gallery-grid">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard product={product} />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    Visualização Rápida
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Featured Products Section */}
        <section className="container px-4 md:px-6 py-16">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Produtos em Destaque</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Peças selecionadas especialmente para você. Arte autêntica feita à mão.
            </p>
          </div>
          
          <div className="gallery-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setQuickViewProduct(product)}
                >
                  Ver Rápido
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/produtos">
              <Button size="lg" variant="outline">
                Ver Todos os Produtos
              </Button>
            </Link>
          </div>
        </section>

        {/* Trending Products */}
        <section className="bg-muted/30 py-16">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-center gap-2 mb-12">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Em Alta</h2>
            </div>

            <div className="gallery-grid">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Artisans */}
        <section className="container px-4 md:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Artesãos em Destaque</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conheça talentosos criadores e suas histórias
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredArtisans.map((artisan) => (
              <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-32">
                  <img src={artisan.banner} alt={artisan.storeName} className="w-full h-full object-cover" />
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="absolute -bottom-8 left-4 w-16 h-16 rounded-full border-4 border-background object-cover"
                  />
                </div>
                <div className="p-6 pt-10">
                  <h3 className="font-bold text-lg mb-1">{artisan.storeName}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{artisan.name}</p>
                  <Badge variant="secondary" className="mb-3">{artisan.specialty}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{artisan.rating}</span>
                    <span>•</span>
                    <span>{artisan.totalProducts} produtos</span>
                  </div>
                  <Link to={`/loja/${artisan.id}`}>
                    <Button variant="outline" className="w-full">Ver Loja</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/artesaos">
              <Button size="lg">Ver Todos os Artesãos</Button>
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-muted/30 py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore por Categoria</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Descubra diferentes estilos e técnicas artesanais
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {["Cerâmica", "Decoração", "Joias", "Crochê", "Pintura", "Papelaria"].map((category) => (
                <Link
                  key={category}
                  to={`/produtos`}
                  className="artisan-card p-6 text-center hover:scale-105 transition-transform"
                >
                  <h3 className="font-semibold text-lg">{category}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 md:px-6 py-16">
          <div className="bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              É Artesão? Venda Suas Criações!
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Junte-se à nossa comunidade de artistas e compartilhe suas obras com milhares de apreciadores.
            </p>
            <Link to="/vendedor">
              <Button size="lg" variant="secondary">
                Criar Minha Loja
              </Button>
            </Link>
          </div>
        </section>

        <QuickViewModal
          product={quickViewProduct}
          open={!!quickViewProduct}
          onOpenChange={(open) => !open && setQuickViewProduct(null)}
        />
      </main>
    </MainLayout>
  );
};

export default Index;
