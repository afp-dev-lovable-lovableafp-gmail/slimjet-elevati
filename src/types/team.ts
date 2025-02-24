
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
  is_admin?: boolean;
  email?: string;
  password?: string;
  team_member_specialties?: TeamMemberSpecialty[];
  auth_id?: string;
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
