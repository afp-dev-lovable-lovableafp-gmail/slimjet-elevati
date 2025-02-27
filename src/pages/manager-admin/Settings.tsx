import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { BackButton } from "@/components/ui/back-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { settingSections } from "@/components/settings/settingsSections";
import AboutSettings from "@/components/settings/AboutSettings";

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = (sectionId: string, data: any) => {
    toast({
      title: "Configurações salvas",
      description: `As configurações da seção ${sectionId} foram salvas com sucesso.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>ElevaTI - Configurações</title>
        <meta 
          name="description" 
          content="Configurações do sistema ElevaTI" 
        />
      </Helmet>

      <BackButton />
      
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie todas as configurações do sistema
        </p>
      </div>

      <div className="relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="sticky top-0 z-10 bg-background pt-4 pb-2">
            <TabsList className="w-full h-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {settingSections.map((section) => (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id} 
                  className="text-sm py-2 px-3"
                >
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mt-4">
            {settingSections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {section.id === "about" ? (
                      <AboutSettings />
                    ) : (
                      <div className="grid gap-6">
                        {section.id === "general" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="company-name">Nome da empresa</Label>
                              <Input id="company-name" placeholder="ElevaTI" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contact-email">Email de contato</Label>
                              <Input id="contact-email" type="email" placeholder="contato@elevati.com" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="theme-color">Cor principal</Label>
                              <Input id="theme-color" type="color" className="h-10" />
                            </div>
                          </>
                        )}

                        {section.id === "business" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="business-hours">Horário de funcionamento</Label>
                              <div className="grid grid-cols-2 gap-4">
                                <Input id="opening-time" type="time" />
                                <Input id="closing-time" type="time" />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch id="weekend" />
                              <Label htmlFor="weekend">Atender aos finais de semana</Label>
                            </div>
                          </>
                        )}

                        {section.id === "notifications" && (
                          <>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Switch id="email-notifications" />
                                <Label htmlFor="email-notifications">Notificações por email</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="push-notifications" />
                                <Label htmlFor="push-notifications">Notificações push</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="sms-notifications" />
                                <Label htmlFor="sms-notifications">Notificações por SMS</Label>
                              </div>
                            </div>
                          </>
                        )}

                        {section.id === "emails" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="welcome-email">Template de boas-vindas</Label>
                              <Textarea 
                                id="welcome-email" 
                                placeholder="Olá {nome}, bem-vindo à ElevaTI..."
                                rows={4}
                              />
                            </div>
                          </>
                        )}

                        {section.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <span>{item}</span>
                            <Switch />
                          </div>
                        ))}

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">Cancelar</Button>
                          <Button onClick={() => handleSave(section.id, {})}>
                            Salvar alterações
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
