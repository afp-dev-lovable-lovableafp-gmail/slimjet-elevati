
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TagsList } from "./TagsList";
import type { Tag } from "@/types/tag";

interface ManageTagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: Tag[];
  isLoading: boolean;
  onNewTag: () => void;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (tag: Tag) => void;
  onToggleStatus: (tag: Tag) => void;
}

export const ManageTagsDialog = ({
  open,
  onOpenChange,
  tags,
  isLoading,
  onNewTag,
  onEditTag,
  onDeleteTag,
  onToggleStatus,
}: ManageTagsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] w-[calc(100%-2rem)] p-6">
        <DialogHeader>
          <DialogTitle>Gerenciar Tags</DialogTitle>
          <DialogDescription>
            Gerencie as tags disponíveis para os serviços
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(80vh-8rem)] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button 
                onClick={onNewTag}
                className="w-full sm:w-auto"
              >
                Nova Tag
              </Button>
            </div>
            {!isLoading && (
              <div className="overflow-x-auto">
                <TagsList
                  tags={tags}
                  onEdit={onEditTag}
                  onDelete={onDeleteTag}
                  onToggleStatus={onToggleStatus}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
