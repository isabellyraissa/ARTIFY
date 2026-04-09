import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Product } from "@/data/products";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isLiked = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(product);
  };

  return (
    <Card className="artisan-card group relative flex flex-col h-full">
      {product.stock < 5 && product.stock > 0 && (
        <Badge variant="destructive" className="absolute top-2 left-2 z-10">
          Ultimas unidades!
        </Badge>
      )}

      <Link to={`/produto/${product.id}`}>
        <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = "/placeholder.svg";
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 backdrop-blur-sm transition-colors ${
              isLiked ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "bg-background/80 hover:bg-background"
            }`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          {product.stock === 0 && (
            <Badge variant="destructive" className="text-xs">
              Esgotado
            </Badge>
          )}
        </div>

        <Link to={`/produto/${product.id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
        </Link>

        <p className="text-sm text-muted-foreground">
          por <span className="font-medium">{product.artist}</span>
        </p>

        <div className="mt-auto space-y-3 pt-2">
          <span className="text-2xl font-bold text-primary block">R$ {product.price.toFixed(2)}</span>
          <div className="grid grid-cols-2 gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 w-full">
                  <Eye className="h-4 w-4" />
                  Ver rapido
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{product.name}</DialogTitle>
                  <DialogDescription>por {product.artist}</DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded"
                    onError={(event) => {
                      event.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <div className="space-y-3">
                    <Badge variant="secondary">{product.category}</Badge>
                    <p className="text-sm text-muted-foreground line-clamp-4">{product.description}</p>
                    <p className="text-2xl font-bold text-primary">R$ {product.price.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <Button onClick={handleAddToCart} className="gap-1">
                        <ShoppingCart className="h-4 w-4" />
                        Adicionar ao Carrinho
                      </Button>
                      <Link to={`/produto/${product.id}`}>
                        <Button variant="ghost">Ver detalhes</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button size="sm" onClick={handleAddToCart} disabled={product.stock === 0} className="gap-1 w-full">
              <ShoppingCart className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
