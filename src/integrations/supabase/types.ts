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
      contact_submissions: {
        Row: {
          id: number
          name: string
          email: string
          message: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          message: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          message?: string
          created_at?: string
        }
      }
      fertility_clinics: {
        Row: {
          id: number
          clinic_id: string
          slug: string
          name: string
          url: string | null
          contact_phone: string | null
          contact_email: string | null
          annual_cycles: string | null
          national_avg_annual_cycles: string | null
          clinic_sr_under35: string | null
          national_avg_under35: string | null
          clinic_sr_35to37: string | null
          national_avg_35to37: string | null
          clinic_sr_38to40: string | null
          national_avg_38to40: string | null
          clinic_sr_over40: string | null
          national_avg_over40: string | null
          doctors: Json | null
          branches: Json | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          clinic_id: string
          slug: string
          name: string
          url?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          annual_cycles?: string | null
          national_avg_annual_cycles?: string | null
          clinic_sr_under35?: string | null
          national_avg_under35?: string | null
          clinic_sr_35to37?: string | null
          national_avg_35to37?: string | null
          clinic_sr_38to40?: string | null
          national_avg_38to40?: string | null
          clinic_sr_over40?: string | null
          national_avg_over40?: string | null
          doctors?: Json | null
          branches?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          clinic_id?: string
          slug?: string
          name?: string
          url?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          annual_cycles?: string | null
          national_avg_annual_cycles?: string | null
          clinic_sr_under35?: string | null
          national_avg_under35?: string | null
          clinic_sr_35to37?: string | null
          national_avg_35to37?: string | null
          clinic_sr_38to40?: string | null
          national_avg_38to40?: string | null
          clinic_sr_over40?: string | null
          national_avg_over40?: string | null
          doctors?: Json | null
          branches?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
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
