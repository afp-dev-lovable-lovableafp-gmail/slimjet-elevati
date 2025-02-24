import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationLinks = [
  { path: "/", label: "Início" },
  { path: "/servicos", label: "Serviços" },
  { path: "/sobre", label: "Sobre" },
  { path: "/contato", label: "Contato" },
  { path: "/time", label: "Nosso Time" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  const isHome = pathname === "/";
  const textColorClass = (isScrolled || !isHome) 
    ? "text-gray-700 hover:text-primary font-semibold text-base" 
    : "text-white hover:text-gray-300 font-semibold text-base";

  const handleNavigation = (path: string) => {
    setIsOpen(false);

    if (path === "/" && isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  const renderNavigationLinks = (mobile = false) => (
    navigationLinks.map(({ path, label }) => (
      <button
        key={path}
        onClick={() => handleNavigation(path)}
        className={`${mobile ? "block w-full text-left" : ""} ${textColorClass} px-3 py-2 rounded-md font-medium transition-colors hover:scale-105`}
      >
        {label}
      </button>
    ))
  );

  const renderAuthSection = (mobile = false) => (
    user ? (
      mobile ? (
        <>
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="text-gray-700 hover:text-primary block w-full text-left px-3 py-2 rounded-md text-base font-semibold transition-colors hover:scale-105"
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavigation("/perfil")}
            className="text-gray-700 hover:text-primary block w-full text-left px-3 py-2 rounded-md text-base font-semibold transition-colors hover:scale-105"
          >
            Meu Perfil
          </button>
          <button 
            onClick={signOut}
            className="w-full text-left block px-3 py-2 text-base font-semibold text-gray-700 hover:text-primary transition-colors hover:scale-105"
          >
            Sair
          </button>
        </>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/perfil")}>
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    ) : (
      <button 
        onClick={() => handleNavigation("/auth")}
        className={`${mobile ? "w-full text-center" : ""} bg-primary text-white px-6 py-2.5 rounded-md hover:bg-secondary hover:text-[rgb(15,23,42)] transition-all duration-300 transform hover:scale-105 font-semibold text-base`}
      >
        Entrar
      </button>
    )
  );

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            {(isScrolled || !isHome) && (
              <button onClick={() => handleNavigation("/")}>
                <img
                  src="/images/logo.png"
                  alt="ElevaTI Logo"
                  className="h-12 w-auto"
                />
              </button>
            )}
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            {renderNavigationLinks()}
            {renderAuthSection()}
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden inline-flex items-center justify-center p-2 rounded-md ${
              !isScrolled && isHome ? 'text-white' : 'text-gray-700'
            } hover:text-primary hover:bg-gray-100 focus:outline-none`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            {renderNavigationLinks(true)}
            {renderAuthSection(true)}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
