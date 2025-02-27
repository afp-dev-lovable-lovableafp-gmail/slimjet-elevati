
import { RegisterFields } from "./RegisterFields";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Definindo o schema específico para o RegisterForm
const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme sua senha"),
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  phone: z.string().min(10, "Telefone é obrigatório")
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  onToggleMode: () => void;
  hideToggle?: boolean;
}

export const RegisterForm = ({ 
  onSubmit, 
  isLoading, 
  onToggleMode, 
  hideToggle = false 
}: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: ""
    }
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <RegisterFields 
        register={register} 
        errors={errors} 
        watch={watch}
      />
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "Cadastrar"
        )}
      </Button>
      
      {!hideToggle && (
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={onToggleMode}
              type="button"
            >
              Faça login
            </Button>
          </p>
        </div>
      )}
    </form>
  );
};
