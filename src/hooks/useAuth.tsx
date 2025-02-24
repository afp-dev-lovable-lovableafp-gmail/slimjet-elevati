
import { useAuthState } from "./auth/useAuthState";
import { useAuthActions } from "./auth/useAuthActions";
import { useAuthSession } from "./auth/useAuthSession";

export const useAuth = () => {
  useAuthSession(); // Setup auth listener
  const authState = useAuthState();
  const authActions = useAuthActions();

  return {
    ...authState,
    ...authActions
  };
};
