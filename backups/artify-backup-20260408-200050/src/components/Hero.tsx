import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Arte e Autenticidade em Cada Peça
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
            Descubra produtos artesanais únicos, feitos à mão por artistas apaixonados. 
            Cada criação conta uma história.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/produtos">
              <Button size="lg" className="w-full sm:w-auto text-base">
                Explorar Produtos
              </Button>
            </Link>
            <Link to="/artesaos">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                Conheça os Artesãos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
