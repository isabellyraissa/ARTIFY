import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import MainLayout from "@/components/MainLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { useDatabaseProducts } from "@/hooks/useDatabaseProducts";

const Products = () => {
  const [sortBy, setSortBy] = useState("featured");
  const { data: products = [], isLoading, error } = useDatabaseProducts();

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "newest") return b.id.localeCompare(a.id);
    return a.name.localeCompare(b.name);
  });

  return (
    <MainLayout>
      <main className="flex-1">
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Todos os Produtos</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore nossa colecao completa de produtos artesanais unicos
            </p>
          </div>
        </section>

        <section className="container px-4 md:px-6 py-8">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="text-sm text-muted-foreground">
                Exibindo {sortedProducts.length} {sortedProducts.length === 1 ? "produto" : "produtos"}
              </p>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Destaques</SelectItem>
                    <SelectItem value="price-low">Menor Preco</SelectItem>
                    <SelectItem value="price-high">Maior Preco</SelectItem>
                    <SelectItem value="newest">Mais Recentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading && <p className="text-muted-foreground">Carregando produtos do banco...</p>}

            {error && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Nao foi possivel carregar os produtos do banco.</p>
              </div>
            )}

            {!isLoading && !error && (
              <div className="gallery-grid">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {!isLoading && !error && sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Nenhum produto encontrado no banco.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default Products;
