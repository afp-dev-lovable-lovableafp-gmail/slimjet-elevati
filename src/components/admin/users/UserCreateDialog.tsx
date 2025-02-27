
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile, NewUserData } from "@/hooks/users/useUsers";

interface UserCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: NewUserData) => Promise<void>;
}

export const UserCreateDialog = ({ isOpen, onClose, onSubmit }: UserCreateDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewUserData>({
    full_name: "",
    company_name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      company_name: "",
      phone: "",
      email: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Usuário</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar um novo usuário.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Nome completo *</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Nome e sobrenome"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemplo@dominio.com.br"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company_name">Empresa</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name || ""}
                onChange={handleChange}
                placeholder="Nome da empresa"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
