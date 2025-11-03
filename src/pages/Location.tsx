import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Navigation } from "lucide-react";
import { products } from "@/data/products";

const mockLocations = [
  { city: "São Paulo", state: "SP", count: 45, distance: "5 km" },
  { city: "Rio de Janeiro", state: "RJ", count: 32, distance: "450 km" },
  { city: "Belo Horizonte", state: "MG", count: 28, distance: "580 km" },
  { city: "Curitiba", state: "PR", count: 19, distance: "400 km" },
  { city: "Porto Alegre", state: "RS", count: 15, distance: "1.100 km" },
];

const Location = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const filteredLocations = mockLocations.filter((loc) =>
    `${loc.city} ${loc.state}`.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const displayProducts = selectedCity
    ? products.slice(0, 6)
    : products.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container px-4 md:px-6 py-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Produtos Perto de Você
            </h1>
            <p className="text-lg text-muted-foreground">
              Encontre artesãos e produtos únicos na sua região. Apoie o comércio local!
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Digite sua cidade ou CEP..."
                      className="pl-10"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                  </div>
                  <Button>
                    <MapPin className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>

                <Button variant="outline" className="w-full gap-2">
                  <Navigation className="h-4 w-4" />
                  Usar minha localização atual
                </Button>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Cidades Próximas</h2>
              <div className="space-y-3">
                {filteredLocations.map((location) => (
                  <Card
                    key={`${location.city}-${location.state}`}
                    className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedCity === location.city
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedCity(
                        selectedCity === location.city ? null : location.city
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {location.city}, {location.state}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {location.count} artesãos • {location.distance}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{location.count}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Mapa interativo em breve
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Visualize artesãos próximos no mapa
                  </p>
                </div>
              </div>
            </div>
          </div>

          {selectedCity && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">
                  Produtos em {selectedCity}
                </h2>
                <Button variant="outline">Ver todos</Button>
              </div>
              <div className="gallery-grid">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Card className="p-8 bg-accent/10 border-accent/20">
              <h3 className="text-2xl font-display font-bold mb-4">
                Vantagens de Comprar Local
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <div className="text-3xl mb-2">🚚</div>
                  <h4 className="font-semibold mb-2">Frete Mais Rápido</h4>
                  <p className="text-sm text-muted-foreground">
                    Receba seus produtos em menos tempo
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">💚</div>
                  <h4 className="font-semibold mb-2">Apoie Sua Comunidade</h4>
                  <p className="text-sm text-muted-foreground">
                    Fortaleça artesãos locais
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🌍</div>
                  <h4 className="font-semibold mb-2">Menos Impacto Ambiental</h4>
                  <p className="text-sm text-muted-foreground">
                    Reduz emissões de transporte
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Location;
