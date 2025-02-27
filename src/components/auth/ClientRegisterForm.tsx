
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// Schema para validação do formulário
const registerSchema = z
  .object({
    fullName: z.string().min(3, "Nome completo deve ter pelo menos 3 caracteres"),
    email: z.string().email("Digite um e-mail válido"),
    phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface ClientRegisterFormProps {
  onToggleMode: () => void;
}

export const ClientRegisterForm = ({ onToggleMode }: ClientRegisterFormProps) => {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      await signUp(data.email, data.password, data.fullName, data.phone);
      form.reset();
      onToggleMode(); // Voltar para tela de login após cadastro
    } catch (error) {
      console.error("Erro durante cadastro:", error);
      // O feedback de erro já é tratado pelo hook useAuth
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");
    
    // Aplica a formatação conforme o usuário digita
    let formattedValue = numbers;
    if (numbers.length <= 2) {
      formattedValue = numbers;
    } else if (numbers.length <= 7) {
      formattedValue = `(${numbers.slice(0, 2)})${numbers.slice(2)}`;
    } else {
      formattedValue = `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
    
    return formattedValue;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Seu nome completo" 
                  autoComplete="name"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input 
                  placeholder="seu.email@exemplo.com" 
                  type="email"
                  autoComplete="email"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(99)99999-9999" 
                  type="tel"
                  autoComplete="tel"
                  onChange={(e) => {
                    e.target.value = formatPhoneNumber(e.target.value);
                    onChange(e);
                  }}
                  maxLength={14}
                  {...rest} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input 
                  placeholder="******" 
                  type="password"
                  autoComplete="new-password"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <Input 
                  placeholder="******" 
                  type="password"
                  autoComplete="new-password"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : "Criar conta"}
        </Button>

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
      </form>
    </Form>
  );
};
