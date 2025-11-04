import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Package, Heart, MessageSquare, User, MapPin, Tag, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const ClientDashboard = () => {
  const { items: orders } = useCart();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState("pedidos");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="container px-4 md:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Meu Painel</h1>
            <p className="text-muted-foreground">Gerencie suas compras e preferências</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
              <TabsTrigger value="pedidos" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
              <TabsTrigger value="favoritos" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favoritos</span>
              </TabsTrigger>
              <TabsTrigger value="mensagens" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Mensagens</span>
              </TabsTrigger>
              <TabsTrigger value="perfil" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="enderecos" className="gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Endereços</span>
              </TabsTrigger>
              <TabsTrigger value="cupons" className="gap-2">
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Cupons</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pedidos" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Meus Pedidos</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
                    <Link to="/produtos">
                      <Button>Explorar Produtos</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex gap-4">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">por {item.artist}</p>
                            <p className="text-sm font-bold text-primary mt-2">R$ {item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Repetir
                            </Button>
                            <Button variant="ghost" size="sm">Rastrear</Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="favoritos" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Meus Favoritos</h2>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Você ainda não favoritou nenhum produto</p>
                    <Link to="/produtos">
                      <Button>Explorar Produtos</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="gallery-grid">
                    {favorites.map((product) => (
                      <Card key={product.id} className="artisan-card">
                        <Link to={`/produto/${product.id}`}>
                          <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                          <div className="p-4">
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">por {product.artist}</p>
                            <p className="text-lg font-bold text-primary mt-2">R$ {product.price.toFixed(2)}</p>
                          </div>
                        </Link>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="mensagens" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Mensagens</h2>
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma mensagem ainda</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="perfil" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Meu Perfil</h2>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" placeholder="Seu nome" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(00) 00000-0000" />
                  </div>
                  <Button>Salvar Alterações</Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="enderecos" className="space-y-4">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Meus Endereços</h2>
                  <Button>Adicionar Endereço</Button>
                </div>
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum endereço cadastrado</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="cupons" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Meus Cupons</h2>
                <div className="text-center py-12">
                  <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Você não tem cupons disponíveis</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
