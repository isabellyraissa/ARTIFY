import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  // Mock cart data - will be replaced with actual cart state
  const cartItems = [];

  const subtotal = 0;
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container px-4 md:px-6 py-12">
          <h1 className="text-4xl font-bold mb-8">Carrinho de Compras</h1>

          {cartItems.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <h2 className="text-2xl font-semibold">Seu carrinho está vazio</h2>
                <p className="text-muted-foreground">
                  Explore nossos produtos artesanais e adicione suas peças favoritas!
                </p>
                <Link to="/produtos">
                  <Button size="lg">Explorar Produtos</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Example cart item structure */}
                <Card className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {/* Product image */}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Nome do Produto</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        por Artista
                      </p>
                      <p className="font-bold text-primary">R$ 89,90</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">1</span>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="p-6 sticky top-20">
                  <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frete</span>
                      <span className="font-medium">
                        {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {subtotal < 200 && subtotal > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Frete grátis acima de R$ 200,00
                      </p>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6" size="lg" disabled={cartItems.length === 0}>
                    Finalizar Compra
                  </Button>
                  <Link to="/produtos">
                    <Button variant="outline" className="w-full mt-3">
                      Continuar Comprando
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
