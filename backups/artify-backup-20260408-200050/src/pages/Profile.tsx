import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { ensureUserProfile } from "@/lib/authProfile";
import { toast } from "@/hooks/use-toast";
import { Loader2, LogOut, User as UserIcon } from "lucide-react";

interface UserProfileRow {
  id: string;
  nome: string;
  tipo: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

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

      const { data: userRow, error: userError } = await supabase
        .from("users")
        .select("id, nome, tipo")
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
