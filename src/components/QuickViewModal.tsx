import { useState } from "react";
import { Product } from "@/data/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Heart, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Link } from "react-router-dom";

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickViewModal = ({ product, open, onOpenChange }: QuickViewModalProps) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [shippingCalculated, setShippingCalculated] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleCalculateShipping = () => {
    if (cep.length === 8 || cep.length === 9) {
      setShippingCalculated(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visualização Rápida</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80"
              onClick={() => toggleFavorite(product)}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite(product.id) ? "fill-primary text-primary" : ""}`}
              />
            </Button>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-muted-foreground">por {product.artist}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </span>
            </div>

            <Badge variant="secondary">{product.category}</Badge>

            <p className="text-sm text-muted-foreground">{product.description}</p>

            {/* Materials */}
            <div>
              <h4 className="font-semibold mb-2">Materiais:</h4>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material) => (
                  <Badge key={material} variant="outline">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            {product.dimensions && (
              <div>
                <h4 className="font-semibold mb-1">Dimensões:</h4>
                <p className="text-sm text-muted-foreground">{product.dimensions}</p>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Estoque:</span>
              <Badge variant={product.stock > 5 ? "secondary" : "destructive"}>
                {product.stock} disponível
              </Badge>
            </div>

            {/* Shipping Calculator */}
            <div className="space-y-2">
              <Label htmlFor="quick-cep">
                <Truck className="h-4 w-4 inline mr-1" />
                Calcular Frete
              </Label>
              <div className="flex gap-2">
                <Input
                  id="quick-cep"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
                  maxLength={9}
                />
                <Button variant="secondary" onClick={handleCalculateShipping}>
                  OK
                </Button>
              </div>
              {shippingCalculated && (
                <p className="text-xs text-green-600">
                  Frete: R$ 15,00 • Entrega em 5-7 dias úteis
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quick-quantity">Quantidade</Label>
              <Input
                id="quick-quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Link to={`/produto/${product.id}`} className="flex-1">
                <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
