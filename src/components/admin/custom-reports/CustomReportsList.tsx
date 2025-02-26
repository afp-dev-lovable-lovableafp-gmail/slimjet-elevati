
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
import { CustomReportsForm } from "./CustomReportsForm";
import { useCustomReports } from "@/hooks/useCustomReports";
import type { CustomReport } from "@/types/custom-report";
import { Edit, Trash, Eye } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const CustomReportsList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState<CustomReport | null>(null);
  const [viewingReport, setViewingReport] = useState<CustomReport | null>(null);
  const { reports, isLoading, createReport, updateReport, deleteReport } = useCustomReports();

  const handleEdit = (report: CustomReport) => {
    setEditingReport(report);
    setShowForm(true);
  };

  const handleView = (report: CustomReport) => {
    setViewingReport(report);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este relatório?")) {
      await deleteReport.mutateAsync(id);
    }
  };

  const handleFormSubmit = async (data: CustomReport | Omit<CustomReport, "id">) => {
    if ("id" in data) {
      await updateReport.mutateAsync(data as CustomReport);
    } else {
      await createReport.mutateAsync(data);
    }
    setShowForm(false);
    setEditingReport(null);
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
        <h2 className="text-2xl font-bold">Relatórios Personalizados</h2>
        <Button onClick={() => {
          setEditingReport(null);
          setShowForm(!showForm);
        }}>
          {showForm ? "Cancelar" : "Novo Relatório"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow">
          <CustomReportsForm
            initialData={editingReport}
            onSubmit={handleFormSubmit}
            isLoading={createReport.isPending || updateReport.isPending}
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
          {reports?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                Nenhum relatório encontrado
              </TableCell>
            </TableRow>
          ) : (
            reports?.map((report: CustomReport) => (
              <TableRow key={report.id}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(report)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(report)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
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

      {/* Dialog para visualizar o relatório */}
      <Dialog open={!!viewingReport} onOpenChange={(open) => !open && setViewingReport(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{viewingReport?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <h3 className="font-medium">Descrição:</h3>
            <p className="text-sm text-gray-600 mt-1">{viewingReport?.description}</p>
            
            <h3 className="font-medium mt-4">Configuração:</h3>
            <div className="bg-gray-50 p-3 rounded-md mt-1">
              <p className="text-sm mb-2"><strong>Colunas:</strong> {viewingReport?.report_config.columns.join(", ")}</p>
              
              {viewingReport?.report_config.sortBy && (
                <p className="text-sm mb-2">
                  <strong>Ordenação:</strong> {viewingReport.report_config.sortBy} 
                  ({viewingReport.report_config.sortDirection === "asc" ? "Crescente" : "Decrescente"})
                </p>
              )}
              
              {viewingReport?.report_config.groupBy && viewingReport.report_config.groupBy.length > 0 && (
                <p className="text-sm mb-2">
                  <strong>Agrupamento:</strong> {viewingReport.report_config.groupBy.join(", ")}
                </p>
              )}
              
              {viewingReport?.report_config.filters && viewingReport.report_config.filters.length > 0 && (
                <div className="text-sm">
                  <strong>Filtros:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    {viewingReport.report_config.filters.map((filter, index) => (
                      <li key={index}>
                        {filter.field} {filter.operator} {Array.isArray(filter.value) 
                          ? filter.value.join(" e ") 
                          : filter.value.toString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
