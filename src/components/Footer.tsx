import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">ARTIFY</h3>
            <p className="text-sm text-muted-foreground">
              Conectando artesãos e apreciadores de arte autoral. Cada peça é única, cada história é especial.
            </p>
            <div className="flex space-x-2">
              <Button size="icon" variant="ghost">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-muted-foreground hover:text-primary transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-muted-foreground hover:text-primary transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/localizacao" className="text-muted-foreground hover:text-primary transition-colors">
                  Localização
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/cliente" className="text-muted-foreground hover:text-primary transition-colors">
                  Painel do Cliente
                </Link>
              </li>
              <li>
                <Link to="/vendedor" className="text-muted-foreground hover:text-primary transition-colors">
                  Painel do Vendedor
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Login / Cadastro
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Ajuda
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Receba novidades e promoções exclusivas
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Seu e-mail"
                className="bg-background"
              />
              <Button>Enviar</Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 ARTIFY. Todos os direitos reservados. Feito com amor para artesãos.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
