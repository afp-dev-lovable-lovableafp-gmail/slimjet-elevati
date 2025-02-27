
/**
 * Configurações sobre a empresa
 */
export interface AboutSettings {
  id: string;
  company_name: string;
  page_title: string;
  history_title: string;
  history_content: string;
  mission_title: string;
  mission_content: string;
  vision_title: string;
  vision_content: string;
  values_title?: string;
  values_content?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AboutSettingsFormValues {
  company_name: string;
  page_title: string;
  history_title: string;
  history_content: string;
  mission_title: string;
  mission_content: string;
  vision_title: string;
  vision_content: string;
  values_title: string;
  values_content: string;
}
