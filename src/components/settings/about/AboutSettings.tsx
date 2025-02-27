
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAboutSettings } from "@/hooks/useAboutSettings";
import type { AboutSettingsFormValues } from "@/types/about";

export const AboutSettings = () => {
  const { settings, loading, error, fetchSettings, updateSettings } = useAboutSettings();

  const { register, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm<AboutSettingsFormValues>();

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      reset({
        company_name: settings.company_name || "",
        page_title: settings.page_title || "",
        mission_title: settings.mission_title || "",
        mission_content: settings.mission_content || "",
        vision_title: settings.vision_title || "",
        vision_content: settings.vision_content || "",
        values_title: settings.values_title || "",
        values_content: settings.values_content || "",
        history_title: settings.history_title || "",
        history_content: settings.history_content || "",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: AboutSettingsFormValues) => {
    // Verifica se o conteúdo é um array e converte para string
    const processArrayField = (field: string | string[] | undefined) => {
      if (Array.isArray(field)) {
        return field.join('\n');
      }
      return field;
    };

    // Processa os campos de conteúdo
    const processedData: AboutSettingsFormValues = {
      ...data,
      mission_content: processArrayField(data.mission_content),
      vision_content: processArrayField(data.vision_content),
      values_content: processArrayField(data.values_content),
      history_content: processArrayField(data.history_content),
    };

    await updateSettings(processedData);
  };

  if (loading) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Página "Sobre"</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome da Empresa</label>
              <Input 
                {...register("company_name")} 
                placeholder="Nome da empresa" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Título da Página</label>
              <Input 
                {...register("page_title")} 
                placeholder="Sobre Nós" 
              />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Missão */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Título Missão</label>
                  <Input 
                    {...register("mission_title")} 
                    placeholder="Nossa Missão" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Conteúdo Missão</label>
                  <Textarea 
                    {...register("mission_content")} 
                    placeholder="Descreva a missão da empresa..." 
                    className="min-h-[120px]"
                  />
                </div>
              </div>
              
              {/* Visão */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Título Visão</label>
                  <Input 
                    {...register("vision_title")} 
                    placeholder="Nossa Visão" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Conteúdo Visão</label>
                  <Textarea 
                    {...register("vision_content")} 
                    placeholder="Descreva a visão da empresa..." 
                    className="min-h-[120px]"
                  />
                </div>
              </div>
              
              {/* Valores */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Título Valores</label>
                  <Input 
                    {...register("values_title")} 
                    placeholder="Nossos Valores" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Conteúdo Valores</label>
                  <Textarea 
                    {...register("values_content")} 
                    placeholder="Descreva os valores da empresa..." 
                    className="min-h-[120px]"
                  />
                </div>
              </div>
              
              {/* História */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Título História</label>
                  <Input 
                    {...register("history_title")} 
                    placeholder="Nossa História" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Conteúdo História</label>
                  <Textarea 
                    {...register("history_content")} 
                    placeholder="Conte a história da empresa..." 
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AboutSettings;
