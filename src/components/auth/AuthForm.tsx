
import { useAuthFormLogic } from "./useAuthFormLogic";
import { AuthFormWrapper } from "./AuthFormWrapper";
import { LoginFields } from "./LoginFields";
import { RegisterFields } from "./RegisterFields";
import { FormButtons } from "./FormButtons";
import type { AuthFormProps } from "./types";

const AuthForm = ({ isAdmin }: AuthFormProps) => {
  const {
    isRegistering,
    setIsRegistering,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watch,
    onSubmit
  } = useAuthFormLogic(isAdmin);

  return (
    <AuthFormWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <LoginFields
          register={register}
          errors={errors}
          isRegistering={isRegistering}
        />
        
        {isRegistering && (
          <RegisterFields
            register={register}
            errors={errors}
            watch={watch}
          />
        )}

        <FormButtons
          isSubmitting={isSubmitting}
          isRegistering={isRegistering}
          isAdmin={isAdmin}
          onToggleMode={() => setIsRegistering(!isRegistering)}
        />
      </form>
    </AuthFormWrapper>
  );
};

export default AuthForm;
