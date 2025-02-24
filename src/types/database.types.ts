
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          company_name: string | null
          phone: string | null
          is_admin: boolean | null
        }
        Insert: {
          id: string
          created_at?: string | null
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          phone?: string | null
          is_admin?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          phone?: string | null
          is_admin?: boolean | null
        }
      }
      services: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          name: string
          description: string | null
          duration: number
          price: number
          status: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          name: string
          description?: string | null
          duration: number
          price: number
          status?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          name?: string
          description?: string | null
          duration?: number
          price?: number
          status?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          scheduled_at: string
          user_id: string | null
          service_id: string | null
          notes: string | null
          status: string | null
          meeting_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          scheduled_at: string
          user_id?: string | null
          service_id?: string | null
          notes?: string | null
          status?: string | null
          meeting_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          scheduled_at?: string
          user_id?: string | null
          service_id?: string | null
          notes?: string | null
          status?: string | null
          meeting_url?: string | null
        }
      }
      team_members: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          first_name: string
          middle_name: string | null
          last_name: string
          position: string
          description: string | null
          photo_url: string | null
          linkedin_url: string | null
          status: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          first_name: string
          middle_name?: string | null
          last_name: string
          position: string
          description?: string | null
          photo_url?: string | null
          linkedin_url?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          first_name?: string
          middle_name?: string | null
          last_name?: string
          position?: string
          description?: string | null
          photo_url?: string | null
          linkedin_url?: string | null
          status?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
