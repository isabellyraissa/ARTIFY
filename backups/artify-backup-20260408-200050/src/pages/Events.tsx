import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

const cities = ["Todas", "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre", "Salvador"];
const eventTypes = ["Todos", "Feira", "Workshop", "Exposição", "Festival"];
const artCategories = ["Todas", "Cerâmica", "Bordado", "Escultura", "Pintura", "Decoração", "Joalheria"];

const events = [
  {
    id: 1,
    title: "Feira de Artesanato de Primavera",
    date: "15-17 de Abril, 2024",
    time: "09:00 - 18:00",
    location: "Parque Ibirapuera",
    city: "São Paulo",
    description: "Grande evento de artesanato com mais de 200 expositores apresentando cerâmica, bordados e muito mais.",
    image: "/placeholder.svg",
    type: "Feira",
    category: "Cerâmica",
    artisans: ["Maria Cerâmica", "João Artesão", "Ana Barro"],
  },
  {
    id: 2,
    title: "Workshop de Cerâmica Avançada",
    date: "22 de Abril, 2024",
    time: "14:00 - 17:00",
    location: "Ateliê Criativo",
    city: "Rio de Janeiro",
    description: "Aprenda técnicas avançadas de modelagem e esmaltação em cerâmica com mestres artesãos.",
    image: "/placeholder.svg",
    type: "Workshop",
    category: "Cerâmica",
    artisans: ["Pedro Silva"],
  },
  {
    id: 3,
    title: "Exposição de Arte Sustentável",
    date: "1-30 de Maio, 2024",
    time: "10:00 - 20:00",
    location: "Galeria Arte & Cia",
    city: "Belo Horizonte",
    description: "Mostra de arte criada com materiais reciclados por artesãos locais comprometidos com sustentabilidade.",
    image: "/placeholder.svg",
    type: "Exposição",
    category: "Escultura",
    artisans: ["Carla Sustentável", "Lucas Eco"],
  },
  {
    id: 4,
    title: "Festival de Bordado Tradicional",
    date: "10-12 de Maio, 2024",
    time: "10:00 - 19:00",
    location: "Centro Cultural",
    city: "Curitiba",
    description: "Celebração do bordado tradicional brasileiro com demonstrações ao vivo e venda de peças exclusivas.",
    image: "/placeholder.svg",
    type: "Festival",
    category: "Bordado",
    artisans: ["Mariana Bordados", "Sofia Linhas"],
  },
  {
    id: 5,
    title: "Feira de Joalheria Artesanal",
    date: "5-7 de Junho, 2024",
    time: "11:00 - 20:00",
    location: "Shopping Cultural",
    city: "Porto Alegre",
    description: "Encontro de joalheiros artesanais apresentando peças únicas em prata, ouro e pedras naturais.",
    image: "/placeholder.svg",
    type: "Feira",
    category: "Joalheria",
    artisans: ["Rafael Joias", "Camila Prata"],
  },
  {
    id: 6,
    title: "Workshop de Pintura em Tecido",
    date: "15 de Junho, 2024",
    time: "15:00 - 18:00",
    location: "Espaço Arte Livre",
    city: "Salvador",
    description: "Aprenda técnicas de pintura em tecido e crie suas próprias peças decorativas.",
    image: "/placeholder.svg",
    type: "Workshop",
    category: "Pintura",
    artisans: ["Julia Tintas"],
  },
];

const Events = () => {
  const [selectedCity, setSelectedCity] = useState("Todas");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const filteredEvents = events.filter(event => {
    const matchesCity = selectedCity === "Todas" || event.city === selectedCity;
    const matchesType = selectedType === "Todos" || event.type === selectedType;
    const matchesCategory = selectedCategory === "Todas" || event.category === selectedCategory;
    return matchesCity && matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-5xl font-bold">Eventos & Feiras</h1>
              <p className="text-xl text-muted-foreground">
                Descubra workshops, feiras e exposições de artesanato perto de você
              </p>
            </div>
          </div>
        </section>

        <section className="container px-4 md:px-6 py-12">
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-sm font-semibold mb-3">Filtrar por Cidade</h3>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <Badge
                    key={city}
                    variant={selectedCity === city ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 hover:bg-primary/10 transition-colors"
                    onClick={() => setSelectedCity(city)}
                  >
                    {city}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Tipo de Evento</h3>
              <div className="flex flex-wrap gap-2">
                {eventTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 hover:bg-primary/10 transition-colors"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Categoria de Arte</h3>
              <div className="flex flex-wrap gap-2">
                {artCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 hover:bg-primary/10 transition-colors"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4 text-muted-foreground">
            Mostrando {filteredEvents.length} {filteredEvents.length === 1 ? 'evento' : 'eventos'}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="artisan-card overflow-hidden group cursor-pointer">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 right-4">{event.type}</Badge>
                  <Badge variant="secondary" className="absolute top-4 left-4">{event.category}</Badge>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{event.location}, {event.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{event.artisans.length} {event.artisans.length === 1 ? 'artesão' : 'artesãos'}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Artesãos participantes:</p>
                    <div className="flex flex-wrap gap-1">
                      {event.artisans.slice(0, 2).map((artisan, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {artisan}
                        </Badge>
                      ))}
                      {event.artisans.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{event.artisans.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button className="w-full">
                    Ver Mais Detalhes
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum evento encontrado com os filtros selecionados
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
