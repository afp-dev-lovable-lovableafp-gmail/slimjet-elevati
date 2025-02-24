
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SettingItem {
  title: string;
}

interface SettingsSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
}

export const SettingsSection = ({
  icon: Icon,
  title,
  description,
  items
}: SettingsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <Card key={index} className="p-4 hover:bg-accent cursor-pointer transition-colors">
              <p className="font-medium">{item}</p>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
