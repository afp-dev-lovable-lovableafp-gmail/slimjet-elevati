
import { Database, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Service } from "@/types/service";

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
          <Database className="mr-2 h-5 w-5 animate-pulse" />
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
          {services?.map((service: any) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {service.service_tags?.map((st: any) => (
                    <Badge key={st.tag.id} variant="secondary">
                      {st.tag.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{service.display_order}</TableCell>
              <TableCell>
                <Badge variant={service.is_active ? "default" : "secondary"}>
                  {service.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(service)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(service)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
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
