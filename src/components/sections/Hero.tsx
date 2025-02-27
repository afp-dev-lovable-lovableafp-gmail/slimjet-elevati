
import React from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { ArrowRight, Calendar, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-24">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8 max-w-lg">
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Consultoria especializada para seu negócio crescer
              </h1>
              <Text variant="muted" className="mt-6 text-lg">
                Ajudamos empresas a alcançarem seu potencial máximo com estratégias 
                personalizadas e direcionadas para resultados concretos.
              </Text>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/schedule">
                  Agendar Consulta <Calendar className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/services">
                  Nossos Serviços <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="pt-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <Text>Equipe especializada com vasta experiência</Text>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <Text>Atendimento personalizado e exclusivo</Text>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <Text>Resultados comprovados por nossos clientes</Text>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative h-[460px] w-[460px]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-400 rounded-3xl rotate-3 opacity-20"></div>
              <div className="absolute inset-0 bg-white rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src="/images/hero-image.jpg" 
                  alt="Consultoria empresarial" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
