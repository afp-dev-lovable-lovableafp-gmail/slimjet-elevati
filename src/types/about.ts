
export interface AboutSettings {
  id: string;
  company_name?: string | null;
  page_title?: string | null;
  mission_title?: string | null;
  mission_content?: string | null;
  vision_title?: string | null;
  vision_content?: string | null;
  values_title?: string | null;
  values_content?: string | null;
  history_title?: string | null;
  history_content?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AboutSettingsFormData {
  company_name?: string;
  page_title?: string;
  mission_title?: string;
  mission_content?: string;
  vision_title?: string;
  vision_content?: string;
  values_title?: string;
  values_content?: string;
  history_title?: string;
  history_content?: string;
}
