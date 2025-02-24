
import { useCallback } from "react";
import { useMetricQueries } from "./metrics/useMetricQueries";
import { useMetricMutations } from "./metrics/useMetricMutations";
import { useCustomMetricsState } from "./metrics/useCustomMetricsState";
import type { CustomMetric } from "@/types/analytics";

export const useCustomMetrics = () => {
  const { data: metrics, isLoading, error } = useMetricQueries();
  const { createMetric, updateMetric, deleteMetric } = useMetricMutations();
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

  const handleCreate = useCallback(async (data: Omit<CustomMetric, 'id'>) => {
    await createMetric.mutateAsync(data);
    closeForm();
  }, [createMetric, closeForm]);

  const handleUpdate = useCallback(async (data: CustomMetric) => {
    await updateMetric.mutateAsync(data);
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
