import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ensureUserProfile } from "@/lib/authProfile";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error) {
        setIsCheckingSession(false);
        return;
      }

      if (data.session) {
        const profileError = await ensureUserProfile(data.session.user);
        if (profileError) {
          toast({
            title: "Conta conectada",
            description: `Login ok, mas falhou ao sincronizar perfil: ${profileError.message}`,
            variant: "destructive",
          });
        }
        navigate("/perfil", { replace: true });
        return;
      }

      setIsCheckingSession(false);
    };

    void checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        const profileError = await ensureUserProfile(session.user);
        if (profileError) {
          toast({
            title: "Login realizado",
            description: `Falha ao sincronizar perfil: ${profileError.message}`,
            variant: "destructive",
          });
        }
        navigate("/perfil", { replace: true });
      }
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });

    if (error) {
      toast({
        title: "Falha no login com Google",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 py-16">
        <div className="max-w-lg mx-auto animate-fade-in-up">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Entrar no ARTIFY</CardTitle>
              <CardDescription>Login simplificado e seguro com sua conta Google</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isCheckingSession ? (
                <div className="flex items-center justify-center py-4 text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verificando sessao...
                </div>
              ) : (
                <Button className="w-full" size="lg" onClick={handleGoogleLogin} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Redirecionando...
                    </>
                  ) : (
                    "Continuar com Google"
                  )}
                </Button>
              )}
              <p className="text-xs text-muted-foreground text-center">
                Ao continuar, voce aceita os termos de uso e politicas da plataforma.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
