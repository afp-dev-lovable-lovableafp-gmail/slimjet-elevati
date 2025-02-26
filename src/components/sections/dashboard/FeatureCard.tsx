
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

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
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="flex flex-col h-full">
        <div className="p-2 bg-blue-100 rounded-lg w-fit mb-4">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 mb-6 flex-grow">
          {description}
        </p>
        <Button 
          onClick={onClick}
          className="w-full justify-center"
        >
          {action}
        </Button>
      </div>
    </Card>
  );
};
