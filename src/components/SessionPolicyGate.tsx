import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { shouldInvalidateStoredSessionOnEntry } from "@/lib/authSession";

interface SessionPolicyGateProps {
  children: ReactNode;
}

const SessionPolicyGate = ({ children }: SessionPolicyGateProps) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    const enforcePolicy = async () => {
      if (shouldInvalidateStoredSessionOnEntry()) {
        await supabase.auth.signOut({ scope: "local" });
      }

      if (active) setIsReady(true);
    };

    void enforcePolicy();

    return () => {
      active = false;
    };
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Verificando seguranca da sessao...
      </div>
    );
  }

  return <>{children}</>;
};

export default SessionPolicyGate;
