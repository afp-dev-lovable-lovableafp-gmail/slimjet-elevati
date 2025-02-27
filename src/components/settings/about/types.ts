
export interface AboutFormData {
  company_name: string;
  page_title: string;
  history_title: string;
  history_content: string;
  mission_title: string;
  mission_content: string;
  vision_title: string;
  vision_content: string;
  values_title: string;
}

export interface AboutFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: AboutFormData;
  valuesContent: string;
  isSaving: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleValuesContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
