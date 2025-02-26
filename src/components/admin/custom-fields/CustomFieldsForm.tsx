
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomField, CreateCustomFieldDTO, FieldType } from "@/types/custom-field";
import { useEffect, useState } from "react";

interface CustomFieldsFormProps {
  initialData?: CustomField | null;
  onSubmit: (data: CustomField | CreateCustomFieldDTO) => void;
  isLoading: boolean;
}

const fieldTypes: { label: string; value: FieldType }[] = [
  { label: "Texto", value: "text" },
  { label: "Número", value: "number" },
  { label: "Data", value: "date" },
  { label: "Seleção", value: "select" },
  { label: "Múltipla Seleção", value: "multiselect" },
];

const entityTypes = [
  { label: "Serviço", value: "service" },
  { label: "Agendamento", value: "appointment" },
  { label: "Cliente", value: "client" },
];

export const CustomFieldsForm = ({ initialData, onSubmit, isLoading }: CustomFieldsFormProps) => {
  const [showOptions, setShowOptions] = useState(
    initialData?.field_type === "select" || initialData?.field_type === "multiselect"
  );

  const form = useForm<CustomField | CreateCustomFieldDTO>({
    defaultValues: initialData || {
      name: "",
      entity_type: "service",
      field_type: "text",
      is_required: false,
      options: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = form.handleSubmit((data) => {
    if (initialData && 'id' in initialData) {
      onSubmit({ ...data, id: initialData.id });
    } else {
      onSubmit(data);
    }
  });

  // Watch field_type para mostrar ou esconder options
  const fieldType = form.watch("field_type");
  
  useEffect(() => {
    setShowOptions(fieldType === "select" || fieldType === "multiselect");
  }, [fieldType]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Campo</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Observações" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="entity_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Entidade</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de entidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {entityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Define a qual entidade este campo estará associado
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="field_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Campo</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de campo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Campo Obrigatório</FormLabel>
                <FormDescription>
                  Define se este campo deve ser preenchido obrigatoriamente
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : initialData ? "Atualizar Campo" : "Salvar Campo"}
        </Button>
      </form>
    </Form>
  );
};
