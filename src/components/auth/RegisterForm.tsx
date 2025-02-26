
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFields } from "./RegisterFields";
import { FormButtons } from "./FormButtons";
import { authSchema, type AuthFormData } from "@/validations/schemas";
import { useAuth } from "@/hooks/useAuth";
import { logger } from "@/features/logging/logger";

interface RegisterFormProps {
  onToggleMode: () => void;
  hideToggle?: boolean;
}

export const RegisterForm = ({ onToggleMode, hideToggle }: RegisterFormProps) => {
  const { signUp } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (data.email && data.password && data.fullName && data.phone) {
        await signUp(data.email, data.password, data.fullName, data.phone);
        logger.info("auth", "Registro realizado com sucesso", { email: data.email });
      }
    } catch (error) {
      logger.error("auth", "Erro no registro", { error });
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <RegisterFields 
        register={register} 
        errors={errors} 
        watch={watch}
      />
      <FormButtons
        isSubmitting={isSubmitting}
        isRegistering={true}
        onToggleMode={onToggleMode}
        hideToggle={hideToggle}
      />
    </form>
  );
};
