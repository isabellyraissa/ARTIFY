import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Package, Heart } from "lucide-react";
import { useFollowedStores } from "@/contexts/FollowedStoresContext";
import { supabase } from "@/lib/supabase";

interface PublicArtisanStore {
  id: string;
  nome: string;
  artesao_id: string;
  artesao_nome: string;
  artesao_avatar_image_data_url: string | null;
  total_products: number;
  background_image_data_url: string | null;
}

const Artisans = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stores, setStores] = useState<PublicArtisanStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { isFollowing, toggleFollow } = useFollowedStores();

  const categories = ["Todos", "Ceramica", "Decoracao", "Joias", "Croche", "Pintura", "Papelaria", "Bordado", "Sustentavel"];

  useEffect(() => {
    let active = true;

    const loadStores = async () => {
      const [
        { data: storesWithImageRows, error: storesWithImageError },
        { data: usersRows, error: usersError },
        { data: productRows, error: productsError },
      ] =
        await Promise.all([
          supabase.from("loja").select("id, nome, artesao_id, background_image_data_url"),
          supabase.from("users").select("id, nome, avatar_image_data_url"),
          supabase.from("produto").select("id, loja_id"),
        ]);
      let storesRows = storesWithImageRows;
      let storesError = storesWithImageError;

      if (storesWithImageError?.code === "42703" || storesWithImageError?.code === "PGRST204") {
        const { data: legacyStoresRows, error: legacyStoresError } = await supabase.from("loja").select("id, nome, artesao_id");
        storesRows = (legacyStoresRows ?? []).map((store) => ({ ...store, background_image_data_url: null }));
        storesError = legacyStoresError;
      }

      if (!active) return;
      if (storesError || usersError || productsError) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      const usersById = new Map(
        (usersRows ?? []).map((user) => [user.id, { nome: user.nome, avatar_image_data_url: user.avatar_image_data_url ?? null }]),
      );
      const productCountByStore = new Map<string, number>();
      for (const product of productRows ?? []) {
        productCountByStore.set(product.loja_id, (productCountByStore.get(product.loja_id) ?? 0) + 1);
      }

      const mapped = (storesRows ?? []).map((store) => ({
        id: store.id,
        nome: store.nome,
        artesao_id: store.artesao_id,
        artesao_nome: usersById.get(store.artesao_id)?.nome ?? "Artesao",
        artesao_avatar_image_data_url: usersById.get(store.artesao_id)?.avatar_image_data_url ?? null,
        total_products: productCountByStore.get(store.id) ?? 0,
        background_image_data_url: store.background_image_data_url,
      }));

      setStores(mapped);
      setIsLoading(false);
    };

    void loadStores();

    return () => {
      active = false;
    };
  }, []);

  const filteredStores = useMemo(() => {
    if (selectedCategory === "all") return stores;
    return stores.filter((store) => store.nome.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [selectedCategory, stores]);

  return (
    <MainLayout>
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Conheca os Artesaos</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Descubra talentosos artesaos e suas lojas unicas. Cada criador tem uma historia para contar.
            </p>
          </div>
        </section>

        <section className="container px-4 md:px-6 py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            <Button variant={selectedCategory === "all" ? "default" : "outline"} onClick={() => setSelectedCategory("all")}>
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

          {isLoading ? <p className="text-muted-foreground">Carregando lojas dos artesaos...</p> : null}
          {hasError ? <p className="text-destructive">Nao foi possivel carregar as lojas do banco.</p> : null}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-32">
                  <div className="h-full overflow-hidden">
                    <img
                      src={store.background_image_data_url ?? "/placeholder.svg"}
                      alt={store.nome}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-4 translate-y-1/2">
                    <div className="w-16 h-16 rounded-full border-4 border-background bg-background overflow-hidden flex items-center justify-center text-lg font-semibold">
                      {store.artesao_avatar_image_data_url ? (
                        <img
                          src={store.artesao_avatar_image_data_url}
                          alt={`Foto de ${store.artesao_nome}`}
                          className="w-full h-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        store.artesao_nome.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-10">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{store.nome}</h3>
                      <p className="text-sm text-muted-foreground">{store.artesao_nome}</p>
                    </div>
                    <Button variant={isFollowing(store.id) ? "default" : "outline"} size="icon" onClick={() => toggleFollow(store.id, store.nome)}>
                      <Heart className={`h-4 w-4 ${isFollowing(store.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    Loja autoral no ARTIFY. Confira os produtos e fale com o artesao.
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium">Novo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>{store.total_products} produtos</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>Brasil</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link to={`/loja/${store.id}`}>
                      <Button className="w-full" variant="outline">
                        Ver Loja
                      </Button>
                    </Link>
                    <Link to={`/mensagens?store=${store.id}`}>
                      <Button className="w-full">Mensagem</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {!isLoading && !hasError && filteredStores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Nenhum artesao encontrado nesta categoria.</p>
            </div>
          )}
        </section>
      </main>
    </MainLayout>
  );
};

export default Artisans;
