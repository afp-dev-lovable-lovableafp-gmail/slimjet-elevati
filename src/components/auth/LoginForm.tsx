
import { useAuthFormLogic } from "./useAuthFormLogic";
import { LoginFields } from "./LoginFields";
import { FormButtons } from "./FormButtons";

export const LoginForm = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit
  } = useAuthFormLogic(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <LoginFields
        register={register}
        errors={errors}
        isRegistering={false}
      />
      <FormButtons
        isSubmitting={isSubmitting}
        isRegistering={false}
        onToggleMode={onToggleMode}
      />
    </form>
  );
};
