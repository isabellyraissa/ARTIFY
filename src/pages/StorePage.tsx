import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import ProductCard from "@/components/ProductCard";
import { artisans } from "@/data/artisans";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Calendar, Heart, Tag } from "lucide-react";
import { useFollowedStores } from "@/contexts/FollowedStoresContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StorePage = () => {
  const { id } = useParams<{ id: string }>();
  const { isFollowing, toggleFollow } = useFollowedStores();
  const [sortBy, setSortBy] = useState("featured");

  const artisan = artisans.find((a) => a.id === id);
  const storeProducts = products.filter((p) => p.artist === artisan?.name);

  if (!artisan) {
    return (
      <MainLayout>
        <div className="container px-4 md:px-6 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Loja não encontrada</h1>
          <Link to="/artesaos">
            <Button>Ver Todos os Artesãos</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showSidebar={false}>
      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={artisan.banner}
            alt={artisan.storeName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <section className="container px-4 md:px-6">
          {/* Store Header */}
          <div className="relative -mt-20 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img
                src={artisan.avatar}
                alt={artisan.name}
                className="w-32 h-32 rounded-full border-4 border-background object-cover shadow-lg"
              />
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{artisan.storeName}</h1>
                    <p className="text-lg text-muted-foreground mb-3">{artisan.name}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">{artisan.rating}</span>
                        <span className="text-muted-foreground">(248 avaliações)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{artisan.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Membro desde {artisan.memberSince}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    variant={isFollowing(artisan.id) ? "default" : "outline"}
                    onClick={() => toggleFollow(artisan.id, artisan.storeName)}
                    className="gap-2"
                  >
                    <Heart className={`h-4 w-4 ${isFollowing(artisan.id) ? "fill-current" : ""}`} />
                    {isFollowing(artisan.id) ? "Seguindo" : "Seguir Loja"}
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-2">
                  {artisan.categories.map((cat) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Sobre a Loja</h2>
                <p className="text-muted-foreground">{artisan.description}</p>
              </Card>

              {/* Products */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    Produtos ({storeProducts.length})
                  </h2>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Destaques</SelectItem>
                      <SelectItem value="price-low">Menor Preço</SelectItem>
                      <SelectItem value="price-high">Maior Preço</SelectItem>
                      <SelectItem value="newest">Mais Recentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="gallery-grid">
                  {storeProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {storeProducts.length === 0 && (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">
                      Esta loja ainda não tem produtos cadastrados.
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Active Coupons */}
              {artisan.activeCoupons.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Cupons Ativos</h3>
                  </div>
                  <div className="space-y-3">
                    {artisan.activeCoupons.map((coupon) => (
                      <div
                        key={coupon.code}
                        className="p-4 border border-dashed border-primary rounded-lg bg-primary/5"
                      >
                        <p className="font-mono font-bold text-primary mb-1">
                          {coupon.code}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {coupon.discount}% OFF em compras acima de R$ {coupon.minValue}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Store Stats */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Estatísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de Produtos</span>
                    <span className="font-semibold">{artisan.totalProducts}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avaliação Média</span>
                    <span className="font-semibold">{artisan.rating} ⭐</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vendas Totais</span>
                    <span className="font-semibold">1.2k+</span>
                  </div>
                </div>
              </Card>

              {/* Contact */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Contato</h3>
                <Link to="/mensagens">
                  <Button className="w-full">Enviar Mensagem</Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default StorePage;
