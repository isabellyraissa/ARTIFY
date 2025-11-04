import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Sparkles, Home, ShoppingBag, MapPin, Flame, Star, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const categoryNames = Array.from(new Set(products.map((p) => p.category))).sort();
const categories = categoryNames.map((name) => ({
  name,
  count: products.filter((p) => p.category === name).length,
}));

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
    <SidebarUI collapsible="icon">
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <div className="flex-1 group-data-[collapsible=icon]:hidden">
            <h2 className="font-display text-lg font-bold">ARTIFY</h2>
            <p className="text-xs text-muted-foreground">Marketplace Artesanal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    <span>Início</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/produtos"}>
                  <Link to="/produtos">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Produtos</span>
                    <Badge variant="secondary" className="ml-auto group-data-[collapsible=icon]:hidden">
                      {products.length}
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/localizacao"}>
                  <Link to="/localizacao">
                    <MapPin className="h-4 w-4" />
                    <span>Perto de Você</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>Categorias</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => {
                const isExpanded = expandedCategories.includes(category.name);
                const isActive = location.search.includes(`category=${category.name}`);

                return (
                  <SidebarMenuItem key={category.name}>
                    <SidebarMenuButton
                      onClick={() => toggleCategory(category.name)}
                      isActive={isActive}
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="ml-auto group-data-[collapsible=icon]:hidden">
                        {category.count}
                      </Badge>
                    </SidebarMenuButton>
                    {isExpanded && (
                      <SidebarMenuSub>
                        {products
                          .filter((p) => p.category === category.name)
                          .slice(0, 3)
                          .map((product) => (
                            <SidebarMenuSubItem key={product.id}>
                              <SidebarMenuSubButton asChild>
                                <Link to={`/produto/${product.id}`}>
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-5 w-5 rounded object-cover"
                                  />
                                  <span className="truncate">{product.name}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Filters */}
        <SidebarGroup>
          <SidebarGroupLabel>Filtros</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/produtos?filter=promocao">
                    <Flame className="h-4 w-4 text-destructive" />
                    <span>Em Promoção</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/produtos?filter=novos">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Novidades</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/produtos?filter=sustentavel">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <span>Sustentável</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center group-data-[collapsible=icon]:hidden">
          © 2024 ARTIFY
        </p>
      </SidebarFooter>
    </SidebarUI>
  );
};

export default Sidebar;
