
export interface TeamMemberSpecialty {
  id: string;
  team_member_id: string;
  specialty_id: string;
  specialties: {
    id: string;
    name: string;
  };
}

export interface TeamMember {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  position: string;
  description?: string;
  photo_url?: string;
  linkedin_url?: string;
  status: 'active' | 'inactive';
  is_admin: boolean;
  team_member_specialties: TeamMemberSpecialty[];
}
