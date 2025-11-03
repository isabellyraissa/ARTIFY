import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, Package, Shield, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container px-4 md:px-6 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Produto não encontrado</h1>
          <Link to="/produtos">
            <Button>Voltar aos Produtos</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Product Detail */}
        <section className="container px-4 md:px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="animate-fade-in">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <Badge variant="secondary" className="mb-4">
                  {product.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">
                  por <Link to="#" className="font-medium text-primary hover:underline">{product.artist}</Link>
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(24 avaliações)</span>
              </div>

              {/* Price */}
              <div className="py-4">
                <p className="text-4xl font-bold text-primary">
                  R$ {product.price.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Em até 3x sem juros
                </p>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Materials */}
              <div>
                <h3 className="font-semibold mb-2">Materiais</h3>
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
                  <h3 className="font-semibold mb-2">Dimensões</h3>
                  <p className="text-muted-foreground">{product.dimensions}</p>
                </div>
              )}

              {/* Stock */}
              <div>
                <p className="text-sm">
                  <span className="font-medium">Estoque:</span>{" "}
                  <span className={product.stock > 5 ? "text-green-600" : "text-orange-600"}>
                    {product.stock > 5 ? "Disponível" : `Apenas ${product.stock} unidades`}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Adicionar ao Carrinho
                </Button>
                <Button size="lg" variant={isFavorite(product.id) ? "secondary" : "outline"} onClick={() => toggleFavorite(product)}>
                  <Heart className={`h-5 w-5 ${isFavorite(product.id) ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Frete Grátis<br/>acima de R$200</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Compra<br/>Segura</p>
                </div>
                <div className="text-center">
                  <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Embalagem<br/>Especial</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="container px-4 md:px-6 py-16 border-t">
            <h2 className="text-3xl font-bold mb-8">Você também pode gostar</h2>
            <div className="gallery-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
