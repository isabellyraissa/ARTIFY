import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Store, Upload } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [wantsToSell, setWantsToSell] = useState(false);
  const [showStoreSetup, setShowStoreSetup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (wantsToSell) {
        setShowStoreSetup(true);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 py-16">
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Bem-vindo ao ARTIFY</h1>
            <p className="text-muted-foreground">
              Entre ou cadastre-se para começar sua jornada artesanal
            </p>
          </div>

          {showStoreSetup ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Store className="h-6 w-6 text-primary" />
                  <CardTitle>Criar Sua Loja</CardTitle>
                </div>
                <CardDescription>
                  Configure sua loja e comece a vender seus produtos artesanais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Nome da Loja *</Label>
                    <Input id="store-name" placeholder="Ex: Ateliê Artesanal" required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Logo da Loja</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Carregar logo</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Banner da Loja</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Carregar banner</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store-description">Descrição da Loja *</Label>
                    <Textarea 
                      id="store-description" 
                      placeholder="Conte a história da sua marca, sua inspiração e o que torna seus produtos únicos..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categories">Categorias de Atuação *</Label>
                    <Input id="categories" placeholder="Ex: Cerâmica, Escultura, Decoração" required />
                    <p className="text-xs text-muted-foreground">Separe as categorias por vírgula</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço *</Label>
                      <Input id="address" placeholder="Rua, número" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP *</Label>
                      <Input id="cep" placeholder="00000-000" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping">Métodos de Envio *</Label>
                    <Input id="shipping" placeholder="Ex: Correios, Entrega local, Retirada" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment">Métodos de Pagamento Aceitos *</Label>
                    <Input id="payment" placeholder="Ex: PIX, Cartão, Boleto" required />
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/30">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      Adicionar Produtos Iniciais (Opcional)
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Você pode adicionar produtos agora ou depois no painel do vendedor
                    </p>
                    <Button variant="outline" type="button">
                      Adicionar Primeiro Produto
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4 bg-primary/5">
                    <h3 className="font-semibold mb-2">Preview da Loja</h3>
                    <p className="text-sm text-muted-foreground">
                      Sua loja estará visível para clientes após a publicação
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      Publicar Loja
                    </Button>
                    <Button variant="outline" type="button">
                      Salvar Rascunho
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Entrar na sua conta</CardTitle>
                    <CardDescription>
                      Digite suas credenciais para acessar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" placeholder="••••••••" required />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" />
                          <label htmlFor="remember" className="text-sm font-medium">
                            Lembrar-me
                          </label>
                        </div>
                        <Button variant="link" className="px-0">
                          Esqueceu a senha?
                        </Button>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Entrando..." : "Entrar"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar nova conta</CardTitle>
                    <CardDescription>
                      Preencha os dados para se cadastrar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input id="name" type="text" placeholder="João Silva" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">E-mail</Label>
                        <Input id="register-email" type="email" placeholder="seu@email.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Senha</Label>
                        <Input id="register-password" type="password" placeholder="••••••••" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar senha</Label>
                        <Input id="confirm-password" type="password" placeholder="••••••••" required />
                      </div>
                      <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="seller" 
                            checked={wantsToSell}
                            onCheckedChange={(checked) => setWantsToSell(checked as boolean)}
                          />
                          <label htmlFor="seller" className="text-sm font-medium flex items-center gap-2">
                            <Store className="h-4 w-4 text-primary" />
                            Quero vender meus produtos e criar minha loja
                          </label>
                        </div>
                        {wantsToSell && (
                          <p className="text-xs text-muted-foreground pl-6">
                            Após criar sua conta, você será direcionado para configurar sua loja
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" required />
                        <label htmlFor="terms" className="text-sm font-medium">
                          Aceito os termos e políticas
                        </label>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Cadastrando..." : "Criar Conta"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
