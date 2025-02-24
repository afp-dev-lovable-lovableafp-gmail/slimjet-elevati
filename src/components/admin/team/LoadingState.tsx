
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export const LoadingState = () => {
  return (
    <Card className="p-8">
      <div className="flex items-center justify-center">
        <Users className="mr-2 h-5 w-5 animate-pulse" />
        <span>Carregando membros...</span>
      </div>
    </Card>
  );
};
