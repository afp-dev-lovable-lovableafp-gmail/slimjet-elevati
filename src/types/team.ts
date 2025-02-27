
export interface TeamMember {
  id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  position: string;
  description?: string;
  linkedin_url?: string;
  photo_url?: string;
  status?: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
  team_member_specialties?: TeamMemberSpecialty[];
}

export interface DatabaseTeamMember extends TeamMember {
  auth_id?: string;
  is_admin?: boolean;
}

export interface TeamMemberFormData extends TeamMember {
  specialties: string[];
  photo_file?: File;
}

export interface TeamMemberSpecialty {
  id: string;
  team_member_id: string;
  specialty_id: string;
  specialties: Specialty;
}

export interface Specialty {
  id: string;
  name: string;
}
