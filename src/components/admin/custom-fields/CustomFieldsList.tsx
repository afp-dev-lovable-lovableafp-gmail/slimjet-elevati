
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CustomFieldsForm } from "./CustomFieldsForm";
import { useCustomFields } from "@/hooks/useCustomFields";
import type { CustomField } from "@/types/custom-field";
import { Edit, Trash } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CustomFieldsList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const { fields, isLoading, createField, updateField, deleteField } = useCustomFields();

  const handleEdit = (field: CustomField) => {
    setEditingField(field);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este campo?")) {
      await deleteField.mutateAsync(id);
    }
  };

  const handleFormSubmit = async (data: CustomField | Omit<CustomField, "id">) => {
    if ("id" in data) {
      await updateField.mutateAsync(data as CustomField);
    } else {
      await createField.mutateAsync(data);
    }
    setShowForm(false);
    setEditingField(null);
  };

  const getFieldTypeName = (type: string) => {
    const types: Record<string, string> = {
      text: "Texto",
      number: "Número",
      date: "Data",
      select: "Seleção",
      multiselect: "Múltipla Seleção"
    };
    return types[type] || type;
  };

  const getEntityTypeName = (type: string) => {
    const types: Record<string, string> = {
      service: "Serviço",
      appointment: "Agendamento",
      client: "Cliente"
    };
    return types[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Campos Personalizados</h2>
        <Button onClick={() => {
          setEditingField(null);
          setShowForm(!showForm);
        }}>
          {showForm ? "Cancelar" : "Novo Campo"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow">
          <CustomFieldsForm
            initialData={editingField}
            onSubmit={handleFormSubmit}
            isLoading={createField.isPending || updateField.isPending}
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo de Entidade</TableHead>
            <TableHead>Tipo de Campo</TableHead>
            <TableHead>Obrigatório</TableHead>
            <TableHead className="w-[150px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                Nenhum campo personalizado encontrado
              </TableCell>
            </TableRow>
          ) : (
            fields?.map((field: CustomField) => (
              <TableRow key={field.id}>
                <TableCell>{field.name}</TableCell>
                <TableCell>{getEntityTypeName(field.entity_type)}</TableCell>
                <TableCell>{getFieldTypeName(field.field_type)}</TableCell>
                <TableCell>
                  {field.is_required ? (
                    <Badge variant="default">Sim</Badge>
                  ) : (
                    <Badge variant="outline">Não</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(field)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(field.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
