
import { Button } from "@/components/ui/button";
import { LoginFields } from "@/components/auth/LoginFields";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Definindo o schema específico para o LoginForm
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  onToggleMode: () => void;
  hideToggle?: boolean;
}

export const LoginForm = ({ 
  onSubmit, 
  isLoading, 
  onToggleMode, 
  hideToggle = false 
}: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <LoginFields 
        register={register} 
        errors={errors} 
        isRegistering={false}
      />
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
      
      {!hideToggle && (
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={onToggleMode}
              type="button"
            >
              Cadastre-se
            </Button>
          </p>
        </div>
      )}
    </form>
  );
};
