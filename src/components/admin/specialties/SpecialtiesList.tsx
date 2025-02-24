
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { useSpecialties } from "@/hooks/useSpecialties";
import { DeleteSpecialtyDialog } from "./DeleteSpecialtyDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import SpecialtyForm from "../SpecialtyForm";
import { Badge } from "@/components/ui/badge";

export const SpecialtiesList = () => {
  const {
    specialties,
    isLoading,
    selectedSpecialty,
    setSelectedSpecialty,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    toggleStatus,
    deleteSpecialty,
    refetch,
  } = useSpecialties();

  const [isFormOpen, setIsFormOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={() => {
          setSelectedSpecialty(null);
          setIsFormOpen(true);
        }}>
          Nova Especialidade
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specialties.map((specialty) => (
              <TableRow key={specialty.id}>
                <TableCell className="font-medium">{specialty.name}</TableCell>
                <TableCell>{specialty.description || "-"}</TableCell>
                <TableCell>
                  <Badge 
                    variant={specialty.status === "active" ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleStatus(specialty)}
                  >
                    {specialty.status === "active" ? "Ativa" : "Inativa"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedSpecialty(specialty);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedSpecialty(specialty);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSpecialty ? "Editar Especialidade" : "Nova Especialidade"}
            </DialogTitle>
            <DialogDescription>
              {selectedSpecialty
                ? "Atualize as informações da especialidade"
                : "Preencha as informações para criar uma nova especialidade"}
            </DialogDescription>
          </DialogHeader>
          <SpecialtyForm
            specialty={selectedSpecialty}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedSpecialty(null);
            }}
            onSuccess={refetch}
          />
        </DialogContent>
      </Dialog>

      <DeleteSpecialtyDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={deleteSpecialty}
        specialty={selectedSpecialty}
      />
    </div>
  );
};
