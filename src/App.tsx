import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { FollowedStoresProvider } from "@/contexts/FollowedStoresContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderStatus from "./pages/OrderStatus";
import Location from "./pages/Location";
import ClientDashboard from "./pages/ClientDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import Blog from "./pages/Blog";
import Events from "./pages/Events";
import Artisans from "./pages/Artisans";
import StorePage from "./pages/StorePage";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationsProvider>
        <FollowedStoresProvider>
          <CartProvider>
            <FavoritesProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/produtos" element={<Products />} />
                  <Route path="/produto/:id" element={<ProductDetail />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/carrinho" element={<Cart />} />
                  <Route path="/finalizar" element={<Checkout />} />
                  <Route path="/pedido/:orderId" element={<OrderStatus />} />
                  <Route path="/mensagens" element={<Messages />} />
                  <Route path="/artesaos" element={<Artisans />} />
                  <Route path="/loja/:id" element={<StorePage />} />
                  <Route path="/localizacao" element={<Location />} />
                  <Route path="/cliente" element={<ClientDashboard />} />
                  <Route path="/vendedor" element={<SellerDashboard />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/eventos" element={<Events />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </FavoritesProvider>
          </CartProvider>
        </FollowedStoresProvider>
      </NotificationsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
