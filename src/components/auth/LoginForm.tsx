
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFields } from "./LoginFields";
import { FormButtons } from "./FormButtons";
import { authSchema, type AuthFormData } from "@/validations/schemas";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  onToggleMode: () => void;
  hideToggle?: boolean;
}

export const LoginForm = ({ onToggleMode, hideToggle }: LoginFormProps) => {
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  });

  const onSubmit = async (data: AuthFormData) => {
    await signIn(data.email!, data.password!);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <LoginFields 
        register={register} 
        errors={errors} 
        isRegistering={false}
      />
      <FormButtons
        isSubmitting={isSubmitting}
        isRegistering={false}
        onToggleMode={onToggleMode}
        hideToggle={hideToggle}
      />
    </form>
  );
};
