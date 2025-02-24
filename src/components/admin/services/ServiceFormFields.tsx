
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Service } from "@/types/service";

interface ServiceFormFieldsProps {
  register: UseFormRegister<Service>;
  errors: FieldErrors<Service>;
}

export const ServiceFormFields = ({ register, errors }: ServiceFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Serviço</Label>
        <Input
          id="name"
          {...register("name", { required: "Nome é obrigatório" })}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          {...register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_order">Ordem de exibição</Label>
        <Input
          id="display_order"
          type="number"
          {...register("display_order", {
            required: "Ordem de exibição é obrigatória",
            min: { value: 0, message: "A ordem deve ser maior ou igual a 0" }
          })}
        />
        {errors.display_order && (
          <p className="text-xs text-red-500">{errors.display_order.message}</p>
        )}
      </div>
    </>
  );
};
