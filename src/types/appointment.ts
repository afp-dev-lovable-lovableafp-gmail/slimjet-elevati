
export interface Appointment {
  id: string;
  user_id: string;
  service_id: string;
  scheduled_at: string;
  status: AppointmentStatus;
  notes?: string | null;
  meeting_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Relacionamentos opcionais
  services?: Service;
  profiles?: ClientInfo | null;
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface ClientInfo {
  id: string;
  full_name: string | null;
  company_name: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

export interface AppointmentFormData {
  user_id: string;
  service_id: string;
  scheduled_at: string;
  notes?: string;
}

export interface AppointmentListItem {
  id: string;
  service: string;
  date: string;
  time: string;
  status: string;
}

// Add missing DTO types
export interface CreateAppointmentDTO {
  user_id: string;
  service_id: string;
  scheduled_at: string;
  notes?: string;
  status?: AppointmentStatus;
}

export interface UpdateAppointmentDTO {
  id: string;
  service_id?: string;
  scheduled_at?: string;
  status?: AppointmentStatus;
  notes?: string;
  meeting_url?: string;
}
