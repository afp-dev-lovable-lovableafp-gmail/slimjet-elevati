
import { FileText, Building, Bell, Mail, Shield, Settings as SettingsIcon } from "lucide-react";

export const settingSections = [
  {
    id: "general",
    title: "Geral",
    description: "Configurações gerais do sistema",
    icon: SettingsIcon,
    items: []
  },
  {
    id: "about",
    title: "Página Sobre",
    description: "Gerenciar conteúdo da página Sobre",
    icon: FileText,
    items: []
  },
  {
    id: "business",
    title: "Negócio",
    description: "Configurações do negócio",
    icon: Building,
    items: []
  },
  {
    id: "notifications",
    title: "Notificações",
    description: "Configurações de notificações",
    icon: Bell,
    items: []
  },
  {
    id: "emails",
    title: "E-mails",
    description: "Templates de e-mail",
    icon: Mail,
    items: []
  },
  {
    id: "security",
    title: "Segurança",
    description: "Configurações de segurança",
    icon: Shield,
    items: []
  }
];
