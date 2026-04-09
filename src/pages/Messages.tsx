import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, Image as ImageIcon, Search, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StoreChatMeta {
  id: string;
  nome: string;
  artesao_id: string;
  artesao_nome: string;
}

interface ThreadMessage {
  id: string;
  text: string;
  timestampIso: string;
}

const getThreadStorageKey = (userId: string, storeId: string) => `artify.thread.${userId}.${storeId}`;

const readThread = (userId: string, storeId: string): ThreadMessage[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(getThreadStorageKey(userId, storeId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is ThreadMessage =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as ThreadMessage).id === "string" &&
        typeof (item as ThreadMessage).text === "string" &&
        typeof (item as ThreadMessage).timestampIso === "string",
    );
  } catch {
    return [];
  }
};

const writeThread = (userId: string, storeId: string, messages: ThreadMessage[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getThreadStorageKey(userId, storeId), JSON.stringify(messages));
};

const Messages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [stores, setStores] = useState<StoreChatMeta[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messagesByStore, setMessagesByStore] = useState<Record<string, ThreadMessage[]>>({});

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!active) return;
      const userId = sessionData.session?.user.id ?? null;
      setSessionUserId(userId);

      const [{ data: storeRows, error: storeError }, { data: userRows }] = await Promise.all([
        supabase.from("loja").select("id, nome, artesao_id"),
        supabase.from("users").select("id, nome"),
      ]);

      if (!active) return;

      if (storeError) {
        setStores([]);
        setIsLoadingStores(false);
        return;
      }

      const usersById = new Map((userRows ?? []).map((user) => [user.id, user.nome]));
      const mappedStores = (storeRows ?? []).map((store) => ({
        id: store.id,
        nome: store.nome,
        artesao_id: store.artesao_id,
        artesao_nome: usersById.get(store.artesao_id) ?? "Artesao",
      }));

      setStores(mappedStores);
      setIsLoadingStores(false);

      if (!userId) return;
      const map: Record<string, ThreadMessage[]> = {};
      for (const store of mappedStores) {
        map[store.id] = readThread(userId, store.id);
      }
      setMessagesByStore(map);

      const fromQuery = searchParams.get("store");
      const initialStore = mappedStores.find((store) => store.id === fromQuery)?.id ?? mappedStores[0]?.id ?? null;
      setSelectedStoreId(initialStore);
    };

    void load();

    return () => {
      active = false;
    };
  }, [searchParams]);

  const filteredStores = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return stores;
    return stores.filter(
      (store) => store.nome.toLowerCase().includes(query) || store.artesao_nome.toLowerCase().includes(query),
    );
  }, [searchQuery, stores]);

  const selectedStore = stores.find((store) => store.id === selectedStoreId) ?? null;
  const selectedThread = selectedStoreId ? messagesByStore[selectedStoreId] ?? [] : [];

  const handleSelectStore = (storeId: string) => {
    setSelectedStoreId(storeId);
    setSearchParams({ store: storeId });
  };

  const handleSendMessage = () => {
    if (!sessionUserId || !selectedStoreId || !newMessage.trim()) return;

    const nextMessage: ThreadMessage = {
      id: Math.random().toString(36).slice(2),
      text: newMessage.trim(),
      timestampIso: new Date().toISOString(),
    };

    const nextThread = [...(messagesByStore[selectedStoreId] ?? []), nextMessage];
    setMessagesByStore((prev) => ({ ...prev, [selectedStoreId]: nextThread }));
    writeThread(sessionUserId, selectedStoreId, nextThread);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <section className="container px-4 md:px-6 py-8">
          <h1 className="text-4xl font-bold mb-8">Mensagens por Loja</h1>

          <div className="grid lg:grid-cols-3 gap-6 h-[620px]">
            <Card className="lg:col-span-1 flex flex-col">
              <div className="p-4 border-b space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar loja ou artesao..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Privacidade: conversas separadas por loja e por usuario.</p>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2">
                  {isLoadingStores ? <p className="text-sm text-muted-foreground p-2">Carregando lojas...</p> : null}
                  {!isLoadingStores && filteredStores.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-2">Nenhuma loja encontrada.</p>
                  ) : null}

                  {filteredStores.map((store) => {
                    const thread = messagesByStore[store.id] ?? [];
                    const lastMessage = thread[thread.length - 1];

                    return (
                      <button
                        key={store.id}
                        onClick={() => handleSelectStore(store.id)}
                        className={`w-full p-3 rounded-lg text-left transition-colors hover:bg-muted ${
                          selectedStoreId === store.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>{store.artesao_nome.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold truncate">{store.nome}</p>
                              {thread.length > 0 ? <Badge variant="secondary">{thread.length}</Badge> : null}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">Artesao: {store.artesao_nome}</p>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {lastMessage ? lastMessage.text : "Sem mensagens ainda."}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>

            <Card className="lg:col-span-2 flex flex-col">
              {!selectedStore ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-center px-6">
                  <div>
                    <MessageSquare className="h-12 w-12 mx-auto mb-3" />
                    <p>Selecione uma loja para conversar com um artesao especifico.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b">
                    <p className="font-semibold">{selectedStore.nome}</p>
                    <p className="text-sm text-muted-foreground">Conversa privada com {selectedStore.artesao_nome}</p>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    {selectedThread.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-center">
                        <p>Nenhuma mensagem para esta loja ainda.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedThread.map((msg) => (
                          <div key={msg.id} className="ml-auto max-w-[80%] rounded-lg p-3 bg-primary text-primary-foreground">
                            <p>{msg.text}</p>
                            <p className="text-xs mt-1 text-primary-foreground/70">
                              {new Date(msg.timestampIso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Input
                        placeholder={`Mensagem para ${selectedStore.nome}...`}
                        value={newMessage}
                        onChange={(event) => setNewMessage(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
