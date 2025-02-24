
import React from "react";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AuthFormData } from "./types";

interface RegisterFieldsProps {
  register: UseFormRegister<AuthFormData>;
  errors: FieldErrors<AuthFormData>;
  watch: UseFormWatch<AuthFormData>;
}

export const RegisterFields: React.FC<RegisterFieldsProps> = ({
  register,
  errors,
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
          <span className="text-sm text-red-500">{errors.fullName.message}</span>
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
          <span className="text-sm text-red-500">{errors.phone.message}</span>
        )}
      </div>
    </>
  );
};
