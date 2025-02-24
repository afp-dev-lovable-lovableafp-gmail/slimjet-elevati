
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
          const { error: clientError } = await supabase
            .from('clients')
            .insert([
              {
                full_name: data.fullName,
                phone: data.phone,
                email: data.email,
                auth_id: authData.user.id,
                user_type: 'client'
              }
            ]);

          if (clientError) throw clientError;

          reset();
          setIsRegistering(false);
          toast("Cadastro realizado com sucesso!", {
            description: "Você já pode fazer login para continuar."
          });
        }
        return;
      }

      await signIn(data.email!, data.password!);
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user) {
        if (isAdmin) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', sessionData.session.user.id)
            .single();

          if (profileData?.is_admin) {
            navigate("/manager-admin", { replace: true });
          } else {
            toast("Acesso negado", {
              description: "Você não tem permissão para acessar a área administrativa."
            });
          }
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (error: any) {
      console.error("Erro no formulário:", error);
      toast("Erro no cadastro", {
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

