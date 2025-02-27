
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="LogoTipo" className="h-10" />
            <span className="ml-2 text-lg font-bold text-white">ElevaTI</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-primary transition">Início</Link>
            <Link to="/servicos" className="text-white hover:text-primary transition">Serviços</Link>
            <Link to="/#equipe" className="text-white hover:text-primary transition">Equipe</Link>
            <Link to="/#contato" className="text-white hover:text-primary transition">Contato</Link>
          </nav>

          <Link to="/auth">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
              Acessar
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
