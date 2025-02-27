
import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useAuthFormLogic } from "./useAuthFormLogic";
import type { AuthFormProps } from "./types";

export const AuthForm = ({ isAdmin = false }: AuthFormProps) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { 
    isRegistering, 
    setIsRegistering,
    onSubmit: handleSubmit,
    isSubmitting 
  } = useAuthFormLogic(isAdmin);

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    setIsRegistering(!isLoginMode);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLoginMode ? "Login" : "Criar Conta"}
      </h2>

      {isLoginMode ? (
        <LoginForm onSubmit={handleSubmit} isLoading={isSubmitting} onToggleMode={toggleMode} />
      ) : (
        <RegisterForm onSubmit={handleSubmit} isLoading={isSubmitting} onToggleMode={toggleMode} />
      )}

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={toggleMode}
          className="text-primary hover:text-primary/80 text-sm"
        >
          {isLoginMode ? "Não tem uma conta? Registre-se" : "Já tem uma conta? Faça login"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
