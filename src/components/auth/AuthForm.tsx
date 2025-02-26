
import { useState } from "react";
import { AuthFormWrapper } from "./AuthFormWrapper";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import type { AuthFormProps } from "./types";

const AuthForm = ({ isAdmin, hideRegister }: AuthFormProps) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleToggleMode = () => {
    if (!hideRegister) {
      setIsRegistering(!isRegistering);
    }
  };

  return (
    <AuthFormWrapper>
      {isRegistering && !hideRegister ? (
        <RegisterForm 
          onToggleMode={handleToggleMode} 
          hideToggle={hideRegister}
        />
      ) : (
        <LoginForm 
          onToggleMode={handleToggleMode} 
          hideToggle={hideRegister}
        />
      )}
    </AuthFormWrapper>
  );
};

export default AuthForm;
