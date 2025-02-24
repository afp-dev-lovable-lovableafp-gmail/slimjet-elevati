
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Specialty } from "@/hooks/useSpecialties";

interface SpecialtyFormProps {
  specialty?: Specialty | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SpecialtyForm = ({ specialty, onClose, onSuccess }: SpecialtyFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(specialty?.status || "active");
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: specialty || {
      name: "",
      description: "",
      status: "active",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const formData = { ...data, status };

      if (specialty?.id) {
        const { error } = await supabase
          .from('specialties')
          .update(formData)
          .eq('id', specialty.id);
        
        if (error) throw error;
        toast.success("Especialidade atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from('specialties')
          .insert([formData]);
        
        if (error) throw error;
        toast.success("Especialidade criada com sucesso!");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error("Erro ao salvar especialidade: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome</label>
        <Input
          {...register("name", { required: true })}
          placeholder="Nome da especialidade"
        />
        {errors.name && (
          <span className="text-xs text-red-500">Campo obrigatório</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição</label>
        <Textarea
          {...register("description")}
          placeholder="Descrição da especialidade"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select 
          value={status} 
          onValueChange={setStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativa</SelectItem>
            <SelectItem value="inactive">Inativa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : specialty ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
};

export default SpecialtyForm;
