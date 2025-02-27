
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  action,
  onClick
}: FeatureCardProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Button onClick={onClick} variant="outline" className="w-full">
        {action}
      </Button>
    </Card>
  );
};
