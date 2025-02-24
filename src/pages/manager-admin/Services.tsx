
import { useState } from "react";
import { Helmet } from "react-helmet";
import { BackButton } from "@/components/ui/back-button";
import { useServices } from "@/hooks/useServices";
import { useServiceOperations } from "@/hooks/useServiceOperations";
import { ServicesList } from "@/components/admin/services/ServicesList";
import { ServicesHeader } from "@/components/admin/services/ServicesHeader";
import { ServiceFormDialog } from "@/components/admin/services/ServiceFormDialog";
import { ManageTagsDialog } from "@/components/admin/services/ManageTagsDialog";
import { DeleteServiceDialog } from "@/components/admin/services/DeleteServiceDialog";
import { DeleteTagDialog } from "@/components/admin/services/DeleteTagDialog";
import { useTags } from "@/hooks/useTags";
import type { Service } from "@/types/service";
import TagForm from "@/components/admin/TagForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Services = () => {
  const { data: services, isLoading, refetch } = useServices();
  const {
    isDialogOpen,
    setIsDialogOpen,
    selectedService,
    setSelectedService,
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
  } = useServiceOperations(refetch);

  const {
    tags,
    isLoading: isLoadingTags,
    selectedTag,
    setSelectedTag,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    toggleStatus,
    deleteTag,
    refetch: refetchTags
  } = useTags();

  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isTagFormOpen, setIsTagFormOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>ElevaTI - Gestão de Serviços</title>
        <meta 
          name="description" 
          content="Gerenciamento de serviços da ElevaTI" 
        />
      </Helmet>

      <BackButton />

      <ServicesHeader
        onNewService={() => {
          setSelectedService(null);
          setIsDialogOpen(true);
        }}
        onManageTags={() => setIsTagDialogOpen(true)}
      />

      <ServicesList
        services={services}
        isLoading={isLoading}
        onEdit={(service) => {
          setSelectedService(service);
          setIsDialogOpen(true);
        }}
        onDelete={(service) => {
          setSelectedService(service);
          setShowDeleteDialog(true);
        }}
      />

      <ServiceFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={selectedService}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedService(null);
        }}
        onSuccess={refetch}
      />

      <DeleteServiceDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />

      <ManageTagsDialog
        open={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
        tags={tags}
        isLoading={isLoadingTags}
        onNewTag={() => {
          setSelectedTag(null);
          setIsTagFormOpen(true);
        }}
        onEditTag={(tag) => {
          setSelectedTag(tag);
          setIsTagFormOpen(true);
        }}
        onDeleteTag={(tag) => {
          setSelectedTag(tag);
          setIsDeleteDialogOpen(true);
        }}
        onToggleStatus={toggleStatus}
      />

      <Dialog open={isTagFormOpen} onOpenChange={setIsTagFormOpen}>
        <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] p-6">
          <DialogHeader>
            <DialogTitle>
              {selectedTag ? "Editar Tag" : "Nova Tag"}
            </DialogTitle>
            <DialogDescription>
              {selectedTag
                ? "Atualize as informações da tag"
                : "Preencha as informações para criar uma nova tag"}
            </DialogDescription>
          </DialogHeader>
          <TagForm
            tag={selectedTag}
            onClose={() => {
              setIsTagFormOpen(false);
              setSelectedTag(null);
            }}
            onSuccess={() => {
              refetchTags();
            }}
          />
        </DialogContent>
      </Dialog>

      <DeleteTagDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={deleteTag}
      />
    </>
  );
};

export default Services;
