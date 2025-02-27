
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { AboutSettings, AboutSettingsFormValues } from "@/types/about";

export const useAboutSettings = () => {
  const [settings, setSettings] = useState<AboutSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("about_settings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      setSettings(data as unknown as AboutSettings);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching about settings:", error);
      setError(error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (formData: AboutSettingsFormValues) => {
    try {
      setLoading(true);

      if (settings?.id) {
        // Atualizar configurações existentes
        const { error } = await supabase
          .from("about_settings")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settings.id);

        if (error) throw error;
      } else {
        // Criar novas configurações
        const { data, error } = await supabase
          .from("about_settings")
          .insert([
            {
              ...formData,
              created_at: new Date().toISOString(),
            },
          ])
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setSettings(data[0] as unknown as AboutSettings);
        }
      }

      await fetchSettings();
      toast.success("Configurações salvas com sucesso");
    } catch (error: any) {
      console.error("Error updating about settings:", error);
      setError(error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
  };
};
