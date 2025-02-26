
import { Button } from "@/components/ui/button";
import type { FormButtonsProps } from "./types";

export const FormButtons: React.FC<FormButtonsProps> = ({
  isSubmitting,
  isRegistering,
  onToggleMode,
  hideToggle
}) => {
  return (
    <div className="space-y-4">
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Carregando..." : isRegistering ? "Cadastrar" : "Entrar"}
      </Button>

      {!hideToggle && (
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={onToggleMode}
        >
          {isRegistering
            ? "Já tem uma conta? Entre aqui"
            : "Não tem uma conta? Cadastre-se"}
        </Button>
      )}
    </div>
  );
};
