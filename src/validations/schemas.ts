
import { z } from "zod";
import { format } from "date-fns";
import { AppointmentStatus } from "@/types/appointment";

// Auth Schemas
export const authSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  confirmPassword: z.string().optional()
}).refine(data => {
  if (data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export type AuthFormData = z.infer<typeof authSchema>;

// Appointment Schemas
export const appointmentSchema = z.object({
  service_id: z.string().min(1, "Selecione um serviço"),
  scheduled_at: z.string().min(1, "Selecione uma data e horário"),
  notes: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"] as const).optional()
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Service Schemas
export const serviceSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  duration: z.number().min(15, "Duração mínima de 15 minutos"),
  price: z.number().min(0, "O preço não pode ser negativo"),
  is_active: z.boolean().default(true)
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

// Profile Schemas
export const profileSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  company_name: z.string().optional().nullable(),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  avatar_url: z.string().optional().nullable(),
  email: z.string().email("E-mail inválido").optional().nullable()
});

export type ProfileFormData = z.infer<typeof profileSchema>;
