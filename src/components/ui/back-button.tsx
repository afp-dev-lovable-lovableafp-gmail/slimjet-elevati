
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "./button";

/**
 * Componente de botão para navegação de volta.
 * Utiliza o hook useNavigate do React Router para retornar à página anterior.
 * 
 * @example
 * ```tsx
 * // Na página de detalhes
 * <BackButton />
 * ```
 */
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
