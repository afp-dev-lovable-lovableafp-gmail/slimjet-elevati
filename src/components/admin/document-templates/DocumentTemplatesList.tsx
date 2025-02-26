
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
import { DocumentTemplatesForm } from "./DocumentTemplatesForm";
import { useDocumentTemplates } from "@/hooks/useDocumentTemplates";
import type { DocumentTemplate } from "@/types/document-template";
import { Edit, Trash } from "lucide-react";
import { Loader2 } from "lucide-react";

export const DocumentTemplatesList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const { templates, isLoading, createTemplate, updateTemplate, deleteTemplate } = useDocumentTemplates();

  const handleEdit = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este template?")) {
      await deleteTemplate.mutateAsync(id);
    }
  };

  const handleFormSubmit = async (data: DocumentTemplate | Omit<DocumentTemplate, "id">) => {
    if ("id" in data) {
      await updateTemplate.mutateAsync(data as DocumentTemplate);
    } else {
      await createTemplate.mutateAsync(data);
    }
    setShowForm(false);
    setEditingTemplate(null);
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
        <h2 className="text-2xl font-bold">Templates de Documentos</h2>
        <Button onClick={() => {
          setEditingTemplate(null);
          setShowForm(!showForm);
        }}>
          {showForm ? "Cancelar" : "Novo Template"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow">
          <DocumentTemplatesForm
            initialData={editingTemplate}
            onSubmit={handleFormSubmit}
            isLoading={createTemplate.isPending || updateTemplate.isPending}
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="w-[150px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                Nenhum template encontrado
              </TableCell>
            </TableRow>
          ) : (
            templates?.map((template: DocumentTemplate) => (
              <TableRow key={template.id}>
                <TableCell>{template.name}</TableCell>
                <TableCell>{template.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
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
