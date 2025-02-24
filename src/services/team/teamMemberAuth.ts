
import { supabase } from "@/lib/supabase";

export const createTeamMemberAuth = async (email: string, password: string, fullName: string) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_type: 'team_member'
      }
    }
  });

  if (authError) throw authError;
  return authData.user?.id;
};
