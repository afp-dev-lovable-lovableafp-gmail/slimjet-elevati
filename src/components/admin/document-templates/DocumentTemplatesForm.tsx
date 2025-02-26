
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
import type { DocumentTemplate, CreateDocumentTemplateDTO } from "@/types/document-template";
import { useEffect } from "react";

interface DocumentTemplatesFormProps {
  initialData?: DocumentTemplate | null;
  onSubmit: (data: DocumentTemplate | CreateDocumentTemplateDTO) => void;
  isLoading: boolean;
}

export const DocumentTemplatesForm = ({ initialData, onSubmit, isLoading }: DocumentTemplatesFormProps) => {
  const form = useForm<DocumentTemplate | CreateDocumentTemplateDTO>({
    defaultValues: initialData || {
      name: "",
      description: "",
      content: "",
      variables: [],
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
      onSubmit({ ...data, id: initialData.id });
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
              <FormLabel>Nome do Template</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Contrato Padrão" />
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
                <Input {...field} placeholder="Descreva o propósito deste template" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Digite o conteúdo do template aqui..."
                  className="min-h-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : initialData ? "Atualizar Template" : "Salvar Template"}
        </Button>
      </form>
    </Form>
  );
};
