
// Este arquivo deve apenas re-exportar de components/ui/use-toast.ts
// para evitar referências circulares

import { useToast, toast } from "@/components/ui/use-toast";

export { useToast, toast };
