
import React from "react";
import { Input } from "@/components/ui/input";
import { LoginFieldsProps } from "./types";

export const LoginFields: React.FC<LoginFieldsProps> = ({
  register,
  errors,
  isRegistering
}) => {
  return (
    <>
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
          autoComplete="current-password"
        />
        {errors.password && (
          <span className="text-sm text-red-500">{errors.password.message as string}</span>
        )}
      </div>
    </>
  );
};
