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
      customer_requirements: {
        Row: {
          additional_requirements: string | null
          address: string
          budget_range: string | null
          city: string
          created_at: string
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
          status: string | null
          system_type: Database["public"]["Enums"]["system_type"]
          timeline: string | null
          updated_at: string
        }
        Insert: {
          additional_requirements?: string | null
          address: string
          budget_range?: string | null
          city: string
          created_at?: string
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
          status?: string | null
          system_type: Database["public"]["Enums"]["system_type"]
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          additional_requirements?: string | null
          address?: string
          budget_range?: string | null
          city?: string
          created_at?: string
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
          status?: string | null
          system_type?: Database["public"]["Enums"]["system_type"]
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
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
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quotation_components: {
        Row: {
          brand: string
          component_type: Database["public"]["Enums"]["component_type"]
          created_at: string
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
          created_at?: string
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
          created_at?: string
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vendor_quotations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          installation_charge: number | null
          installation_type: Database["public"]["Enums"]["installation_type"]
          system_type: Database["public"]["Enums"]["system_type"]
          total_price: number
          updated_at: string
          vendor_email: string
          vendor_id: string
          vendor_name: string
          vendor_phone: string | null
          warranty_years: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          installation_charge?: number | null
          installation_type: Database["public"]["Enums"]["installation_type"]
          system_type: Database["public"]["Enums"]["system_type"]
          total_price: number
          updated_at?: string
          vendor_email: string
          vendor_id: string
          vendor_name: string
          vendor_phone?: string | null
          warranty_years?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          installation_charge?: number | null
          installation_type?: Database["public"]["Enums"]["installation_type"]
          system_type?: Database["public"]["Enums"]["system_type"]
          total_price?: number
          updated_at?: string
          vendor_email?: string
          vendor_id?: string
          vendor_name?: string
          vendor_phone?: string | null
          warranty_years?: number | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          company_name: string | null
          contact_person: string | null
          created_at: string | null
          email: string
          id: string
          license_number: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          email: string
          id: string
          license_number?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string
          id?: string
          license_number?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          company_name: string | null;
          contact_person: string | null;
          license_number: string | null;
          address: string | null;
          role: 'vendor' | 'customer' | 'admin';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          company_name?: string | null;
          contact_person?: string | null;
          license_number?: string | null;
          address?: string | null;
          role: 'vendor' | 'customer' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          company_name?: string | null;
          contact_person?: string | null;
          license_number?: string | null;
          address?: string | null;
          role?: 'vendor' | 'customer' | 'admin';
          created_at?: string;
        };
        Relationships: [];
      },
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer" | "vendor"
      component_type:
        | "solar_panel"
        | "inverter"
        | "battery"
        | "cable_ac"
        | "cable_dc"
        | "mounting_structure"
        | "earthing"
        | "lightning_arrestor"
        | "mc4_connector"
        | "junction_box"
        | "other"
      installation_type:
        | "1KW"
        | "2KW"
        | "3KW"
        | "4KW"
        | "5KW"
        | "6KW"
        | "7KW"
        | "8KW"
        | "9KW"
        | "10KW"
        | "custom"
      system_type: "on-grid" | "off-grid" | "hybrid"
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
      app_role: ["admin", "customer", "vendor"],
      component_type: [
        "solar_panel",
        "inverter",
        "battery",
        "cable_ac",
        "cable_dc",
        "mounting_structure",
        "earthing",
        "lightning_arrestor",
        "mc4_connector",
        "junction_box",
        "other",
      ],
      installation_type: [
        "1KW",
        "2KW",
        "3KW",
        "4KW",
        "5KW",
        "6KW",
        "7KW",
        "8KW",
        "9KW",
        "10KW",
        "custom",
      ],
      system_type: ["on-grid", "off-grid", "hybrid"],
    },
  },
} as const
