import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const Products = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["Todos", "Cerâmica", "Decoração", "Joias", "Crochê", "Pintura", "Papelaria"];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category.toLowerCase() === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Todos os Produtos</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore nossa coleção completa de produtos artesanais únicos
            </p>
          </div>
        </section>

        {/* Layout with Sidebar */}
        <section className="container px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-6">
            {/* Sidebar on desktop */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {/* Main content */}
            <div>
              {/* Sorting */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <p className="text-sm text-muted-foreground">
                  Exibindo {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
                </p>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Destaques</SelectItem>
                      <SelectItem value="price-low">Menor Preço</SelectItem>
                      <SelectItem value="price-high">Maior Preço</SelectItem>
                      <SelectItem value="newest">Mais Recentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="gallery-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    Nenhum produto encontrado nesta categoria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
