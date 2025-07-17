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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          permissions: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permissions?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permissions?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_pinned: boolean | null
          published_at: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_pinned?: boolean | null
          published_at?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_pinned?: boolean | null
          published_at?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          id: string
          pincode: string | null
          state: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_requirements: {
        Row: {
          additional_requirements: string | null
          address: string
          budget_range: string | null
          city: string
          created_at: string | null
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string | null
          discom: string | null
          district: string | null
          id: string
          installation_type: Database["public"]["Enums"]["installation_type"]
          monthly_bill: number | null
          pincode: string
          property_type: string
          roof_type: string
          rooftop_area: string | null
          state: string
          status: Database["public"]["Enums"]["requirement_status"] | null
          system_type: Database["public"]["Enums"]["system_type"]
          timeline: string | null
          updated_at: string | null
        }
        Insert: {
          additional_requirements?: string | null
          address: string
          budget_range?: string | null
          city: string
          created_at?: string | null
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone?: string | null
          discom?: string | null
          district?: string | null
          id?: string
          installation_type: Database["public"]["Enums"]["installation_type"]
          monthly_bill?: number | null
          pincode: string
          property_type: string
          roof_type: string
          rooftop_area?: string | null
          state: string
          status?: Database["public"]["Enums"]["requirement_status"] | null
          system_type: Database["public"]["Enums"]["system_type"]
          timeline?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_requirements?: string | null
          address?: string
          budget_range?: string | null
          city?: string
          created_at?: string | null
          customer_email?: string
          customer_id?: string
          customer_name?: string
          customer_phone?: string | null
          discom?: string | null
          district?: string | null
          id?: string
          installation_type?: Database["public"]["Enums"]["installation_type"]
          monthly_bill?: number | null
          pincode?: string
          property_type?: string
          roof_type?: string
          rooftop_area?: string | null
          state?: string
          status?: Database["public"]["Enums"]["requirement_status"] | null
          system_type?: Database["public"]["Enums"]["system_type"]
          timeline?: string | null
          updated_at?: string | null
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
      hero_images: {
        Row: {
          created_at: string | null
          cta_link: string | null
          cta_text: string | null
          description: string | null
          id: string
          image_url: string
          is_active: boolean | null
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          order_index?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quotation_components: {
        Row: {
          brand: string
          component_type: Database["public"]["Enums"]["component_type"]
          created_at: string | null
          id: string
          included_length_meters: number | null
          model: string | null
          quantity: number
          quotation_id: string
          specifications: string | null
          total_price: number
          unit_price: number
          warranty_years: number | null
        }
        Insert: {
          brand: string
          component_type: Database["public"]["Enums"]["component_type"]
          created_at?: string | null
          id?: string
          included_length_meters?: number | null
          model?: string | null
          quantity?: number
          quotation_id: string
          specifications?: string | null
          total_price: number
          unit_price: number
          warranty_years?: number | null
        }
        Update: {
          brand?: string
          component_type?: Database["public"]["Enums"]["component_type"]
          created_at?: string | null
          id?: string
          included_length_meters?: number | null
          model?: string | null
          quantity?: number
          quotation_id?: string
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
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_profiles: {
        Row: {
          address: string | null
          company_name: string
          contact_person: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          license_number: string | null
          pm_surya_ghar_registered: boolean | null
          service_areas: string | null
          specializations: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_person: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          pm_surya_ghar_registered?: boolean | null
          service_areas?: string | null
          specializations?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          pm_surya_ghar_registered?: boolean | null
          service_areas?: string | null
          specializations?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_quotations: {
        Row: {
          created_at: string | null
          customer_requirement_id: string | null
          description: string | null
          id: string
          installation_charge: number | null
          installation_type: Database["public"]["Enums"]["installation_type"]
          status: Database["public"]["Enums"]["quotation_status"] | null
          system_type: Database["public"]["Enums"]["system_type"]
          total_price: number
          updated_at: string | null
          vendor_email: string
          vendor_id: string
          vendor_name: string
          vendor_phone: string | null
          warranty_years: number | null
        }
        Insert: {
          created_at?: string | null
          customer_requirement_id?: string | null
          description?: string | null
          id?: string
          installation_charge?: number | null
          installation_type: Database["public"]["Enums"]["installation_type"]
          status?: Database["public"]["Enums"]["quotation_status"] | null
          system_type: Database["public"]["Enums"]["system_type"]
          total_price?: number
          updated_at?: string | null
          vendor_email: string
          vendor_id: string
          vendor_name: string
          vendor_phone?: string | null
          warranty_years?: number | null
        }
        Update: {
          created_at?: string | null
          customer_requirement_id?: string | null
          description?: string | null
          id?: string
          installation_charge?: number | null
          installation_type?: Database["public"]["Enums"]["installation_type"]
          status?: Database["public"]["Enums"]["quotation_status"] | null
          system_type?: Database["public"]["Enums"]["system_type"]
          total_price?: number
          updated_at?: string | null
          vendor_email?: string
          vendor_id?: string
          vendor_name?: string
          vendor_phone?: string | null
          warranty_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_quotations_customer_requirement_id_fkey"
            columns: ["customer_requirement_id"]
            isOneToOne: false
            referencedRelation: "customer_requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_quotations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_customer: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_vendor: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
    }
    Enums: {
      component_type:
        | "solar_panel"
        | "inverter"
        | "battery"
        | "mounting_structure"
        | "cables"
        | "other"
      installation_type: "on_grid" | "off_grid" | "hybrid"
      quotation_status: "draft" | "submitted" | "accepted" | "rejected"
      requirement_status: "pending" | "active" | "completed" | "cancelled"
      system_type: "residential" | "commercial" | "industrial"
      user_role: "customer" | "vendor" | "admin"
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
      component_type: [
        "solar_panel",
        "inverter",
        "battery",
        "mounting_structure",
        "cables",
        "other",
      ],
      installation_type: ["on_grid", "off_grid", "hybrid"],
      quotation_status: ["draft", "submitted", "accepted", "rejected"],
      requirement_status: ["pending", "active", "completed", "cancelled"],
      system_type: ["residential", "commercial", "industrial"],
      user_role: ["customer", "vendor", "admin"],
    },
  },
} as const
