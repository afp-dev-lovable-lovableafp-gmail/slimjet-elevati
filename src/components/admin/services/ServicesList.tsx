
import { Database, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Service } from "@/types/service";
import { ServiceListItem } from "./ServiceListItem";

interface ServicesListProps {
  services: any; // Usando any temporariamente para acomodar as tags
  isLoading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export const ServicesList = ({
  services,
  isLoading,
  onEdit,
  onDelete,
}: ServicesListProps) => {
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
          {services?.map((service: Service) => (
            <ServiceListItem
              key={service.id}
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {!services?.length && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhum serviço encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
