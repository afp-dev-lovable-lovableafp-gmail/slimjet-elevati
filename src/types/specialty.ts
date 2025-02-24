
export interface Specialty {
  id: string;
  name: string;
  description?: string | null;
  status?: 'active' | 'inactive';
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateSpecialtyDTO extends Omit<Specialty, 'id' | 'created_at' | 'updated_at'> {
  name: string;
}

export interface UpdateSpecialtyDTO extends Partial<CreateSpecialtyDTO> {
  id: string;
}
