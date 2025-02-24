
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { AboutSettings, UpdateAboutSettingsDTO } from "@/types/about";
import { useToast } from "@/hooks/use-toast";

export const useAboutSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["about-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data as AboutSettings;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: UpdateAboutSettingsDTO) => {
      const { data, error } = await supabase
        .from("about_settings")
        .update(newSettings)
        .eq("id", settings?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-settings"] });
      toast({
        title: "Configurações atualizadas",
        description: "As alterações foram salvas com sucesso."
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error.message
      });
    }
  });

  return {
    settings,
    isLoading,
    updateSettings
  };
};
