
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Benefits = () => {
  return (
    <section className="relative py-24 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto pl-8">
          <h3 className="text-teal-600 text-2xl font-semibold mb-4">
            Descubra os Benefícios
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Soluções de TI para o seu sucesso
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-5xl">
            Se você está procurando terceirizar serviços de TI, pode ser difícil determinar qual contratado é o certo para o seu negócio. Na ElevaTI, oferecemos soluções abrangentes de contratação projetadas para ajudar sua empresa a alcançar seus objetivos. Nossa equipe de profissionais experientes está dedicada a encontrar abordagens inovadoras e eficazes que funcionem melhor dentro do seu orçamento, não importa em qual setor você esteja ou quais sejam suas necessidades, grandes ou pequenas. Com dedicação e experiência combinadas, nossos serviços gerenciados oferecem assistência incomparável em tudo, desde a Infraestrutura de TI e soluções de rede, até integração em nuvem e manutenção de sistemas.
          </p>
          <Link to="/sobre">
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-8"
            >
              Saiba Mais
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
