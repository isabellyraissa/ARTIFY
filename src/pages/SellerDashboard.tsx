import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, BarChart3, MessageSquare, Store, DollarSign } from "lucide-react";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("produtos");

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
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
              <TabsTrigger value="produtos" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Produtos</span>
              </TabsTrigger>
              <TabsTrigger value="novo" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo</span>
              </TabsTrigger>
              <TabsTrigger value="estatisticas" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Estatísticas</span>
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
                  <h2 className="text-2xl font-bold">Meus Produtos</h2>
                  <Button onClick={() => setActiveTab("novo")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </div>
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Você ainda não cadastrou nenhum produto</p>
                  <Button onClick={() => setActiveTab("novo")}>Criar Primeiro Produto</Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="novo" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Adicionar Novo Produto</h2>
                <div className="space-y-4 max-w-2xl">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Nome do Produto *</Label>
                    <Input id="product-name" placeholder="Ex: Vaso Artesanal em Cerâmica" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço (R$) *</Label>
                      <Input id="price" type="number" placeholder="0.00" step="0.01" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Estoque *</Label>
                      <Input id="stock" type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Input id="category" placeholder="Ex: Cerâmica" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descreva seu produto em detalhes..."
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="materials">Materiais</Label>
                    <Input id="materials" placeholder="Ex: Argila, Esmalte natural" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensões</Label>
                    <Input id="dimensions" placeholder="Ex: 20cm x 15cm" />
                  </div>
                  <div className="space-y-2">
                    <Label>Imagens do Produto</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <p className="text-muted-foreground">Clique ou arraste imagens aqui</p>
                      <p className="text-xs text-muted-foreground mt-2">Máximo 5 imagens (JPG, PNG)</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button className="flex-1">Publicar Produto</Button>
                    <Button variant="outline">Salvar como Rascunho</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="estatisticas" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-6">
                  <div className="text-sm text-muted-foreground">Vendas Total</div>
                  <div className="text-3xl font-bold text-primary mt-2">R$ 0,00</div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-muted-foreground">Produtos Vendidos</div>
                  <div className="text-3xl font-bold text-primary mt-2">0</div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-muted-foreground">Visualizações</div>
                  <div className="text-3xl font-bold text-primary mt-2">0</div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mensagens" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Mensagens de Clientes</h2>
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma mensagem ainda</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="loja" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Configurações da Loja</h2>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Nome da Loja</Label>
                    <Input id="store-name" placeholder="Nome da sua loja" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-description">Descrição</Label>
                    <Textarea 
                      id="store-description" 
                      placeholder="Conte sobre seus produtos e sua história..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" placeholder="@suainsta" />
                  </div>
                  <Button>Salvar Configurações</Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Financeiro</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Saldo Disponível</p>
                      <p className="text-2xl font-bold text-primary">R$ 0,00</p>
                    </div>
                    <Button>Solicitar Saque</Button>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhuma transação registrada</p>
                  </div>
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

export default SellerDashboard;
