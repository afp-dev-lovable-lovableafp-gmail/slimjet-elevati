
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAboutSettings } from "@/hooks/useAboutSettings";
import { Loader2 } from "lucide-react";

const AboutSettings = () => {
  const { settings, isLoading, updateSettings } = useAboutSettings();
  const [values, setValues] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!settings) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const valuesList = values
        .split("\n")
        .map(v => v.trim())
        .filter(v => v);

      await updateSettings.mutateAsync({
        ...formData,
        values_content: valuesList
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleValuesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues(e.target.value);
  };

  // Initialize form with current values
  const formData = {
    company_name: settings.company_name,
    page_title: settings.page_title,
    history_title: settings.history_title,
    history_content: settings.history_content,
    mission_title: settings.mission_title,
    mission_content: settings.mission_content,
    values_title: settings.values_title
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Página Sobre</CardTitle>
        <CardDescription>
          Gerencie os textos e informações exibidos na página Sobre
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da Empresa</Label>
              <Input
                id="company_name"
                defaultValue={settings.company_name}
                onChange={(e) => formData.company_name = e.target.value}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page_title">Título da Página</Label>
              <Input
                id="page_title"
                defaultValue={settings.page_title}
                onChange={(e) => formData.page_title = e.target.value}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="history_title">Título da História</Label>
              <Input
                id="history_title"
                defaultValue={settings.history_title}
                onChange={(e) => formData.history_title = e.target.value}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="history_content">Conteúdo da História</Label>
              <Textarea
                id="history_content"
                rows={5}
                defaultValue={settings.history_content}
                onChange={(e) => formData.history_content = e.target.value}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mission_title">Título da Missão</Label>
              <Input
                id="mission_title"
                defaultValue={settings.mission_title}
                onChange={(e) => formData.mission_title = e.target.value}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mission_content">Conteúdo da Missão</Label>
              <Textarea
                id="mission_content"
                rows={3}
                defaultValue={settings.mission_content}
                onChange={(e) => formData.mission_content = e.target.value}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="values_title">Título dos Valores</Label>
              <Input
                id="values_title"
                defaultValue={settings.values_title}
                onChange={(e) => formData.values_title = e.target.value}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="values">Valores (um por linha)</Label>
              <Textarea
                id="values"
                rows={5}
                defaultValue={settings.values_content.join("\n")}
                onChange={handleValuesChange}
                placeholder="Digite um valor por linha"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AboutSettings;
