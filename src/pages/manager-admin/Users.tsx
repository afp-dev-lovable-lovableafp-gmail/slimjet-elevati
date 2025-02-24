
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Client {
  id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  created_at: string | null;
}

const Users = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, full_name, company_name, phone, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error: any) {
        console.error('Error fetching clients:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar clientes",
          description: error.message
        });
        return [];
      }
    }
  });

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingClient) return;

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          full_name: editingClient.full_name,
          company_name: editingClient.company_name,
          phone: editingClient.phone
        })
        .eq('id', editingClient.id);

      if (error) throw error;

      toast({
        title: "Cliente atualizado",
        description: "As informações foram atualizadas com sucesso."
      });
      
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cliente",
        description: error.message
      });
    }
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientToDelete.id);

      if (error) throw error;

      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso."
      });
      
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao remover cliente",
        description: error.message
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>ElevaTI - Gestão de Clientes</title>
        <meta 
          name="description" 
          content="Gerenciamento de clientes da ElevaTI" 
        />
      </Helmet>

      <BackButton />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie os clientes cadastrados no sistema
        </p>
      </div>

      {isLoading ? (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <span>Carregando clientes...</span>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clients?.map((client) => (
            <Card key={client.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{client.full_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {client.company_name || 'Empresa não informada'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {client.phone || 'Telefone não informado'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingClient(client);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setClientToDelete(client);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {!clients?.length && (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                Nenhum cliente cadastrado
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize as informações do cliente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Nome completo</Label>
                <Input
                  id="full_name"
                  value={editingClient?.full_name || ''}
                  onChange={(e) => setEditingClient(prev => 
                    prev ? { ...prev, full_name: e.target.value } : prev
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company_name">Empresa</Label>
                <Input
                  id="company_name"
                  value={editingClient?.company_name || ''}
                  onChange={(e) => setEditingClient(prev => 
                    prev ? { ...prev, company_name: e.target.value } : prev
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={editingClient?.phone || ''}
                  onChange={(e) => setEditingClient(prev => 
                    prev ? { ...prev, phone: e.target.value } : prev
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cliente {clientToDelete?.full_name}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Users;
