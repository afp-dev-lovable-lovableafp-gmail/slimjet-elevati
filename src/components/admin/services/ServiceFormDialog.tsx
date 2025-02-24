
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import ServiceForm from "@/components/admin/ServiceForm";
import type { Service } from "@/types/service";

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ServiceFormDialog = ({
  open,
  onOpenChange,
  service,
  onClose,
  onSuccess,
}: ServiceFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[calc(100%-2rem)] p-6">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
          <DialogDescription>
            {service 
              ? "Faça as alterações necessárias no serviço existente."
              : "Preencha os dados para criar um novo serviço."}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(80vh-8rem)] overflow-y-auto">
          <ServiceForm
            service={service}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
