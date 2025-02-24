
import { supabase } from "@/lib/supabase";

export const updateTeamMemberSpecialties = async (
  memberId: string,
  specialties: string[]
) => {
  // Limpar especialidades existentes
  await supabase
    .from('team_member_specialties')
    .delete()
    .eq('team_member_id', memberId);

  if (specialties.length > 0) {
    const specialtiesData = specialties.map(specialtyId => ({
      team_member_id: memberId,
      specialty_id: specialtyId,
    }));

    const { error } = await supabase
      .from('team_member_specialties')
      .insert(specialtiesData);

    if (error) throw error;
  }
};
