
import { Database, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Service } from "@/types/service";
import type { Tag } from "@/types/tag";
import { ServiceNameCell } from "./table/ServiceNameCell";
import { ServiceDescriptionCell } from "./table/ServiceDescriptionCell";
import { ServiceTagsCell } from "./table/ServiceTagsCell";
import { ServiceOrderCell } from "./table/ServiceOrderCell";
import { ServiceStatusCell } from "./table/ServiceStatusCell";
import { ServiceActionsCell } from "./table/ServiceActionsCell";

interface ServiceWithTags extends Service {
  service_tags?: {
    tag: Tag;
  }[];
}

interface ServicesListProps {
  services: ServiceWithTags[];
  isLoading: boolean;
  error?: Error;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export const ServicesList = ({
  services,
  isLoading,
  error,
  onEdit,
  onDelete,
}: ServicesListProps) => {
  if (error) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center text-red-500">
          <span>Erro: {error.message}</span>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Carregando serviços...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services?.map((service) => (
            <TableRow key={service.id}>
              <ServiceNameCell service={service} />
              <ServiceDescriptionCell service={service} />
              <ServiceTagsCell service={service} />
              <ServiceOrderCell service={service} />
              <ServiceStatusCell service={service} />
              <ServiceActionsCell 
                service={service}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </TableRow>
          ))}
          {!services?.length && (
            <TableRow>
              <td colSpan={6} className="text-center">
                Nenhum serviço encontrado
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
