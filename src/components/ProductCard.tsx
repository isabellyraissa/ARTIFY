import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  artist: string;
  category: string;
}

const ProductCard = ({ id, name, price, image, artist, category }: ProductCardProps) => {
  return (
    <Card className="artisan-card group">
      <Link to={`/produto/${id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.preventDefault();
              // Wishlist functionality
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>
      
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {category}
          </span>
        </div>
        
        <Link to={`/produto/${id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground">
          por <span className="font-medium">{artist}</span>
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-primary">
            R$ {price.toFixed(2)}
          </span>
          <Link to={`/produto/${id}`}>
            <Button size="sm" variant="secondary">
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
