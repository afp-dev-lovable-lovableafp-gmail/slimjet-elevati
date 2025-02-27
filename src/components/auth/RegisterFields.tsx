
import React from "react";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RegisterFieldsProps } from "./types";

export const RegisterFields: React.FC<RegisterFieldsProps> = ({
  register,
  errors,
  watch
}) => {
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
    <>
      <div>
        <Input
          {...register("fullName", { required: "Nome completo é obrigatório" })}
          placeholder="Nome completo"
          type="text"
          autoComplete="name"
        />
        {errors.fullName && (
          <span className="text-sm text-red-500">{errors.fullName.message as string}</span>
        )}
      </div>
      <div>
        <Input
          {...register("phone", { 
            required: "Telefone é obrigatório",
            onChange: (e) => {
              e.target.value = formatPhoneNumber(e.target.value);
            }
          })}
          placeholder="Telefone"
          type="tel"
          autoComplete="tel"
          maxLength={14}
        />
        {errors.phone && (
          <span className="text-sm text-red-500">{errors.phone.message as string}</span>
        )}
      </div>
      <div>
        <Input
          {...register("email", { 
            required: "E-mail é obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "E-mail inválido"
            }
          })}
          placeholder="E-mail"
          type="email"
          autoComplete="email"
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message as string}</span>
        )}
      </div>
      <div>
        <Input
          {...register("password", { 
            required: "Senha é obrigatória",
            minLength: {
              value: 6,
              message: "A senha deve ter no mínimo 6 caracteres"
            }
          })}
          placeholder="Senha"
          type="password"
          autoComplete="new-password"
        />
        {errors.password && (
          <span className="text-sm text-red-500">{errors.password.message as string}</span>
        )}
      </div>
      <div>
        <Input
          {...register("confirmPassword", { 
            required: "Confirme sua senha",
            validate: (value) => 
              value === watch("password") || "As senhas não coincidem"
          })}
          placeholder="Confirmar Senha"
          type="password"
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <span className="text-sm text-red-500">{errors.confirmPassword.message as string}</span>
        )}
      </div>
    </>
  );
};
