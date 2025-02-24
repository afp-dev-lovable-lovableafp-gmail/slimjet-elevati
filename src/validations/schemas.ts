
import { z } from "zod";
import type { AppointmentStatus } from "@/types/appointment";

export const appointmentSchema = z.object({
  service_id: z.string().uuid({
    message: "Serviço é obrigatório"
  }),
  user_id: z.string().uuid({
    message: "Usuário é obrigatório"
  }),
  scheduled_at: z.string().datetime({
    message: "Data e hora são obrigatórios"
  }),
  meeting_url: z.string().url({
    message: "URL de reunião inválida"
  }).optional().nullable(),
  notes: z.string().max(500, {
    message: "Notas não podem exceder 500 caracteres"
  }).optional().nullable(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed'] as const, {
    required_error: "Status é obrigatório",
    invalid_type_error: "Status inválido"
  }).default('pending')
});

export const serviceSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres"
  }),
  description: z.string().optional(),
  duration: z.number().min(15, {
    message: "Duração mínima é de 15 minutos"
  }),
  price: z.number().min(0, {
    message: "Preço não pode ser negativo"
  }),
  is_active: z.boolean().default(true),
  display_order: z.number().default(0)
});

export const authSchema = z.object({
  email: z.string().email({
    message: "E-mail inválido"
  }),
  password: z.string().min(6, {
    message: "A senha deve ter no mínimo 6 caracteres"
  }),
  fullName: z.string().min(3, {
    message: "Nome completo deve ter no mínimo 3 caracteres"
  }).optional(),
  phone: z.string().regex(/^\(\d{2}\)\d{5}-\d{4}$/, {
    message: "Telefone deve estar no formato (99)99999-9999"
  }).optional(),
  confirmPassword: z.string().optional()
}).refine((data) => {
  if (data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export const profileSchema = z.object({
  full_name: z.string().min(3, {
    message: "Nome completo deve ter no mínimo 3 caracteres"
  }),
  company_name: z.string().optional().nullable(),
  phone: z.string().regex(/^\(\d{2}\)\d{5}-\d{4}$/, {
    message: "Telefone deve estar no formato (99)99999-9999"
  }),
  avatar_url: z.string().url().optional().nullable()
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type AuthFormData = z.infer<typeof authSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
