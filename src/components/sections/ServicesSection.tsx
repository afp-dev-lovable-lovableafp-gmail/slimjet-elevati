
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ServicesSection = () => {
  const { data: services, isLoading } = useServices();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Carregando serviços...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Soluções completas em tecnologia para impulsionar seu negócio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="space-y-1 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Disponível
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{service.name}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {service.service_tags?.map((st) => (
                        <Badge key={st.tag.id} variant="outline">
                          {st.tag.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-4 border-t">
                      <Button 
                        className="w-full group" 
                        variant="default"
                        onClick={() => navigate("/auth")}
                      >
                        Solicitar Proposta
                        <Zap className="w-4 h-4 ml-2 transition-transform group-hover:rotate-12" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
