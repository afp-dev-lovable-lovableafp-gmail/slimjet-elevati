
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Client } from "@/types/auth";

export interface UserProfile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at?: string;
}

export interface NewUserData {
  full_name: string;
  company_name?: string | null;
  phone: string;
  email: string;
}

export function useUsers() {
  const [users, setUsers] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (user: UserProfile) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("clients")
        .update({
          full_name: user.full_name,
          company_name: user.company_name,
          phone: user.phone,
          email: user.email,
          avatar_url: user.avatar_url
        })
        .eq("id", user.id);

      if (error) throw error;
      await fetchUsers();
      toast.success("Usuário atualizado com sucesso");
    } catch (error: any) {
      console.error("Error updating user:", error);
      setError(error);
      toast.error("Erro ao atualizar usuário");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: NewUserData) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("clients").insert([
        {
          full_name: userData.full_name,
          company_name: userData.company_name,
          phone: userData.phone,
          email: userData.email,
          avatar_url: null
        },
      ]);

      if (error) throw error;
      await fetchUsers();
      toast.success("Usuário criado com sucesso");
    } catch (error: any) {
      console.error("Error creating user:", error);
      setError(error);
      toast.error("Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("clients").delete().eq("id", id);

      if (error) throw error;
      await fetchUsers();
      toast.success("Usuário removido com sucesso");
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setError(error);
      toast.error("Erro ao remover usuário");
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    createUser,
    deleteUser,
  };
}
