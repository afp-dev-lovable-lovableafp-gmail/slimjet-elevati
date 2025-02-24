
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "./button";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="mb-4"
      onClick={() => navigate(-1)}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Voltar
    </Button>
  );
};
