import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Image as ImageIcon, Search } from "lucide-react";
import { artisans } from "@/data/artisans";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  artisanId: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    artisanId: "art1",
    lastMessage: "Olá! Sim, tenho essa peça disponível em estoque.",
    lastMessageTime: new Date(Date.now() - 3600000),
    unread: 2
  },
  {
    id: "2",
    artisanId: "art3",
    lastMessage: "Obrigada pelo interesse! Posso fazer personalizado sim.",
    lastMessageTime: new Date(Date.now() - 7200000),
    unread: 0
  }
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "art1",
    text: "Olá! Como posso ajudar?",
    timestamp: new Date(Date.now() - 7200000),
    isOwn: false
  },
  {
    id: "2",
    senderId: "me",
    text: "Oi! Vi o vaso de cerâmica azul. Tem disponível?",
    timestamp: new Date(Date.now() - 7000000),
    isOwn: true
  },
  {
    id: "3",
    senderId: "art1",
    text: "Olá! Sim, tenho essa peça disponível em estoque.",
    timestamp: new Date(Date.now() - 3600000),
    isOwn: false
  },
  {
    id: "4",
    senderId: "art1",
    text: "Você gostaria de adicionar ao carrinho?",
    timestamp: new Date(Date.now() - 3500000),
    isOwn: false
  }
];

const Messages = () => {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string>(conversations[0]?.id);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedArtisan = artisans.find(
    (a) => a.id === conversations.find((c) => c.id === selectedConversation)?.artisanId
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Math.random().toString(36).substring(7),
      senderId: "me",
      text: newMessage,
      timestamp: new Date(),
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const filteredConversations = conversations.filter((conv) => {
    const artisan = artisans.find((a) => a.id === conv.artisanId);
    return artisan?.storeName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <section className="container px-4 md:px-6 py-8">
          <h1 className="text-4xl font-bold mb-8">Mensagens</h1>

          <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="lg:col-span-1 flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conversas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {filteredConversations.map((conv) => {
                    const artisan = artisans.find((a) => a.id === conv.artisanId);
                    if (!artisan) return null;

                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`w-full p-4 rounded-lg text-left transition-colors hover:bg-muted ${
                          selectedConversation === conv.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={artisan.avatar} alt={artisan.name} />
                            <AvatarFallback>{artisan.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold truncate">{artisan.storeName}</p>
                              {conv.unread > 0 && (
                                <Badge variant="default" className="ml-2">
                                  {conv.unread}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {conv.lastMessageTime.toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2 flex flex-col">
              {selectedArtisan ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedArtisan.avatar} alt={selectedArtisan.name} />
                      <AvatarFallback>{selectedArtisan.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{selectedArtisan.storeName}</p>
                      <p className="text-sm text-muted-foreground">{selectedArtisan.name}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.isOwn
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}
                            >
                              {msg.timestamp.toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
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
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Selecione uma conversa para começar
                </div>
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
