
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  created_at: string | null;
  user_type?: string | null;
}

interface UsersListProps {
  users: UserProfile[] | undefined;
  isLoading: boolean;
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
}

export const UsersList = ({ users, isLoading, onEdit, onDelete }: UsersListProps) => {
  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <span>Carregando clientes...</span>
        </div>
      </Card>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Nenhum cliente cadastrado
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <Card key={user.id} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{user.full_name}</h3>
              <p className="text-sm text-muted-foreground">
                {user.company_name || 'Empresa não informada'}
              </p>
              <p className="text-sm text-muted-foreground">
                {user.phone || 'Telefone não informado'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(user)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(user)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
