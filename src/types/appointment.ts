
import type { Database } from "@/integrations/supabase/types";

export type AppointmentStatus = Database['public']['Enums']['appointment_status'];

export interface ServiceInfo {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface ClientInfo {
  id: string;
  full_name: string | null;
  company_name: string | null;
}

export interface Appointment {
  id: string;
  user_id: string | null;
  service_id: string | null;
  scheduled_at: string;
  status: AppointmentStatus;
  meeting_url?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  services?: ServiceInfo | null;
  profiles?: ClientInfo | null;
}

export interface CreateAppointmentDTO {
  user_id: string;
  service_id: string;
  scheduled_at: string;
  meeting_url?: string;
  notes?: string;
}

export interface UpdateAppointmentDTO extends Partial<Omit<CreateAppointmentDTO, 'user_id'>> {
  id: string;
  status?: AppointmentStatus;
}

export interface AppointmentFilters {
  status?: AppointmentStatus[];
  startDate?: Date;
  endDate?: Date;
  serviceId?: string;
  userId?: string;
}
