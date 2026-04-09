import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Calendar, Heart, Tag } from "lucide-react";
import { useFollowedStores } from "@/contexts/FollowedStoresContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useDatabaseProducts } from "@/hooks/useDatabaseProducts";

interface StoreRow {
  id: string;
  nome: string;
  artesao_id: string;
  background_image_data_url: string | null;
}

const StorePage = () => {
  const { id } = useParams<{ id: string }>();
  const { isFollowing, toggleFollow } = useFollowedStores();
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSector, setSelectedSector] = useState("all");
  const [store, setStore] = useState<StoreRow | null>(null);
  const [artisanName, setArtisanName] = useState("Artesao");
  const [artisanAvatar, setArtisanAvatar] = useState<string | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [hasStoreError, setHasStoreError] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const { data: products = [], isLoading: isLoadingProducts } = useDatabaseProducts();

  useEffect(() => {
    let active = true;

    const loadStore = async () => {
      if (!id) {
        setHasStoreError(true);
        setIsLoadingStore(false);
        return;
      }

      const { data: storeWithImageRow, error: storeWithImageError } = await supabase
        .from("loja")
        .select("id, nome, artesao_id, background_image_data_url")
        .eq("id", id)
        .maybeSingle();
      let storeRow = storeWithImageRow;
      let storeError = storeWithImageError;

      if (storeWithImageError?.code === "42703" || storeWithImageError?.code === "PGRST204") {
        const { data: legacyStoreRow, error: legacyStoreError } = await supabase
          .from("loja")
          .select("id, nome, artesao_id")
          .eq("id", id)
          .maybeSingle();
        storeRow = legacyStoreRow ? { ...legacyStoreRow, background_image_data_url: null } : null;
        storeError = legacyStoreError;
      }

      if (!active) return;

      if (storeError || !storeRow) {
        setHasStoreError(true);
        setIsLoadingStore(false);
        return;
      }

      setStore(storeRow);
      setAvatarFailed(false);

      const { data: userWithAvatar } = await supabase
        .from("users")
        .select("nome, avatar_image_data_url")
        .eq("id", storeRow.artesao_id)
        .maybeSingle();
      let userRow = userWithAvatar;
      if (!userWithAvatar) {
        const { data: legacyUserRow } = await supabase.from("users").select("nome").eq("id", storeRow.artesao_id).maybeSingle();
        userRow = legacyUserRow ? { ...legacyUserRow, avatar_image_data_url: null } : null;
      }
      if (!active) return;
      setArtisanName(userRow?.nome ?? "Artesao");
      setArtisanAvatar(userRow?.avatar_image_data_url ?? null);
      setIsLoadingStore(false);
    };

    void loadStore();

    return () => {
      active = false;
    };
  }, [id]);

  const storeProducts = useMemo(() => {
    if (!store) return [];
    const filtered = products.filter((product) => product.loja_id === store.id);

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      return a.name.localeCompare(b.name);
    });
  }, [products, sortBy, store]);

  const sectors = useMemo(() => {
    const unique = new Set(
      storeProducts
        .map((product) => product.category?.trim())
        .filter((category): category is string => Boolean(category && category.length > 0)),
    );
    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [storeProducts]);

  const visibleProducts = useMemo(() => {
    if (selectedSector === "all") return storeProducts;
    return storeProducts.filter((product) => (product.category ?? "").toLowerCase() === selectedSector.toLowerCase());
  }, [selectedSector, storeProducts]);

  if (isLoadingStore) {
    return (
      <MainLayout>
        <div className="container px-4 md:px-6 py-12 text-center text-muted-foreground">Carregando loja...</div>
      </MainLayout>
    );
  }

  if (!store || hasStoreError) {
    return (
      <MainLayout>
        <div className="container px-4 md:px-6 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Loja nao encontrada</h1>
          <Link to="/artesaos">
            <Button>Ver Todos os Artesaos</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showSidebar={false}>
      <main className="flex-1">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={store.background_image_data_url ?? "/placeholder.svg"}
            alt={store.nome}
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <section className="container px-4 md:px-6">
          <div className="relative -mt-20 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 h-32 rounded-full border-4 border-background bg-background object-cover shadow-lg flex items-center justify-center text-3xl font-bold">
                <img
                  src={artisanAvatar ?? "/placeholder.svg"}
                  alt={`Foto de ${artisanName}`}
                  className={`w-full h-full rounded-full object-cover ${avatarFailed ? "hidden" : "block"}`}
                  onError={() => {
                    setAvatarFailed(true);
                  }}
                />
                {avatarFailed ? artisanName.charAt(0).toUpperCase() : null}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{store.nome}</h1>
                    <p className="text-lg text-muted-foreground mb-3">{artisanName}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">Novo</span>
                        <span className="text-muted-foreground">(avaliacoes em breve)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Brasil</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Perfil ativo no ARTIFY</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    variant={isFollowing(store.id) ? "default" : "outline"}
                    onClick={() => toggleFollow(store.id, store.nome)}
                    className="gap-2"
                  >
                    <Heart className={`h-4 w-4 ${isFollowing(store.id) ? "fill-current" : ""}`} />
                    {isFollowing(store.id) ? "Seguindo" : "Seguir Loja"}
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Artesanal</Badge>
                  <Badge variant="secondary">Autoral</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Sobre a Loja</h2>
                <p className="text-muted-foreground">
                  Esta loja pertence ao artesao {artisanName}. Explore os produtos abaixo e acompanhe as novidades.
                </p>
              </Card>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Produtos ({visibleProducts.length})</h2>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Destaques</SelectItem>
                      <SelectItem value="price-low">Menor Preco</SelectItem>
                      <SelectItem value="price-high">Maior Preco</SelectItem>
                      <SelectItem value="newest">Mais Recentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {sectors.map((sector) => (
                    <Button
                      key={sector}
                      variant={selectedSector === sector ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSector(sector)}
                    >
                      {sector === "all" ? "Todos" : sector}
                    </Button>
                  ))}
                </div>

                {isLoadingProducts ? <p className="text-muted-foreground">Carregando produtos...</p> : null}

                <div className="gallery-grid">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {!isLoadingProducts && visibleProducts.length === 0 && (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">Esta loja ainda nao tem produtos cadastrados.</p>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-lg">Cupons Ativos</h3>
                </div>
                <p className="text-sm text-muted-foreground">Cupons publicos em breve.</p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Estatisticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de Produtos</span>
                    <span className="font-semibold">{storeProducts.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seguidores</span>
                    <span className="font-semibold">-</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Atividade</span>
                    <span className="font-semibold">Ativa</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Contato</h3>
                <Link to={`/mensagens?store=${store.id}`}>
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
