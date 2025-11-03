import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Featured Products Section */}
        <section className="container px-4 md:px-6 py-16">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Produtos em Destaque</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Peças selecionadas especialmente para você. Arte autêntica feita à mão.
            </p>
          </div>
          
          <div className="gallery-grid animate-fade-in-up">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/produtos">
              <Button size="lg" variant="outline">
                Ver Todos os Produtos
              </Button>
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-muted/30 py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore por Categoria</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Descubra diferentes estilos e técnicas artesanais
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {["Cerâmica", "Decoração", "Joias", "Crochê", "Pintura", "Papelaria"].map((category) => (
                <Link
                  key={category}
                  to={`/categorias?cat=${category.toLowerCase()}`}
                  className="artisan-card p-6 text-center"
                >
                  <h3 className="font-semibold text-lg">{category}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 md:px-6 py-16">
          <div className="bg-accent text-accent-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              É Artesão? Venda Suas Criações!
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Junte-se à nossa comunidade de artistas e compartilhe suas obras com milhares de apreciadores.
            </p>
            <Link to="/vendedor">
              <Button size="lg" variant="secondary">
                Criar Minha Loja
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
