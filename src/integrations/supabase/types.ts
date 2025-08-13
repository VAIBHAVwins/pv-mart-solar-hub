export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      appliances: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
          wattage: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
          wattage: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
          wattage?: number
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          payload: Json | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          payload?: Json | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          payload?: Json | null
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author: string
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_pinned: boolean | null
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_pinned?: boolean | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_pinned?: boolean | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          pincode: string | null
          state: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_requirements: {
        Row: {
          address: string
          created_at: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          id: string
          installation_type: Database["public"]["Enums"]["installation_type"]
          monthly_bill: number
          pincode: string
          system_type: Database["public"]["Enums"]["system_type"]
        }
        Insert: {
          address: string
          created_at?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          installation_type: Database["public"]["Enums"]["installation_type"]
          monthly_bill: number
          pincode: string
          system_type: Database["public"]["Enums"]["system_type"]
        }
        Update: {
          address?: string
          created_at?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          installation_type?: Database["public"]["Enums"]["installation_type"]
          monthly_bill?: number
          pincode?: string
          system_type?: Database["public"]["Enums"]["system_type"]
        }
        Relationships: [
          {
            foreignKeyName: "customer_requirements_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      electricity_fppca_rates: {
        Row: {
          created_at: string
          id: string
          month: number
          provider_id: string
          rate_per_unit: number
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: number
          provider_id: string
          rate_per_unit: number
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
          provider_id?: string
          rate_per_unit?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "electricity_fppca_rates_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "electricity_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      electricity_provider_config: {
        Row: {
          created_at: string
          duty_percentage: number
          fixed_charge_per_kva: number
          id: string
          lifeline_rate_paise: number
          meter_rent: number
          provider_id: string
          timely_payment_rebate: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          duty_percentage?: number
          fixed_charge_per_kva?: number
          id?: string
          lifeline_rate_paise?: number
          meter_rent?: number
          provider_id: string
          timely_payment_rebate?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          duty_percentage?: number
          fixed_charge_per_kva?: number
          id?: string
          lifeline_rate_paise?: number
          meter_rent?: number
          provider_id?: string
          timely_payment_rebate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "electricity_provider_config_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: true
            referencedRelation: "electricity_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      electricity_providers: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      electricity_slabs: {
        Row: {
          created_at: string
          id: string
          max_unit: number | null
          min_unit: number
          provider_id: string
          rate_paise_per_kwh: number
        }
        Insert: {
          created_at?: string
          id?: string
          max_unit?: number | null
          min_unit: number
          provider_id: string
          rate_paise_per_kwh: number
        }
        Update: {
          created_at?: string
          id?: string
          max_unit?: number | null
          min_unit?: number
          provider_id?: string
          rate_paise_per_kwh?: number
        }
        Relationships: [
          {
            foreignKeyName: "electricity_slabs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "electricity_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      fppca_rates: {
        Row: {
          created_at: string
          id: string
          month: number
          provider_id: string
          rate_per_unit: number
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: number
          provider_id: string
          rate_per_unit: number
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
          provider_id?: string
          rate_per_unit?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "fppca_rates_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      free_units_rules: {
        Row: {
          code: string
          created_at: string
          description: string | null
          effective_from: string
          effective_to: string | null
          free_units: number
          id: string
          is_active: boolean
          provider_id: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          effective_from: string
          effective_to?: string | null
          free_units: number
          id?: string
          is_active?: boolean
          provider_id: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          effective_from?: string
          effective_to?: string | null
          free_units?: number
          id?: string
          is_active?: boolean
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "free_units_rules_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_images: {
        Row: {
          created_at: string | null
          cta_link: string | null
          cta_text: string | null
          description: string | null
          display_duration: number | null
          id: string
          image_url: string
          is_active: boolean | null
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          display_duration?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          display_duration?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mobile_otp_verifications: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          is_used: boolean | null
          otp_code: string
          phone: string
          user_type: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          is_used?: boolean | null
          otp_code: string
          phone: string
          user_type: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          is_used?: boolean | null
          otp_code?: string
          phone?: string
          user_type?: string
        }
        Relationships: []
      }
      otp_verifications: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          is_used: boolean | null
          otp_code: string
          phone: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          is_used?: boolean | null
          otp_code: string
          phone: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          is_used?: boolean | null
          otp_code?: string
          phone?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          code: string
          created_at: string
          fixed_charge_per_kva: number
          government_duty_percent: number | null
          id: string
          is_active: boolean
          lifeline_requires_registration: boolean
          lifeline_threshold_units: number
          meter_rent: number
          name: string
          supports_lifeline: boolean
          supports_timely_rebate: boolean
        }
        Insert: {
          code: string
          created_at?: string
          fixed_charge_per_kva?: number
          government_duty_percent?: number | null
          id?: string
          is_active?: boolean
          lifeline_requires_registration?: boolean
          lifeline_threshold_units?: number
          meter_rent?: number
          name: string
          supports_lifeline?: boolean
          supports_timely_rebate?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          fixed_charge_per_kva?: number
          government_duty_percent?: number | null
          id?: string
          is_active?: boolean
          lifeline_requires_registration?: boolean
          lifeline_threshold_units?: number
          meter_rent?: number
          name?: string
          supports_lifeline?: boolean
          supports_timely_rebate?: boolean
        }
        Relationships: []
      }
      quotation_components: {
        Row: {
          brand: string | null
          component_type: string
          created_at: string | null
          id: string
          included_length_meters: number | null
          model: string | null
          quantity: number
          quotation_id: string | null
          specifications: string | null
          total_price: number
          unit_price: number
          warranty_years: number | null
        }
        Insert: {
          brand?: string | null
          component_type: string
          created_at?: string | null
          id?: string
          included_length_meters?: number | null
          model?: string | null
          quantity: number
          quotation_id?: string | null
          specifications?: string | null
          total_price: number
          unit_price: number
          warranty_years?: number | null
        }
        Update: {
          brand?: string | null
          component_type?: string
          created_at?: string | null
          id?: string
          included_length_meters?: number | null
          model?: string | null
          quantity?: number
          quotation_id?: string | null
          specifications?: string | null
          total_price?: number
          unit_price?: number
          warranty_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_components_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "vendor_quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      rebate_rules: {
        Row: {
          active: boolean
          amount_fixed: number | null
          applies_to: string
          code: string
          created_at: string
          description: string | null
          id: string
          percent: number | null
          provider_id: string
          tariff_version_id: string | null
        }
        Insert: {
          active?: boolean
          amount_fixed?: number | null
          applies_to?: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          percent?: number | null
          provider_id: string
          tariff_version_id?: string | null
        }
        Update: {
          active?: boolean
          amount_fixed?: number | null
          applies_to?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          percent?: number | null
          provider_id?: string
          tariff_version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rebate_rules_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rebate_rules_tariff_version_id_fkey"
            columns: ["tariff_version_id"]
            isOneToOne: false
            referencedRelation: "tariff_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      tariff_slabs: {
        Row: {
          created_at: string
          id: string
          max_unit: number | null
          min_unit: number
          position: number
          rate_per_unit: number
          tariff_version_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_unit?: number | null
          min_unit: number
          position: number
          rate_per_unit: number
          tariff_version_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_unit?: number | null
          min_unit?: number
          position?: number
          rate_per_unit?: number
          tariff_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tariff_slabs_tariff_version_id_fkey"
            columns: ["tariff_version_id"]
            isOneToOne: false
            referencedRelation: "tariff_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      tariff_versions: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string | null
          effective_from: string
          id: string
          is_active: boolean
          provider_id: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          description?: string | null
          effective_from: string
          id?: string
          is_active?: boolean
          provider_id: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string | null
          effective_from?: string
          id?: string
          is_active?: boolean
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tariff_versions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      temp_game_scores: {
        Row: {
          created_at: string | null
          energy_generated: number
          game_duration: number
          id: string
          panels_placed: number
          score: number
          session_id: string
        }
        Insert: {
          created_at?: string | null
          energy_generated: number
          game_duration: number
          id?: string
          panels_placed: number
          score: number
          session_id: string
        }
        Update: {
          created_at?: string | null
          energy_generated?: number
          game_duration?: number
          id?: string
          panels_placed?: number
          score?: number
          session_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          company_name: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          gst_number: string | null
          id: string
          is_verified: boolean | null
          password_hash: string | null
          phone: string
          pm_surya_ghar_registered: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          vendor_name: string | null
        }
        Insert: {
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          gst_number?: string | null
          id?: string
          is_verified?: boolean | null
          password_hash?: string | null
          phone: string
          pm_surya_ghar_registered?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          vendor_name?: string | null
        }
        Update: {
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          gst_number?: string | null
          id?: string
          is_verified?: boolean | null
          password_hash?: string | null
          phone?: string
          pm_surya_ghar_registered?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          vendor_name?: string | null
        }
        Relationships: []
      }
      vendor_profiles: {
        Row: {
          address: string | null
          company_name: string | null
          contact_person: string | null
          created_at: string | null
          gst_number: string | null
          id: string
          license_number: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          gst_number?: string | null
          id?: string
          license_number?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          gst_number?: string | null
          id?: string
          license_number?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_quotations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          installation_charge: number | null
          installation_type: Database["public"]["Enums"]["installation_type"]
          system_type: Database["public"]["Enums"]["system_type"]
          total_price: number
          vendor_email: string
          vendor_id: string | null
          vendor_name: string
          vendor_phone: string
          warranty_years: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          installation_charge?: number | null
          installation_type: Database["public"]["Enums"]["installation_type"]
          system_type: Database["public"]["Enums"]["system_type"]
          total_price: number
          vendor_email: string
          vendor_id?: string | null
          vendor_name: string
          vendor_phone: string
          warranty_years?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          installation_charge?: number | null
          installation_type?: Database["public"]["Enums"]["installation_type"]
          system_type?: Database["public"]["Enums"]["system_type"]
          total_price?: number
          vendor_email?: string
          vendor_id?: string | null
          vendor_name?: string
          vendor_phone?: string
          warranty_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_quotations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      website_users: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_active: boolean | null
          phone: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_mobile_otp: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_email_by_phone: {
        Args: { _raw_phone: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      normalize_phone: {
        Args: { phone_input: string }
        Returns: string
      }
      pvmart_create_otp_verification: {
        Args: { phone_input: string }
        Returns: string
      }
      pvmart_generate_otp: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      pvmart_normalize_phone: {
        Args: { phone_input: string }
        Returns: string
      }
      send_mobile_otp: {
        Args: { phone_number: string; user_type: string }
        Returns: string
      }
      verify_mobile_otp: {
        Args: { phone_number: string; otp_code: string; user_type: string }
        Returns: boolean
      }
    }
    Enums: {
      installation_type: "rooftop" | "ground_mounted" | "carport" | "other"
      system_type: "on_grid" | "off_grid" | "hybrid"
      user_role: "admin" | "customer" | "vendor"
      weather_condition: "sunny" | "cloudy" | "rainy" | "stormy" | "night"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      installation_type: ["rooftop", "ground_mounted", "carport", "other"],
      system_type: ["on_grid", "off_grid", "hybrid"],
      user_role: ["admin", "customer", "vendor"],
      weather_condition: ["sunny", "cloudy", "rainy", "stormy", "night"],
    },
  },
} as const
