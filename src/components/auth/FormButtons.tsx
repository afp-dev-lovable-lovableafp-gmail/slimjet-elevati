
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface FormButtonsProps {
  isSubmitting: boolean;
  isRegistering: boolean;
  isAdmin?: boolean;
  onToggleMode: () => void;
}

export const FormButtons: React.FC<FormButtonsProps> = ({
  isSubmitting,
  isRegistering,
  isAdmin,
  onToggleMode,
}) => {
  return (
    <>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          "Processando..."
        ) : isRegistering ? (
          "Criar conta"
        ) : (
          "Entrar"
        )}
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>

      {!isAdmin && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onToggleMode}
        >
          {isRegistering
            ? "Já tem uma conta? Entre"
            : "Não tem uma conta? Cadastre-se"}
        </Button>
      )}
    </>
  );
};
