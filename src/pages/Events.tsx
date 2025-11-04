import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Feira de Artesanato de São Paulo",
    date: "20-22 Abr 2024",
    location: "Parque Ibirapuera, São Paulo - SP",
    time: "09:00 - 18:00",
    attendees: "500+ artesãos",
    description: "A maior feira de artesanato do estado com mais de 500 expositores.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Encontro de Ceramistas do Sul",
    date: "15 Abr 2024",
    location: "Porto Alegre - RS",
    time: "14:00 - 20:00",
    attendees: "150+ participantes",
    description: "Encontro dedicado à arte da cerâmica com workshops e exposições.",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Festival de Arte Popular",
    date: "28-30 Abr 2024",
    location: "Salvador - BA",
    time: "10:00 - 19:00",
    attendees: "300+ artesãos",
    description: "Celebração da cultura popular com artesanato tradicional nordestino.",
    image: "/placeholder.svg",
  },
];

const Events = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Eventos e Feiras</h1>
            <p className="text-xl opacity-90">
              Encontre feiras e eventos de artesanato perto de você
            </p>
          </div>
        </section>

        <section className="container px-4 md:px-6 py-12">
          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="secondary">Todos os Eventos</Button>
            <Button variant="outline">Este Mês</Button>
            <Button variant="outline">Próximos</Button>
            <Button variant="outline">Por Região</Button>
          </div>

          <div className="space-y-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full md:w-64 h-48 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">Feira</Badge>
                      <h3 className="font-display text-2xl font-bold mb-2">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Data</div>
                          <div className="text-sm text-muted-foreground">{event.date}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Horário</div>
                          <div className="text-sm text-muted-foreground">{event.time}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Local</div>
                          <div className="text-sm text-muted-foreground">{event.location}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Participantes</div>
                          <div className="text-sm text-muted-foreground">{event.attendees}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button>Ver Detalhes</Button>
                      <Button variant="outline">Salvar Evento</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">Carregar Mais Eventos</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
