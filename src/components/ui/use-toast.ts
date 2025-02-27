
import { toast as sonnerToast } from "sonner";
import { useCallback, useState } from "react";

// Definindo os tipos para nossas notificações
export type ToastProps = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

// Hook personalizado para gerenciar as notificações
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(
    ({ title, description, variant, ...props }: Omit<ToastProps, "id">) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((toasts) => [...toasts, { id, title, description, variant, ...props }]);
      return id;
    },
    []
  );

  const dismiss = useCallback((toastId?: string) => {
    setToasts((toasts) => 
      toastId 
        ? toasts.filter((t) => t.id !== toastId) 
        : []
    );
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
};

// Exportamos o toast do sonner para uso direto, quando não for necessário o hook completo
export const toast = sonnerToast;
