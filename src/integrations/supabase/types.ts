export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          id: string
          installation_type: Database["public"]["Enums"]["installation_type"]
          monthly_bill: number | null
          pincode: string
          property_type: string
          roof_type: string
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
          id?: string
          installation_type: Database["public"]["Enums"]["installation_type"]
          monthly_bill?: number | null
          pincode: string
          property_type: string
          roof_type: string
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
          id?: string
          installation_type?: Database["public"]["Enums"]["installation_type"]
          monthly_bill?: number | null
          pincode?: string
          property_type?: string
          roof_type?: string
          state?: string
          status?: string | null
          system_type?: Database["public"]["Enums"]["system_type"]
          timeline?: string | null
          updated_at?: string
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
      messages: {
        Row: {
          id: string;
          from_id: string;
          to_id: string;
          message: string;
          created_at: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          from_id: string;
          to_id: string;
          message: string;
          created_at?: string;
          read?: boolean;
        };
        Update: {
          id?: string;
          from_id?: string;
          to_id?: string;
          message?: string;
          created_at?: string;
          read?: boolean;
        };
        Relationships: [];
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
