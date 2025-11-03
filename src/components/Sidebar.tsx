import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { products } from "@/data/products";

const categories = [
  { name: "Cerâmica", count: products.filter(p => p.category === "Cerâmica").length },
  { name: "Decoração", count: products.filter(p => p.category === "Decoração").length },
  { name: "Joias", count: products.filter(p => p.category === "Joias").length },
];

const Sidebar = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Cerâmica"]);
  const location = useLocation();

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <aside className="w-64 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Categorias
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Explore por categoria
        </p>
      </div>

      <nav className="p-4 space-y-1">
        <Link to="/produtos">
          <Button
            variant={location.pathname === "/produtos" && !location.search ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            Todos os Produtos
            <Badge variant="secondary" className="ml-auto">
              {products.length}
            </Badge>
          </Button>
        </Link>

        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.name);
          const isActive = location.search.includes(`category=${category.name}`);

          return (
            <div key={category.name}>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => toggleCategory(category.name)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <Link to={`/produtos?category=${category.name}`} className="flex-1">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-auto">
                      {category.count}
                    </Badge>
                  </Button>
                </Link>
              </div>

              {isExpanded && (
                <div className="ml-9 mt-1 space-y-1">
                  {products
                    .filter((p) => p.category === category.name)
                    .slice(0, 3)
                    .map((product) => (
                      <Link key={product.id} to={`/produto/${product.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-xs h-8"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-6 w-6 rounded object-cover"
                            />
                            <span className="truncate flex-1 text-left">
                              {product.name}
                            </span>
                          </div>
                        </Button>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-4 border-t border-border">
          <Link to="/localizacao">
            <Button
              variant={location.pathname === "/localizacao" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              📍 Perto de Você
            </Button>
          </Link>
        </div>

        <div className="pt-2">
          <Link to="/produtos?filter=promocao">
            <Button variant="ghost" className="w-full justify-start text-secondary">
              🔥 Em Promoção
            </Button>
          </Link>
          <Link to="/produtos?filter=novos">
            <Button variant="ghost" className="w-full justify-start">
              ✨ Novidades
            </Button>
          </Link>
          <Link to="/produtos?filter=sustentavel">
            <Button variant="ghost" className="w-full justify-start">
              🌿 Sustentável
            </Button>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
