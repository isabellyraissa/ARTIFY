import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Bell, Heart, MessageSquare, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { products, type Product } from "@/data/products";
import { artisans, type Artisan } from "@/data/artisans";
import { supabase } from "@/lib/supabase";
import MiniCart from "./MiniCart";

type SearchResult =
  | { type: "product"; item: Product }
  | { type: "store"; item: Artisan };

const Header = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const searchResults: SearchResult[] = searchQuery
    ? [
        ...products
          .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 3)
          .map((p) => ({ type: "product" as const, item: p })),
        ...artisans
          .filter((a) => a.storeName.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 2)
          .map((a) => ({ type: "store" as const, item: a })),
      ]
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
    };

    void loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!active) return;
      setSession(currentSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const handleSelectResult = (type: SearchResult["type"], id: string) => {
    if (type === "product") {
      navigate(`/produto/${id}`);
    } else {
      navigate(`/loja/${id}`);
    }
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ARTIFY
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos, artesaos..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery) {
                    navigate(`/produtos?search=${searchQuery}`);
                    setShowSearchResults(false);
                  }
                }}
              />
              {showSearchResults && searchResults.length > 0 && (
                <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-2">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectResult(result.type, result.item.id)}
                          className="w-full p-3 text-left hover:bg-muted rounded-lg transition-colors flex items-center gap-3"
                        >
                          {result.type === "product" ? (
                            <>
                              <img src={result.item.image} alt={result.item.name} className="w-12 h-12 rounded object-cover" />
                              <div>
                                <p className="font-medium">{result.item.name}</p>
                                <p className="text-sm text-muted-foreground">R$ {result.item.price.toFixed(2)}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <img
                                src={result.item.avatar}
                                alt={result.item.storeName}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium">{result.item.storeName}</p>
                                <p className="text-sm text-muted-foreground">Loja • {result.item.specialty}</p>
                              </div>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              )}
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link to="/produtos">
              <Button variant="ghost" className="hidden lg:flex">
                Produtos
              </Button>
            </Link>
            <Link to="/artesaos">
              <Button variant="ghost" className="hidden lg:flex">
                Artesaos
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="ghost" className="hidden lg:flex">
                Blog
              </Button>
            </Link>
            <Link to="/eventos">
              <Button variant="ghost" className="hidden lg:flex">
                Eventos
              </Button>
            </Link>

            <Link to="/mensagens">
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </Link>

            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {showNotifications && (
                <Card className="absolute top-full right-0 mt-2 w-80 z-50">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold">Notificacoes</h3>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => markAllAsRead()}>
                        Marcar todas como lidas
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="max-h-96">
                    <div className="p-2">
                      {notifications.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Nenhuma notificacao</p>
                      ) : (
                        notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              if (notif.link) navigate(notif.link);
                              setShowNotifications(false);
                            }}
                            className={`w-full p-3 text-left hover:bg-muted rounded-lg transition-colors ${
                              !notif.read ? "bg-primary/5" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{notif.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {notif.timestamp.toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              {!notif.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              )}
            </div>

            <Link to="/cliente">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </Link>

            <MiniCart />

            <Link to={session ? "/perfil" : "/auth"}>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
