import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, BarChart3, MessageSquare, Store, DollarSign, Tag, Trash2, Image as ImageIcon } from "lucide-react";
import {
  useCreateDatabaseProduct,
  useDatabaseProducts,
  useDatabaseStores,
  useDeleteDatabaseProduct,
} from "@/hooks/useDatabaseProducts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { clearEphemeralSessionMarker } from "@/lib/authSession";
import {
  isMissingImageColumnError,
  removeStoreBackground,
  uploadProductImage,
  uploadStoreBackground,
} from "@/lib/storeMedia";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("produtos");
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    categoria: "Artesanal",
    preco: "",
    lojaId: "",
  });
  const [storeName, setStoreName] = useState("");
  const [isCreatingStore, setIsCreatingStore] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [selectedStoreForBackground, setSelectedStoreForBackground] = useState("");
  const [storeBackgroundPreview, setStoreBackgroundPreview] = useState<string | null>(null);
  const [storeBackgroundFile, setStoreBackgroundFile] = useState<File | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);

  const isImageFile = (file: File) => file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp|svg|heic|heif|avif)$/i.test(file.name);

  const {
    data: products = [],
    isLoading: loadingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useDatabaseProducts();
  const { data: stores = [], isLoading: loadingStores, refetch: refetchStores } = useDatabaseStores();
  const createProduct = useCreateDatabaseProduct();
  const deleteProduct = useDeleteDatabaseProduct();

  useEffect(() => {
    let active = true;

    const loadAccount = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;

      if (sessionError || !sessionData.session) {
        navigate("/auth", { replace: true });
        return;
      }

      setSession(sessionData.session);

      const { data: userRow, error: userError } = await supabase
        .from("users")
        .select("tipo")
        .eq("id", sessionData.session.user.id)
        .maybeSingle();

      if (!active) return;

      if (userError) {
        toast({
          title: "Falha ao carregar perfil",
          description: userError.message,
          variant: "destructive",
        });
      } else {
        setUserRole(userRow?.tipo ?? "cliente");
      }

      setIsLoadingAccount(false);
    };

    void loadAccount();

    return () => {
      active = false;
    };
  }, [navigate]);

  const myStores = useMemo(() => {
    if (!session) return [];
    return stores.filter((store) => store.artesao_id === session.user.id);
  }, [stores, session]);

  const myStoreIds = useMemo(() => new Set(myStores.map((store) => store.id)), [myStores]);

  const myProducts = useMemo(() => {
    return products.filter((product) => myStoreIds.has(product.loja_id));
  }, [products, myStoreIds]);

  const myCategories = useMemo(() => {
    const unique = new Set(
      myProducts
        .map((product) => product.category?.trim())
        .filter((category): category is string => Boolean(category && category.length > 0)),
    );
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [myProducts]);

  const storesByName = useMemo(() => {
    return new Map(myStores.map((store) => [store.id, store.nome]));
  }, [myStores]);

  useEffect(() => {
    if (myStores.length === 0) {
      setSelectedStoreForBackground("");
      return;
    }

    if (!selectedStoreForBackground || !myStores.some((store) => store.id === selectedStoreForBackground)) {
      setSelectedStoreForBackground(myStores[0].id);
    }

    setForm((prev) => ({ ...prev, lojaId: prev.lojaId || myStores[0].id }));
  }, [myStores, selectedStoreForBackground]);

  const canUseSellerArea = userRole ? ["artesao", "vendedor"].includes(userRole.toLowerCase()) : false;
  const hasStore = myStores.length > 0;
  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === "object" && "message" in error) {
      const message = (error as { message?: unknown }).message;
      if (typeof message === "string" && message.trim().length > 0) return message;
    }
    return fallback;
  };

  const handleCreateStore = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!session) return;
    if (hasStore) {
      toast({
        title: "Loja ja criada",
        description: "Cada artesao pode ter somente uma loja.",
      });
      return;
    }

    if (!storeName.trim()) {
      toast({
        title: "Nome da loja obrigatorio",
        description: "Informe um nome para criar sua loja.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingStore(true);
    const { data, error } = await supabase
      .from("loja")
      .insert({
        nome: storeName.trim(),
        artesao_id: session.user.id,
      })
      .select("id")
      .single();
    setIsCreatingStore(false);

    if (error) {
      toast({
        title: "Falha ao criar loja",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    await refetchStores();
    setStoreName("");
    setActiveTab("novo");
    setForm((prev) => ({ ...prev, lojaId: data.id }));
    toast({
      title: "Loja criada",
      description: "Sua loja foi criada com sucesso. Agora voce pode cadastrar produtos.",
    });
  };

  const handleOpenStoreTab = () => {
    setActiveTab("loja");
  };

  const handleOpenNewProductTab = () => {
    if (!hasStore) {
      toast({
        title: "Crie sua loja primeiro",
        description: "Antes de publicar produtos, crie sua unica loja na aba Loja.",
        variant: "destructive",
      });
      setActiveTab("loja");
      return;
    }

    setActiveTab("novo");
  };

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!hasStore) {
      toast({
        title: "Sem loja cadastrada",
        description: "Crie sua loja antes de adicionar produtos.",
        variant: "destructive",
      });
      setActiveTab("loja");
      return;
    }

    const price = Number(form.preco);

    if (!form.nome.trim() || !form.descricao.trim() || !form.lojaId || Number.isNaN(price) || price <= 0) {
      toast({
        title: "Dados invalidos",
        description: "Preencha nome, descricao, setor/categoria, loja e preco valido.",
        variant: "destructive",
      });
      return;
    }

    try {
      const created = await createProduct.mutateAsync({
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        categoria: form.categoria.trim() || "Artesanal",
        preco: price,
        loja_id: form.lojaId,
      });

      if (session && productImageFile && created?.id) {
        const { error: uploadError } = await uploadProductImage(created.id, productImageFile);
        if (uploadError) {
          toast({
            title: "Produto criado, mas imagem falhou",
            description: isMissingImageColumnError(uploadError)
              ? "Falta a coluna de imagem no Supabase. Rode o arquivo `supabase_google_auth.sql` inteiro e tente novamente em alguns segundos."
              : uploadError.message,
            variant: "destructive",
          });
        }
        await refetchProducts();
      }

      setForm({
        nome: "",
        descricao: "",
        categoria: form.categoria,
        preco: "",
        lojaId: form.lojaId,
      });
      setProductImagePreview(null);
      setProductImageFile(null);

      setActiveTab("produtos");
      toast({
        title: "Produto criado",
        description: "O produto foi salvo no banco com sucesso.",
      });
    } catch (error) {
      const message = getErrorMessage(error, "Erro ao criar produto no banco.");
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
      await refetchProducts();
      toast({
        title: "Produto removido",
        description: "O produto foi removido do banco.",
      });
    } catch (error) {
      const message = getErrorMessage(error, "Erro ao remover produto.");
      toast({
        title: "Falha ao remover",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleReplaceProductImage = async (productId: string, file: File) => {
    if (!session) return;
    if (!isImageFile(file)) {
      toast({
        title: "Arquivo invalido",
        description: "Selecione um arquivo de imagem (JPEG, PNG, WEBP, GIF, HEIC e similares).",
        variant: "destructive",
      });
      return;
    }
    const { error } = await uploadProductImage(productId, file);
    if (error) {
      toast({
        title: "Falha ao atualizar imagem",
        description: isMissingImageColumnError(error)
          ? "Falta a coluna de imagem no Supabase. Rode o arquivo `supabase_google_auth.sql` inteiro e tente novamente em alguns segundos."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    await refetchProducts();
    toast({
      title: "Imagem atualizada",
      description: "A imagem do produto foi publicada para compradores.",
    });
  };

  const handleProductImageFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isImageFile(file)) {
      toast({
        title: "Arquivo invalido",
        description: "Selecione um arquivo de imagem (JPEG, PNG, WEBP, GIF, HEIC e similares).",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    try {
      const localUrl = URL.createObjectURL(file);
      setProductImagePreview(localUrl);
      setProductImageFile(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao carregar imagem.";
      toast({
        title: "Erro de imagem",
        description: message,
        variant: "destructive",
      });
    } finally {
      event.target.value = "";
    }
  };

  const handleStoreBackgroundFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isImageFile(file)) {
      toast({
        title: "Arquivo invalido",
        description: "Selecione um arquivo de imagem (JPEG, PNG, WEBP, GIF, HEIC e similares).",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setStoreBackgroundPreview(localUrl);
    setStoreBackgroundFile(file);
    event.target.value = "";
  };

  const handleSaveStoreBackground = async () => {
    if (!session || !selectedStoreForBackground || !storeBackgroundFile) return;
    const { error } = await uploadStoreBackground(selectedStoreForBackground, storeBackgroundFile);
    if (error) {
      toast({
        title: "Falha ao salvar plano de fundo",
        description: isMissingImageColumnError(error)
          ? "Falta a coluna de imagem no Supabase. Rode o arquivo `supabase_google_auth.sql` inteiro e tente novamente em alguns segundos."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    await refetchStores();
    setStoreBackgroundFile(null);
    setStoreBackgroundPreview(null);
    toast({
      title: "Plano de fundo publicado",
      description: "A imagem agora esta visivel para compradores na vitrine da loja.",
    });
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await supabase.auth.signOut();
    clearEphemeralSessionMarker();
    setIsSigningOut(false);

    if (error) {
      toast({
        title: "Falha ao sair",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    navigate("/auth", { replace: true });
  };

  if (isLoadingAccount) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <section className="container px-4 md:px-6 py-8">
            <p className="text-muted-foreground">Carregando area do artesao...</p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!canUseSellerArea) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <section className="container px-4 md:px-6 py-8">
            <Card className="p-6 max-w-2xl">
              <h1 className="text-2xl font-bold mb-2">Area exclusiva para artesaos</h1>
              <p className="text-muted-foreground mb-4">
                Seu perfil ainda esta como comprador. Va em Perfil e clique em "Quero me tornar artesao".
              </p>
              <Button onClick={() => navigate("/perfil")}>Ir para Perfil</Button>
            </Card>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="container px-4 md:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Painel do Artesao</h1>
            <p className="text-muted-foreground">Gerencie sua loja e seus produtos</p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => navigate("/perfil")}>
                Minha conta
              </Button>
              <Button variant="destructive" onClick={handleSignOut} disabled={isSigningOut}>
                {isSigningOut ? "Saindo..." : "Sair da conta"}
              </Button>
            </div>
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
                  <h2 className="text-2xl font-bold">Meus produtos</h2>
                  <Button onClick={handleOpenNewProductTab}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </div>

                {loadingProducts && <p className="text-muted-foreground">Carregando produtos...</p>}

                {productsError && (
                  <p className="text-destructive">Erro ao carregar produtos. Verifique as politicas/RLS no Supabase.</p>
                )}

                {!loadingProducts && !productsError && myProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {!hasStore
                        ? "Voce ainda nao tem loja. Crie sua loja para publicar produtos."
                        : "Nenhum produto cadastrado na sua loja."}
                    </p>
                    <Button onClick={!hasStore ? handleOpenStoreTab : handleOpenNewProductTab}>
                      {!hasStore ? "Criar Minha Loja" : "Criar Primeiro Produto"}
                    </Button>
                  </div>
                )}

                {!loadingProducts && !productsError && myProducts.length > 0 && (
                  <div className="space-y-3">
                    {myProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {(() => {
                            return (
                          <img
                                src={product.image ?? "/placeholder.svg"}
                            alt={product.name}
                            className="w-16 h-16 rounded object-cover border"
                                onError={(event) => {
                                  event.currentTarget.src = "/placeholder.svg";
                                }}
                          />
                            );
                          })()}
                          <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Loja: {storesByName.get(product.loja_id) ?? "Nao identificada"}
                          </p>
                          <p className="text-sm text-muted-foreground">Setor: {product.category}</p>
                          <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`replace-image-${product.id}`} className="cursor-pointer">
                            <span className="sr-only">Trocar imagem</span>
                            <Button type="button" variant="outline" size="sm" asChild>
                              <span>
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Imagem
                              </span>
                            </Button>
                          </Label>
                          <Input
                            id={`replace-image-${product.id}`}
                            type="file"
                            accept="image/*,.heic,.heif"
                            className="hidden"
                            onChange={async (event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              await handleReplaceProductImage(product.id, file);
                              event.target.value = "";
                            }}
                          />
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
                        disabled={loadingStores || !hasStore}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingStores
                                ? "Carregando lojas..."
                                : !hasStore
                                  ? "Crie uma loja primeiro"
                                  : "Selecione a loja"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {myStores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-category">Setor/Categoria *</Label>
                    <Input
                      id="product-category"
                      placeholder="Ex: Ceramica, Cestos, Macrame"
                      value={form.categoria}
                      onChange={(e) => setForm((prev) => ({ ...prev, categoria: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">Esse campo cria os setores que aparecerao em abas na loja publica.</p>
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

                  <div className="space-y-2">
                    <Label htmlFor="product-image-public">Imagem do produto (publica para compradores)</Label>
                    <Input id="product-image-public" type="file" accept="image/*,.heic,.heif" onChange={handleProductImageFile} />
                    <p className="text-xs text-muted-foreground">
                      Aceita arquivos de imagem em geral (JPEG, PNG, WEBP, GIF, print/screenshot etc.).
                    </p>
                    {productImagePreview ? (
                      <img
                        src={productImagePreview}
                        alt="Preview do produto"
                        className="w-40 h-40 rounded object-cover border"
                      />
                    ) : null}
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1" type="submit" disabled={createProduct.isPending || !hasStore}>
                      {createProduct.isPending ? "Salvando..." : "Publicar Produto"}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, nome: "", descricao: "", preco: "" }));
                      }}
                    >
                      Limpar
                    </Button>
                  </div>

                  {!hasStore ? (
                    <p className="text-sm text-muted-foreground">
                      Sem loja cadastrada. Va para a aba Loja e crie a sua antes de publicar produtos.
                    </p>
                  ) : null}
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="cupons" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Cupons</h2>
                <p className="text-muted-foreground">
                  Conexao com banco ativa. Modulo de cupons em desenvolvimento para as proximas iteracoes.
                </p>
                <p className="text-sm text-muted-foreground mt-2">Lojas ativas: {myStores.length}</p>
              </Card>
            </TabsContent>

            <TabsContent value="estatisticas" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Estatisticas</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Lojas</p>
                    <p className="text-2xl font-bold">{myStores.length}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Produtos</p>
                    <p className="text-2xl font-bold">{myProducts.length}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Valor anunciado</p>
                    <p className="text-2xl font-bold">
                      R$ {myProducts.reduce((acc, product) => acc + product.price, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="mensagens" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Mensagens de Clientes</h2>
                <p className="text-muted-foreground">
                  Esse modulo continua em modo placeholder/local no momento, como voce pediu.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="loja" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Configuracoes da Loja</h2>
                {!hasStore ? (
                  <form className="space-y-4 max-w-xl" onSubmit={handleCreateStore}>
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Nome da loja *</Label>
                      <Input
                        id="store-name"
                        placeholder="Ex: Atelie da Maria"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={isCreatingStore}>
                      {isCreatingStore ? "Criando loja..." : "Criar minha loja"}
                    </Button>
                  </form>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">Voce ja tem sua loja criada. Cada artesao pode ter apenas 1 loja.</p>
                )}

                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold">Minhas lojas</h3>
                  {!hasStore ? (
                    <p className="text-sm text-muted-foreground">Voce ainda nao criou nenhuma loja.</p>
                  ) : (
                    myStores.map((store) => (
                      <div key={store.id} className="border rounded-lg p-3">
                        <p className="font-medium">{store.nome}</p>
                        <p className="text-xs text-muted-foreground break-all">ID: {store.id}</p>
                      </div>
                    ))
                  )}
                </div>

                {hasStore ? (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold">Plano de fundo da loja (visivel para compradores)</h3>
                    <Select value={selectedStoreForBackground} onValueChange={setSelectedStoreForBackground}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {myStores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input type="file" accept="image/*,.heic,.heif" onChange={handleStoreBackgroundFile} />
                    <p className="text-xs text-muted-foreground">
                      Aceita arquivos de imagem em geral (JPEG, PNG, WEBP, GIF, print/screenshot etc.).
                    </p>

                    {selectedStoreForBackground ? (
                      <div className="space-y-2">
                        <img
                          src={
                            storeBackgroundPreview ??
                            (myStores.find((store) => store.id === selectedStoreForBackground)?.background_image_data_url ??
                              "/placeholder.svg")
                          }
                          alt="Plano de fundo da loja"
                          className="w-full max-w-xl h-44 rounded object-cover border"
                          onError={(event) => {
                            event.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={handleSaveStoreBackground} disabled={!storeBackgroundFile}>
                            Salvar plano de fundo publico
                          </Button>
                          <Button
                            variant="outline"
                            onClick={async () => {
                              if (!selectedStoreForBackground) return;
                              const { error } = await removeStoreBackground(selectedStoreForBackground);
                              if (error) {
                                toast({
                                  title: "Falha ao remover plano de fundo",
                                  description: isMissingImageColumnError(error)
                                    ? "Falta a coluna de imagem no Supabase. Rode o arquivo `supabase_google_auth.sql` inteiro e tente novamente em alguns segundos."
                                    : error.message,
                                  variant: "destructive",
                                });
                                return;
                              }
                              setStoreBackgroundFile(null);
                              setStoreBackgroundPreview(null);
                              await refetchStores();
                              toast({
                                title: "Plano de fundo removido",
                                description: "A vitrine voltou para o padrao.",
                              });
                            }}
                          >
                            Remover plano de fundo
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {myCategories.length > 0 ? (
                  <div className="mt-6 space-y-2">
                    <h3 className="font-semibold">Setores/Categorias atuais da loja</h3>
                    <div className="flex flex-wrap gap-2">
                      {myCategories.map((category) => (
                        <span key={category} className="px-3 py-1 rounded-full bg-muted text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Card>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Financeiro</h2>
                <p className="text-muted-foreground">
                  Conexao com banco ativa. Resumo estimado com base nos produtos cadastrados:
                </p>
                <p className="text-lg font-semibold mt-2">
                  R$ {myProducts.reduce((acc, product) => acc + product.price, 0).toFixed(2)}
                </p>
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
