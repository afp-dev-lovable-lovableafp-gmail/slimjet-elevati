
import { useCallback } from "react";
import { useCustomMetricsQuery } from "./metrics/useCustomMetricsQuery";
import { useCustomMetricActions } from "./metrics/useCustomMetricActions";
import { useCustomMetricsState } from "./metrics/useCustomMetricsState";
import { mapToCustomMetric, mapToDbMetric } from "@/utils/metrics/metricMappers";
import type { CustomMetric } from "@/types/analytics";

export const useCustomMetrics = () => {
  const { data: dbMetrics, isLoading, error } = useCustomMetricsQuery();
  const { createMetric, updateMetric, deleteMetric } = useCustomMetricActions();
  const {
    selectedMetric,
    setSelectedMetric,
    isFormOpen,
    setIsFormOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    openForm,
    closeForm,
    openDeleteDialog,
    closeDeleteDialog
  } = useCustomMetricsState();

  const metrics = dbMetrics?.map(mapToCustomMetric) ?? [];

  const handleCreate = useCallback(async (data: Omit<CustomMetric, 'id'>) => {
    const dbMetric = mapToDbMetric(data);
    await createMetric.mutateAsync(dbMetric);
    closeForm();
  }, [createMetric, closeForm]);

  const handleUpdate = useCallback(async (data: CustomMetric) => {
    const dbMetric = {
      ...mapToDbMetric(data),
      id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    await updateMetric.mutateAsync(dbMetric);
    closeForm();
  }, [updateMetric, closeForm]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteMetric.mutateAsync(id);
    closeDeleteDialog();
  }, [deleteMetric, closeDeleteDialog]);

  return {
    metrics,
    isLoading,
    error,
    selectedMetric,
    setSelectedMetric,
    isFormOpen,
    setIsFormOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    createMetric: handleCreate,
    updateMetric: handleUpdate,
    deleteMetric: handleDelete,
    openForm,
    closeForm,
    openDeleteDialog,
    closeDeleteDialog
  };
};
