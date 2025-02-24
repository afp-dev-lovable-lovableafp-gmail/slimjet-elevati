
import { useState } from "react";
import { AuthFormWrapper } from "./AuthFormWrapper";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import type { AuthFormProps } from "./types";

const AuthForm = ({ isAdmin }: AuthFormProps) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <AuthFormWrapper>
      {isRegistering ? (
        <RegisterForm onToggleMode={handleToggleMode} />
      ) : (
        <LoginForm onToggleMode={handleToggleMode} />
      )}
    </AuthFormWrapper>
  );
};

export default AuthForm;
