
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { CustomReport, CreateCustomReportDTO } from "@/types/custom-report";
import { useEffect } from "react";

interface CustomReportsFormProps {
  initialData?: CustomReport | null;
  onSubmit: (data: CreateCustomReportDTO) => void;
  isLoading: boolean;
}

export const CustomReportsForm = ({ initialData, onSubmit, isLoading }: CustomReportsFormProps) => {
  const form = useForm<CreateCustomReportDTO>({
    defaultValues: initialData || {
      name: "",
      description: "",
      report_config: {
        columns: [],
      },
    },
  });

  useEffect(() => {
    if (initialData) {
      // Reset the form with the initialData
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = form.handleSubmit((data) => {
    if (initialData && 'id' in initialData) {
      onSubmit({ ...data, id: initialData.id } as any);
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
              <FormLabel>Nome do Relatório</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Relatório de Vendas Mensal" />
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
                  placeholder="Descreva o propósito deste relatório"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : initialData ? "Atualizar Relatório" : "Salvar Relatório"}
        </Button>
      </form>
    </Form>
  );
};
