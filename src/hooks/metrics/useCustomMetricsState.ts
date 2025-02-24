
import { useState } from "react";
import type { CustomMetric } from "@/types/analytics";

export const useCustomMetricsState = () => {
  const [selectedMetric, setSelectedMetric] = useState<CustomMetric | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openForm = (metric?: CustomMetric) => {
    if (metric) {
      setSelectedMetric(metric);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedMetric(null);
  };

  const openDeleteDialog = (metric: CustomMetric) => {
    setSelectedMetric(metric);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedMetric(null);
  };

  return {
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
  };
};
