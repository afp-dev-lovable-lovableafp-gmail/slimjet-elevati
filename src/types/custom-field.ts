
export type FieldType = 'text' | 'number' | 'date' | 'select' | 'multiselect';

export interface CustomField {
  id: string;
  name: string;
  entity_type: string;
  field_type: FieldType;
  is_required: boolean;
  is_active: boolean;
  options?: { label: string; value: string }[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateCustomFieldDTO {
  name: string;
  entity_type: string;
  field_type: FieldType;
  is_required?: boolean;
  options?: { label: string; value: string }[];
}
