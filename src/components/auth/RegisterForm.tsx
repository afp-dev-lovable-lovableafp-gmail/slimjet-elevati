
import { useAuthFormLogic } from "./useAuthFormLogic";
import { LoginFields } from "./LoginFields";
import { RegisterFields } from "./RegisterFields";
import { FormButtons } from "./FormButtons";

export const RegisterForm = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watch,
    onSubmit
  } = useAuthFormLogic(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <LoginFields
        register={register}
        errors={errors}
        isRegistering={true}
      />
      <RegisterFields
        register={register}
        errors={errors}
        watch={watch}
      />
      <FormButtons
        isSubmitting={isSubmitting}
        isRegistering={true}
        onToggleMode={onToggleMode}
      />
    </form>
  );
};
