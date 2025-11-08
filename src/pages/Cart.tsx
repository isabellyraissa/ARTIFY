import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Minus, Tag, MapPin, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const Cart = () => {
  const { items: cartItems, subtotal, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [cep, setCep] = useState("");
  const [shippingCalculated, setShippingCalculated] = useState(false);
  
  const shipping = shippingCalculated ? (subtotal > 200 ? 0 : 15) : 0;
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "BEMVINDO10") {
      setAppliedCoupon({ code: couponCode, discount: 10 });
    } else if (couponCode.toUpperCase() === "ARTIFY20") {
      setAppliedCoupon({ code: couponCode, discount: 20 });
    } else {
      alert("Cupom inválido!");
    }
  };

  const handleCalculateShipping = () => {
    if (cep.length === 8 || cep.length === 9) {
      setShippingCalculated(true);
    } else {
      alert("CEP inválido! Digite apenas números.");
    }
  };

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
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">por {item.artist}</p>
                        <p className="font-bold text-primary">R$ {item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <Card className="p-6 sticky top-20">
                  <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
                  
                  {/* Coupon Section */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="coupon">Cupom de Desconto</Label>
                    <div className="flex gap-2">
                      <Input
                        id="coupon"
                        placeholder="Digite o cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      />
                      <Button variant="secondary" onClick={handleApplyCoupon}>
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-xs text-green-600">
                        Cupom "{appliedCoupon.code}" aplicado! {appliedCoupon.discount}% de desconto
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Experimente: BEMVINDO10 ou ARTIFY20
                    </p>
                  </div>

                  {/* Shipping Section */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="cep">Calcular Frete</Label>
                    <div className="flex gap-2">
                      <Input
                        id="cep"
                        placeholder="00000-000"
                        value={cep}
                        onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                        maxLength={9}
                      />
                      <Button variant="secondary" onClick={handleCalculateShipping}>
                        <Truck className="h-4 w-4" />
                      </Button>
                    </div>
                    {shippingCalculated && (
                      <p className="text-xs text-green-600">
                        Frete calculado para CEP {cep}
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto ({appliedCoupon.discount}%)</span>
                        <span>-R$ {discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frete</span>
                      <span className="font-medium">
                        {!shippingCalculated 
                          ? "Calcular" 
                          : shipping === 0 
                            ? "Grátis" 
                            : `R$ ${shipping.toFixed(2)}`}
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
