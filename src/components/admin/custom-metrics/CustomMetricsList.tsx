
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
import { CustomMetricsForm } from "./CustomMetricsForm";
import { useCustomMetrics } from "@/hooks/useCustomMetrics";
import type { CustomMetric } from "@/types/custom-metric";
import { Edit, Trash, BarChart } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CustomMetricsList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingMetric, setEditingMetric] = useState<CustomMetric | null>(null);
  const { metrics, isLoading, createMetric, updateMetric, deleteMetric } = useCustomMetrics();

  const handleEdit = (metric: CustomMetric) => {
    setEditingMetric(metric);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta métrica?")) {
      await deleteMetric.mutateAsync(id);
    }
  };

  const handleFormSubmit = async (data: CustomMetric | Omit<CustomMetric, "id">) => {
    if ("id" in data) {
      await updateMetric.mutateAsync(data as CustomMetric);
    } else {
      await createMetric.mutateAsync(data);
    }
    setShowForm(false);
    setEditingMetric(null);
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
        <h2 className="text-2xl font-bold">Métricas Personalizadas</h2>
        <Button onClick={() => {
          setEditingMetric(null);
          setShowForm(!showForm);
        }}>
          {showForm ? "Cancelar" : "Nova Métrica"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow">
          <CustomMetricsForm
            initialData={editingMetric}
            onSubmit={handleFormSubmit}
            isLoading={createMetric.isPending || updateMetric.isPending}
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Método de Cálculo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[150px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                Nenhuma métrica personalizada encontrada
              </TableCell>
            </TableRow>
          ) : (
            metrics?.map((metric: CustomMetric) => (
              <TableRow key={metric.id}>
                <TableCell>{metric.name}</TableCell>
                <TableCell>{metric.metric_type}</TableCell>
                <TableCell>{metric.calculation_method}</TableCell>
                <TableCell>
                  <Badge variant={metric.is_active ? "default" : "secondary"}>
                    {metric.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(metric)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(metric.id)}
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
