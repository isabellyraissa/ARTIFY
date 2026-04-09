import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, FileText, MapPin, Tag, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cartItems, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [cep, setCep] = useState("");
  const [shippingCalculated, setShippingCalculated] = useState(false);
  
  const shipping = shippingCalculated ? (subtotal > 200 ? 0 : 15) : 0;
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = subtotal - discount + shipping;

  const [address, setAddress] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    cep: ""
  });

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "BEMVINDO10") {
      setAppliedCoupon({ code: couponCode, discount: 10 });
      toast({ title: "Cupom aplicado!", description: "10% de desconto" });
    } else if (couponCode.toUpperCase() === "ARTIFY20") {
      setAppliedCoupon({ code: couponCode, discount: 20 });
      toast({ title: "Cupom aplicado!", description: "20% de desconto" });
    } else {
      toast({ title: "Cupom inválido", variant: "destructive" });
    }
  };

  const handleCalculateShipping = () => {
    if (cep.length === 8 || cep.length === 9) {
      setShippingCalculated(true);
      toast({ title: "Frete calculado!", description: "Entrega em 5-7 dias úteis" });
    } else {
      toast({ title: "CEP inválido", description: "Digite apenas números", variant: "destructive" });
    }
  };

  const handleConfirmOrder = () => {
    if (!address.street || !address.number || !cep || !shippingCalculated) {
      toast({
        title: "Endereço incompleto",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const orderId = Math.random().toString(36).substring(7).toUpperCase();
    clearCart();
    navigate(`/pedido/${orderId}`);
    toast({
      title: "Pedido confirmado!",
      description: `Pedido #${orderId} realizado com sucesso`,
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 md:px-6 py-12">
          <Card className="p-12 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Carrinho vazio</h2>
            <p className="text-muted-foreground mb-6">
              Adicione produtos ao carrinho para continuar
            </p>
            <Button onClick={() => navigate("/produtos")}>Ver Produtos</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <section className="container px-4 md:px-6 py-12">
          <h1 className="text-4xl font-bold mb-8">Finalizar Pedido</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Products Summary */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Produtos Selecionados</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                        <p className="font-bold text-primary">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Delivery Address */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Endereço de Entrega</h2>
                </div>
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="street">Rua *</Label>
                      <Input
                        id="street"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="Nome da rua"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number">Número *</Label>
                      <Input
                        id="number"
                        value={address.number}
                        onChange={(e) => setAddress({ ...address, number: e.target.value })}
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={address.complement}
                      onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                      placeholder="Apto, bloco, etc"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro *</Label>
                      <Input
                        id="neighborhood"
                        value={address.neighborhood}
                        onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                        placeholder="Bairro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <Input
                        id="city"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="Cidade"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Método de Pagamento</h2>
                </div>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <p className="font-medium">PIX</p>
                        <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Cartão de Crédito</p>
                        <p className="text-sm text-muted-foreground">Em até 12x sem juros</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="boleto" id="boleto" />
                    <Label htmlFor="boleto" className="flex items-center gap-2 cursor-pointer flex-1">
                      <FileText className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Boleto Bancário</p>
                        <p className="text-sm text-muted-foreground">Vencimento em 3 dias</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

                {/* Coupon */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="coupon">
                    <Tag className="h-4 w-4 inline mr-1" />
                    Cupom de Desconto
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="Digite o cupom"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                    <Button variant="secondary" onClick={handleApplyCoupon}>
                      Aplicar
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-xs text-green-600">
                      Cupom "{appliedCoupon.code}" aplicado! {appliedCoupon.discount}% OFF
                    </p>
                  )}
                </div>

                {/* Shipping */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="cep">
                    <Truck className="h-4 w-4 inline mr-1" />
                    Calcular Frete
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={cep}
                      onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                      maxLength={9}
                    />
                    <Button variant="secondary" onClick={handleCalculateShipping}>
                      Calcular
                    </Button>
                  </div>
                  {shippingCalculated && (
                    <p className="text-xs text-green-600">
                      Frete calculado • Entrega em 5-7 dias
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
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleConfirmOrder}
                >
                  Confirmar Pedido
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
