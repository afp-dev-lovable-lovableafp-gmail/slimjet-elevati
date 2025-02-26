
export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  variables?: { name: string; type: string; description?: string }[];
  is_active: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDocumentTemplateDTO {
  name: string;
  description?: string;
  content: string;
  variables?: { name: string; type: string; description?: string }[];
}
