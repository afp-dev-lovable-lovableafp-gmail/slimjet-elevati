
import React, { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useAboutSettings } from "@/hooks/useAboutSettings";

export const AboutSection = () => {
  const { settings, loading, error, fetchSettings } = useAboutSettings();

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Carregando...</h2>
          </div>
        </Container>
      </section>
    );
  }

  if (error || !settings) {
    return (
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Sobre nós</h2>
            <p className="mt-4 text-gray-600">
              Informações não disponíveis no momento. Por favor, tente novamente mais tarde.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  const renderSection = (title: string | null | undefined, content: string | null | undefined) => {
    if (!title || !content) return null;
    
    // Verificamos se o conteúdo é uma string antes de tentar dividi-lo
    const paragraphs = typeof content === 'string' 
      ? content.split('\n').filter(p => p.trim() !== '') 
      : [];
    
    return (
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50" id="about">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">{settings.page_title || "Sobre nós"}</h2>
          <Text variant="muted" className="mt-4 max-w-2xl mx-auto">
            Conheça mais sobre a {settings.company_name || "nossa empresa"} e nossa história.
          </Text>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            {renderSection(settings.mission_title, settings.mission_content)}
            {renderSection(settings.values_title, settings.values_content)}
          </div>
          <div>
            {renderSection(settings.vision_title, settings.vision_content)}
            {renderSection(settings.history_title, settings.history_content)}
          </div>
        </div>

        <Separator className="my-12" />

        <div className="text-center">
          <p className="text-gray-600">
            {settings.company_name || "Nossa empresa"} - Comprometidos com a excelência desde a nossa fundação.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;
