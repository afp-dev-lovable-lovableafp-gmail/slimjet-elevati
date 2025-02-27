
import { useEffect, useState } from "react";
import { useUsers, type UserProfile, type NewUserData } from "@/hooks/users/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCreateDialog } from "@/components/admin/users/UserCreateDialog";
import { UserEditDialog } from "@/components/admin/users/UserEditDialog";
import { UserDeleteDialog } from "@/components/admin/users/UserDeleteDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

// Adicionamos a interface para o UserCreateDialog para evitar problemas de tipo
interface UserCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: NewUserData) => Promise<void>;
}

// Adicionamos a interface para o UserEditDialog para evitar problemas de tipo
interface UserEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSubmit: (user: UserProfile) => Promise<void>;
}

// Adicionamos a interface para o UserDeleteDialog para evitar problemas de tipo
interface UserDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onConfirm: () => Promise<void>;
}

const Users = () => {
  const { users, loading, fetchUsers, updateUser, createUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user: any) => {
    // Convert Client to UserProfile
    const userProfile: UserProfile = {
      id: user.id,
      full_name: user.full_name || "",
      company_name: user.company_name,
      phone: user.phone || "",
      email: user.email || "",
      avatar_url: user.avatar_url,
      created_at: user.created_at || new Date().toISOString(),
      updated_at: user.updated_at
    };
    setSelectedUser(userProfile);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: any) => {
    // Convert Client to UserProfile
    const userProfile: UserProfile = {
      id: user.id,
      full_name: user.full_name || "",
      company_name: user.company_name,
      phone: user.phone || "",
      email: user.email || "",
      avatar_url: user.avatar_url,
      created_at: user.created_at || new Date().toISOString(),
      updated_at: user.updated_at
    };
    setSelectedUser(userProfile);
    setDeleteDialogOpen(true);
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    await updateUser(updatedUser as any);
    setEditDialogOpen(false);
  };

  const handleCreateUser = async (user: NewUserData) => {
    await createUser({
      ...user,
      email: user.email || ""  // Garantir que o email nunca seja undefined
    });
    setCreateDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Usuários</CardTitle>
          <Button onClick={() => setCreateDialogOpen(true)}>Adicionar Usuário</Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar usuários..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt={user.full_name || ""} />
                          ) : null}
                          <AvatarFallback>
                            {user.full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || "UN"}
                          </AvatarFallback>
                        </Avatar>
                        {user.full_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.company_name || "-"}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Atualizamos os diálogos para usar isOpen e onClose */}
      <UserCreateDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateUser}
      />

      {selectedUser && (
        <>
          <UserEditDialog
            isOpen={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            user={selectedUser}
            onSubmit={handleUpdateUser}
          />
          <UserDeleteDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            user={selectedUser}
            onConfirm={handleDeleteUser}
          />
        </>
      )}
    </div>
  );
};

export default Users;
