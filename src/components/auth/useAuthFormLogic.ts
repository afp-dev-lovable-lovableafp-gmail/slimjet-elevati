
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { authSchema, type AuthFormData } from "@/validations/schemas";

export const useAuthFormLogic = (isAdmin?: boolean) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isRegistering) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email!,
          password: data.password!,
          options: {
            data: {
              full_name: data.fullName,
              phone: data.phone
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Criar perfil com user_type='client'
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                full_name: data.fullName,
                phone: data.phone,
                company_name: null,
                user_type: 'client',
                is_admin: false
              }
            ]);

          if (profileError) throw profileError;

          reset();
          setIsRegistering(false);
          toast.success("Cadastro realizado com sucesso!", {
            description: "Você já pode fazer login para continuar."
          });
        }
        return;
      }

      await signIn(data.email!, data.password!);
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user) {
        // O redirecionamento será feito pelos componentes Auth ou AdminAuth
        // baseado no tipo de usuário e permissões
      }
    } catch (error: any) {
      console.error("Erro no formulário:", error);
      toast.error("Erro no formulário", {
        description: error.message || "Verifique suas informações e tente novamente."
      });
    }
  };

  return {
    isRegistering,
    setIsRegistering,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watch,
    onSubmit
  };
};
