import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { ensureUserProfile } from "@/lib/authProfile";
import { toast } from "@/hooks/use-toast";
import { Loader2, LogOut, User as UserIcon } from "lucide-react";
import { clearEphemeralSessionMarker } from "@/lib/authSession";
import {
  isMissingImageColumnError,
  removeArtisanProfileImage,
  uploadArtisanProfileImage,
} from "@/lib/storeMedia";

interface UserProfileRow {
  id: string;
  nome: string;
  tipo: string;
  avatar_image_data_url: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isBecomingArtisan, setIsBecomingArtisan] = useState(false);
  const [activeTab, setActiveTab] = useState("conta");
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isSavingProfileImage, setIsSavingProfileImage] = useState(false);
  const isImageFile = (file: File) => file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp|svg|heic|heif|avif)$/i.test(file.name);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;

      if (sessionError || !sessionData.session) {
        navigate("/auth", { replace: true });
        return;
      }

      setSession(sessionData.session);

      const profileError = await ensureUserProfile(sessionData.session.user);
      if (profileError) {
        toast({
          title: "Perfil parcial",
          description: `Falha ao sincronizar em users: ${profileError.message}`,
          variant: "destructive",
        });
      }

      const { data: userWithAvatar, error: userWithAvatarError } = await supabase
        .from("users")
        .select("id, nome, tipo, avatar_image_data_url")
        .eq("id", sessionData.session.user.id)
        .maybeSingle();
      let userRow = userWithAvatar;
      let userError = userWithAvatarError;

      if (userWithAvatarError?.code === "42703" || userWithAvatarError?.code === "PGRST204") {
        const { data: legacyUserRow, error: legacyUserError } = await supabase
          .from("users")
          .select("id, nome, tipo")
          .eq("id", sessionData.session.user.id)
          .maybeSingle();
        userRow = legacyUserRow ? { ...legacyUserRow, avatar_image_data_url: null } : null;
        userError = legacyUserError;
      }

      if (!active) return;

      if (userError) {
        toast({
          title: "Falha ao carregar perfil",
          description: userError.message,
          variant: "destructive",
        });
      } else if (userRow) {
        setProfile(userRow);
      }

      setIsLoading(false);
    };

    void load();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!active) return;
      if (event === "SIGNED_OUT" || !currentSession) {
        navigate("/auth", { replace: true });
      }
      setSession(currentSession);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

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

  const handleBecomeArtisan = async () => {
    if (!session) return;
    setIsBecomingArtisan(true);

    const { error } = await supabase.from("users").update({ tipo: "artesao" }).eq("id", session.user.id);

    setIsBecomingArtisan(false);

    if (error) {
      toast({
        title: "Falha ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProfile((prev) => (prev ? { ...prev, tipo: "artesao" } : prev));
    setActiveTab("artesao");
    toast({
      title: "Perfil atualizado",
      description: "Voce agora e um artesao e pode usar recursos de vendedor.",
    });
  };

  const canBecomeArtisan = profile && !["artesao", "vendedor"].includes(profile.tipo.toLowerCase());
  const isArtisan = profile ? ["artesao", "vendedor"].includes(profile.tipo.toLowerCase()) : false;

  const handleProfileImageFile = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setProfileImagePreview(localUrl);
    setProfileImageFile(file);
    event.target.value = "";
  };

  const handleSaveProfileImage = async () => {
    if (!session || !profileImageFile) return;

    setIsSavingProfileImage(true);
    const { error } = await uploadArtisanProfileImage(session.user.id, profileImageFile);
    setIsSavingProfileImage(false);

    if (error) {
      toast({
        title: "Falha ao salvar foto",
        description: isMissingImageColumnError(error)
          ? "Falta a coluna de imagem no Supabase. Rode o arquivo `supabase_google_auth.sql` inteiro e tente novamente em alguns segundos."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    const { data: refreshedProfile } = await supabase
      .from("users")
      .select("avatar_image_data_url")
      .eq("id", session.user.id)
      .maybeSingle();
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            avatar_image_data_url: refreshedProfile?.avatar_image_data_url ?? prev.avatar_image_data_url,
          }
        : prev,
    );
    setProfileImageFile(null);
    setProfileImagePreview(null);
    toast({
      title: "Foto de perfil salva",
      description: "Sua foto de artesao ja esta visivel na loja.",
    });
  };

  const handleRemoveProfileImage = async () => {
    if (!session) return;

    const { error } = await removeArtisanProfileImage(session.user.id);
    if (error) {
      toast({
        title: "Falha ao remover foto",
        description: isMissingImageColumnError(error)
          ? "Falta a coluna de imagem no Supabase. Rode o arquivo `supabase_google_auth.sql` inteiro e tente novamente em alguns segundos."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    setProfile((prev) => (prev ? { ...prev, avatar_image_data_url: null } : prev));
    setProfileImageFile(null);
    setProfileImagePreview(null);
    toast({
      title: "Foto removida",
      description: "O perfil voltou para o avatar padrao.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Perfil conectado</h1>

          {isLoading ? (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Carregando dados da conta...
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`grid w-full mb-4 ${isArtisan ? "grid-cols-2" : "grid-cols-1"}`}>
                <TabsTrigger value="conta">Conta</TabsTrigger>
                {isArtisan ? <TabsTrigger value="artesao">Artesao</TabsTrigger> : null}
              </TabsList>

              <TabsContent value="conta">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      Minha conta
                    </CardTitle>
                    <CardDescription>Dados da sessao e do perfil salvo no Supabase</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <p className="font-medium">{session?.user.email ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nome (public.users)</p>
                      <p className="font-medium">{profile?.nome ?? "Nao encontrado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <Badge variant="secondary">{profile?.tipo ?? "cliente"}</Badge>
                    </div>
                    {canBecomeArtisan ? (
                      <div className="pt-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" disabled={isBecomingArtisan}>
                              {isBecomingArtisan ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Atualizando perfil...
                                </>
                              ) : (
                                "Quero me tornar artesao"
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ativar perfil de artesao?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ao confirmar, seu tipo de usuario sera alterado para artesao no Supabase.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handleBecomeArtisan}>Confirmar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ) : null}
                    <div>
                      <p className="text-sm text-muted-foreground">User ID</p>
                      <p className="font-mono text-xs break-all">{session?.user.id ?? "-"}</p>
                    </div>
                    <div className="pt-2">
                      <Button variant="destructive" onClick={handleSignOut} disabled={isSigningOut}>
                        {isSigningOut ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saindo...
                          </>
                        ) : (
                          <>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair da conta
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {isArtisan ? (
                <TabsContent value="artesao">
                  <Card>
                    <CardHeader>
                      <CardTitle>Area do Artesao</CardTitle>
                      <CardDescription>
                        Acesse o painel para criar sua loja, cadastrar produtos e gerenciar suas vendas.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>1. Crie sua loja no painel.</p>
                        <p>2. Publique produtos com nome, preco e descricao.</p>
                        <p>3. Acompanhe a operacao da sua vitrine.</p>
                      </div>

                      <div className="space-y-3">
                        <p className="font-medium">Foto de perfil do artesao</p>
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              profileImagePreview ??
                              profile?.avatar_image_data_url ??
                              "/placeholder.svg"
                            }
                            alt="Foto de perfil do artesao"
                            className="w-20 h-20 rounded-full object-cover border"
                            onError={(event) => {
                              event.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                          <div className="space-y-2">
                            <Input type="file" accept="image/*,.heic,.heif" onChange={handleProfileImageFile} />
                            <p className="text-xs text-muted-foreground">
                              Aceita imagens em geral: JPEG, PNG, WEBP, GIF e outros formatos de imagem.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={handleSaveProfileImage} disabled={!profileImageFile || isSavingProfileImage}>
                            {isSavingProfileImage ? "Salvando..." : "Salvar foto de perfil"}
                          </Button>
                          <Button variant="outline" onClick={handleRemoveProfileImage}>
                            Remover foto
                          </Button>
                        </div>
                      </div>

                      <Button onClick={() => navigate("/vendedor")}>Ir para painel do artesao</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              ) : null}
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
