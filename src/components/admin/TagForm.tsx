
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import type { Tag } from "@/types/tag";

interface TagFormProps {
  tag?: Tag | null;
  onClose: () => void;
  onSuccess: () => void;
}

const TagForm = ({ tag, onClose, onSuccess }: TagFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(tag?.status || "active");
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: tag || {
      name: "",
      status: "active",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const formData = { ...data, status };

      if (tag?.id) {
        const { error } = await supabase
          .from('tags')
          .update(formData)
          .eq('id', tag.id);
        
        if (error) throw error;
        toast.success("Tag atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from('tags')
          .insert([formData]);
        
        if (error) throw error;
        toast.success("Tag criada com sucesso!");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error("Erro ao salvar tag: " + error.message);
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
          placeholder="Nome da tag"
        />
        {errors.name && (
          <span className="text-xs text-red-500">Campo obrigatório</span>
        )}
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
          {isLoading ? "Salvando..." : tag ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
};

export default TagForm;
