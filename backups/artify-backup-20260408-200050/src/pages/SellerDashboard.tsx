import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, BarChart3, MessageSquare, Store, DollarSign, Tag, Trash2 } from "lucide-react";
import {
  useCreateDatabaseProduct,
  useDatabaseProducts,
  useDatabaseStores,
  useDeleteDatabaseProduct,
} from "@/hooks/useDatabaseProducts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("produtos");
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    lojaId: "",
  });

  const { data: products = [], isLoading: loadingProducts, error: productsError } = useDatabaseProducts();
  const { data: stores = [], isLoading: loadingStores } = useDatabaseStores();
  const createProduct = useCreateDatabaseProduct();
  const deleteProduct = useDeleteDatabaseProduct();

  const storesByName = useMemo(() => {
    return new Map(stores.map((store) => [store.id, store.nome]));
  }, [stores]);

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    const price = Number(form.preco);

    if (!form.nome.trim() || !form.descricao.trim() || !form.lojaId || Number.isNaN(price) || price <= 0) {
      toast({
        title: "Dados invalidos",
        description: "Preencha nome, descricao, loja e preco valido.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createProduct.mutateAsync({
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        preco: price,
        loja_id: form.lojaId,
      });

      setForm({
        nome: "",
        descricao: "",
        preco: "",
        lojaId: "",
      });

      setActiveTab("produtos");
      toast({
        title: "Produto criado",
        description: "O produto foi salvo no banco com sucesso.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar produto no banco.";
      toast({
        title: "Falha ao criar produto",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast({
        title: "Produto removido",
        description: "O produto foi removido do banco.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao remover produto.";
      toast({
        title: "Falha ao remover",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="container px-4 md:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Painel do Vendedor</h1>
            <p className="text-muted-foreground">Gerencie sua loja e produtos</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
              <TabsTrigger value="produtos" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Produtos</span>
              </TabsTrigger>
              <TabsTrigger value="novo" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo</span>
              </TabsTrigger>
              <TabsTrigger value="cupons" className="gap-2">
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Cupons</span>
              </TabsTrigger>
              <TabsTrigger value="estatisticas" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Estatisticas</span>
              </TabsTrigger>
              <TabsTrigger value="mensagens" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Mensagens</span>
              </TabsTrigger>
              <TabsTrigger value="loja" className="gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Loja</span>
              </TabsTrigger>
              <TabsTrigger value="financeiro" className="gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Financeiro</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="produtos" className="space-y-4">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Produtos no Banco</h2>
                  <Button onClick={() => setActiveTab("novo")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </div>

                {loadingProducts && <p className="text-muted-foreground">Carregando produtos...</p>}

                {productsError && (
                  <p className="text-destructive">Erro ao carregar produtos. Verifique as politicas/RLS no Supabase.</p>
                )}

                {!loadingProducts && !productsError && products.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Nenhum produto cadastrado no banco.</p>
                    <Button onClick={() => setActiveTab("novo")}>Criar Primeiro Produto</Button>
                  </div>
                )}

                {!loadingProducts && !productsError && products.length > 0 && (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Loja: {storesByName.get(product.loja_id) ?? "Nao identificada"}
                          </p>
                          <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2)}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deleteProduct.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="novo" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Adicionar Novo Produto</h2>
                <form className="space-y-4 max-w-2xl" onSubmit={handleCreateProduct}>
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Nome do Produto *</Label>
                    <Input
                      id="product-name"
                      placeholder="Ex: Vaso artesanal"
                      value={form.nome}
                      onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Preco (R$) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={form.preco}
                        onChange={(e) => setForm((prev) => ({ ...prev, preco: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Loja *</Label>
                      <Select
                        value={form.lojaId}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, lojaId: value }))}
                        disabled={loadingStores}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingStores ? "Carregando lojas..." : "Selecione a loja"} />
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descricao *</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva seu produto"
                      rows={5}
                      value={form.descricao}
                      onChange={(e) => setForm((prev) => ({ ...prev, descricao: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1" type="submit" disabled={createProduct.isPending}>
                      {createProduct.isPending ? "Salvando..." : "Publicar Produto"}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setForm({ nome: "", descricao: "", preco: "", lojaId: "" });
                      }}
                    >
                      Limpar
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="cupons" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Cupons</h2>
                <p className="text-muted-foreground">Sessao ainda nao conectada ao banco.</p>
              </Card>
            </TabsContent>

            <TabsContent value="estatisticas" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Estatisticas</h2>
                <p className="text-muted-foreground">Sessao ainda nao conectada ao banco.</p>
              </Card>
            </TabsContent>

            <TabsContent value="mensagens" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Mensagens de Clientes</h2>
                <p className="text-muted-foreground">Sessao ainda nao conectada ao banco.</p>
              </Card>
            </TabsContent>

            <TabsContent value="loja" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Configuracoes da Loja</h2>
                <p className="text-muted-foreground">Sessao ainda nao conectada ao banco.</p>
              </Card>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Financeiro</h2>
                <p className="text-muted-foreground">Sessao ainda nao conectada ao banco.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
