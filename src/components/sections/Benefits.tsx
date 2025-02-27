
import { Check, Clock, Sparkles, HeartHandshake } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      title: "Soluções Personalizadas",
      description:
        "Desenvolvemos soluções sob medida para atender às necessidades específicas do seu negócio."
    },
    {
      title: "Eficiência e Agilidade",
      description:
        "Nossos processos são otimizados para entregar resultados rápidos sem comprometer a qualidade."
    },
    {
      title: "Qualidade Garantida",
      description:
        "Trabalhamos com rigorosos padrões de qualidade e testes para garantir a excelência em cada projeto."
    },
    {
      title: "Suporte Dedicado",
      description:
        "Oferecemos suporte contínuo e assistência personalizada em todas as etapas do projeto."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Por que escolher a ElevaTI?
          </h2>
          <p className="text-xl text-gray-600">
            Excelência, inovação e compromisso com resultados são nossos pilares fundamentais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-6">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              {benefits[0].title}
            </h3>
            <p className="text-gray-600 text-center">{benefits[0].description}</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-6">
              <Clock className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              {benefits[1].title}
            </h3>
            <p className="text-gray-600 text-center">{benefits[1].description}</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-6">
              <Check className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              {benefits[2].title}
            </h3>
            <p className="text-gray-600 text-center">{benefits[2].description}</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-6">
              <HeartHandshake className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              {benefits[3].title}
            </h3>
            <p className="text-gray-600 text-center">{benefits[3].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
