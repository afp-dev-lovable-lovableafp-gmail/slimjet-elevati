
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ShieldCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AuthForm from "@/components/auth/AuthForm";

const AdminAuthSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const features = [
    {
      icon: Calendar,
      title: "Gestão de Agendamentos",
      description: "Gerencie facilmente todos os agendamentos dos clientes"
    },
    {
      icon: ShieldCheck,
      title: "Acesso Exclusivo",
      description: "Área restrita para membros autorizados do time"
    },
    {
      icon: Settings,
      title: "Ferramentas Administrativas",
      description: "Acesso a recursos avançados de gestão"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <Button
            variant="ghost"
            className="mb-8"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <img
                  src="/images/logo.png"
                  alt="ElevaTI Logo"
                  className="h-12 mx-auto md:mx-0 mb-6"
                />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Área Administrativa
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Acesso exclusivo para membros do time ElevaTI. Gerencie agendamentos, serviços e configure sua disponibilidade.
                </p>
              </div>

              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="p-6 transition-all hover:shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <feature.icon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <AuthForm isAdmin />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAuthSection;
