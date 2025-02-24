
export interface Tag {
  id: string;
  name: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceTag {
  id: string;
  service_id: string;
  tag_id: string;
  created_at?: string;
}
