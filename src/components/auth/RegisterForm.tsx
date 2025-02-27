
import { RegisterFields } from "./RegisterFields";
import { AuthFormData } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/validations/schemas";

interface RegisterFormProps {
  onSubmit: (data: AuthFormData) => Promise<void>;
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
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
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
