
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import type { CustomMetric } from "@/types/custom-metric";
import { useEffect } from "react";

interface CustomMetricsFormProps {
  initialData?: CustomMetric | null;
  onSubmit: (data: CustomMetric | Omit<CustomMetric, "id">) => void;
  isLoading: boolean;
}

const metricTypes = [
  { label: "Performance", value: "performance" },
  { label: "Financeira", value: "financial" },
  { label: "Cliente", value: "customer" },
  { label: "Operacional", value: "operational" },
];

const calculationMethods = [
  { label: "Soma", value: "sum" },
  { label: "Média", value: "average" },
  { label: "Contagem", value: "count" },
  { label: "Percentual", value: "percentage" },
  { label: "Personalizado", value: "custom" },
];

export const CustomMetricsForm = ({ initialData, onSubmit, isLoading }: CustomMetricsFormProps) => {
  const form = useForm<CustomMetric | Omit<CustomMetric, "id">>({
    defaultValues: initialData || {
      name: "",
      description: "",
      metric_type: "performance",
      calculation_method: "sum",
      is_active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = form.handleSubmit((data) => {
    if (initialData && 'id' in initialData) {
      onSubmit({ ...data, id: initialData.id } as CustomMetric);
    } else {
      onSubmit(data);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Métrica</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Taxa de Conversão" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descreva o propósito desta métrica"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metric_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Métrica</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de métrica" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {metricTypes.map((type) => (
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
          name="calculation_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Cálculo</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método de cálculo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {calculationMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
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
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Status</FormLabel>
                <FormDescription>
                  Ative ou desative esta métrica
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
          {isLoading ? "Salvando..." : initialData ? "Atualizar Métrica" : "Salvar Métrica"}
        </Button>
      </form>
    </Form>
  );
};
