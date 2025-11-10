import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck, MapPin } from "lucide-react";

const OrderStatus = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const orderSteps = [
    { label: "Pedido Confirmado", icon: CheckCircle, completed: true, date: "Hoje, 14:30" },
    { label: "Pagamento Aprovado", icon: CheckCircle, completed: true, date: "Hoje, 14:32" },
    { label: "Preparando Envio", icon: Package, completed: true, date: "Hoje, 15:00" },
    { label: "Em Trânsito", icon: Truck, completed: false, date: "Previsão: 2 dias" },
    { label: "Entregue", icon: MapPin, completed: false, date: "Previsão: 5-7 dias" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <section className="container px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Pedido Confirmado!</h1>
              <p className="text-lg text-muted-foreground">
                Pedido #{orderId}
              </p>
            </div>

            {/* Order Timeline */}
            <Card className="p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">Status do Pedido</h2>
              <div className="space-y-6">
                {orderSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {index < orderSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              step.completed ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`font-semibold ${
                                step.completed ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-sm text-muted-foreground">{step.date}</p>
                          </div>
                          {step.completed && (
                            <Badge variant="secondary">Concluído</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Order Details */}
            <Card className="p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Detalhes da Entrega</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Endereço:</span>
                  <span className="font-medium text-right">
                    Rua das Flores, 123 - Centro<br />
                    São Paulo, SP - 01234-567
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Previsão de Entrega:</span>
                  <span className="font-medium">5-7 dias úteis</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método de Envio:</span>
                  <span className="font-medium">Transportadora Express</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Código de Rastreio:</span>
                  <span className="font-medium font-mono">BR{orderId}123456789</span>
                </div>
              </div>
            </Card>

            {/* Order Summary */}
            <Card className="p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Resumo do Pedido</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">R$ 189,90</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Desconto (10%)</span>
                  <span>-R$ 18,99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium">R$ 15,00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Pago</span>
                  <span className="text-primary">R$ 185,91</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Link to="/produtos" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
              <Link to="/mensagens" className="flex-1">
                <Button className="w-full">
                  Contatar Vendedor
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OrderStatus;
