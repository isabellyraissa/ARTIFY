import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { artisans } from "@/data/artisans";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Package, Heart } from "lucide-react";
import { useFollowedStores } from "@/contexts/FollowedStoresContext";

const Artisans = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { isFollowing, toggleFollow } = useFollowedStores();

  const categories = [
    "Todos",
    "Cerâmica",
    "Decoração",
    "Joias",
    "Crochê",
    "Pintura",
    "Papelaria",
    "Bordado",
    "Sustentável"
  ];

  const filteredArtisans = selectedCategory === "all"
    ? artisans
    : artisans.filter((a) =>
        a.categories.some((cat) =>
          cat.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );

  return (
    <MainLayout>
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Conheça os Artesãos</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Descubra talentosos artesãos e suas lojas únicas. Cada criador tem uma história para contar.
            </p>
          </div>
        </section>

        <section className="container px-4 md:px-6 py-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
            >
              Todos
            </Button>
            {categories.slice(1).map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat.toLowerCase() ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.toLowerCase())}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Artisans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtisans.map((artisan) => (
              <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={artisan.banner}
                    alt={artisan.storeName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute -bottom-8 left-4">
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="w-16 h-16 rounded-full border-4 border-background object-cover"
                    />
                  </div>
                </div>

                <div className="p-6 pt-10">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{artisan.storeName}</h3>
                      <p className="text-sm text-muted-foreground">{artisan.name}</p>
                    </div>
                    <Button
                      variant={isFollowing(artisan.id) ? "default" : "outline"}
                      size="icon"
                      onClick={() => toggleFollow(artisan.id, artisan.storeName)}
                    >
                      <Heart
                        className={`h-4 w-4 ${isFollowing(artisan.id) ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>

                  <Badge variant="secondary" className="mb-3">
                    {artisan.specialty}
                  </Badge>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {artisan.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium">{artisan.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>{artisan.totalProducts} produtos</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{artisan.location}</span>
                  </div>

                  <Link to={`/loja/${artisan.id}`}>
                    <Button className="w-full">Ver Loja</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {filteredArtisans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Nenhum artesão encontrado nesta categoria.
              </p>
            </div>
          )}
        </section>
      </main>
    </MainLayout>
  );
};

export default Artisans;
