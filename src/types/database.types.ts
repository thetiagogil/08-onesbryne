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
      categories: {
        Row: {
          created_at: string
          is_active: boolean
          label: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          label: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_active?: boolean
          label?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      category_size_options: {
        Row: {
          category_slug: string
          created_at: string
          size: Database["public"]["Enums"]["piece_size"]
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_slug: string
          created_at?: string
          size: Database["public"]["Enums"]["piece_size"]
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_slug?: string
          created_at?: string
          size?: Database["public"]["Enums"]["piece_size"]
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_size_options_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      favourites: {
        Row: {
          created_at: string
          piece_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          piece_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          piece_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favourites_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favourites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      piece_images: {
        Row: {
          alt_text: string | null
          byte_size: number | null
          created_at: string
          height: number | null
          id: string
          mime_type: string
          piece_id: string
          position: number
          storage_bucket: string
          storage_path: string
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          byte_size?: number | null
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string
          piece_id: string
          position?: number
          storage_bucket?: string
          storage_path: string
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          byte_size?: number | null
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string
          piece_id?: string
          position?: number
          storage_bucket?: string
          storage_path?: string
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "piece_images_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
        ]
      }
      pieces: {
        Row: {
          brand: string | null
          category_slug: string
          code: string | null
          code_number: number
          condition_label: Database["public"]["Enums"]["piece_condition"] | null
          created_at: string
          description: string
          id: string
          name: string
          price_cents: number
          published_at: string | null
          size_label: Database["public"]["Enums"]["piece_size"]
          sold_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category_slug: string
          code?: string | null
          code_number?: number
          condition_label?:
            | Database["public"]["Enums"]["piece_condition"]
            | null
          created_at?: string
          description: string
          id?: string
          name: string
          price_cents: number
          published_at?: string | null
          size_label: Database["public"]["Enums"]["piece_size"]
          sold_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category_slug?: string
          code?: string | null
          code_number?: number
          condition_label?:
            | Database["public"]["Enums"]["piece_condition"]
            | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          price_cents?: number
          published_at?: string | null
          size_label?: Database["public"]["Enums"]["piece_size"]
          sold_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pieces_category_size_allowed_fkey"
            columns: ["category_slug", "size_label"]
            isOneToOne: false
            referencedRelation: "category_size_options"
            referencedColumns: ["category_slug", "size"]
          },
          {
            foreignKeyName: "pieces_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      profiles: {
        Row: {
          app_role: string
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          app_role?: string
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          app_role?: string
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      piece_condition:
        | "new_with_tags"
        | "excellent"
        | "very_good"
        | "good"
        | "light_wear"
        | "visible_wear"
      piece_size:
        | "xxs"
        | "xs"
        | "s"
        | "m"
        | "l"
        | "xl"
        | "xxl"
        | "one_size"
        | "eu_35"
        | "eu_36"
        | "eu_37"
        | "eu_38"
        | "eu_39"
        | "eu_40"
        | "eu_41"
        | "eu_42"
        | "w24"
        | "w25"
        | "w26"
        | "w27"
        | "w28"
        | "w29"
        | "w30"
        | "w31"
        | "w32"
        | "w33"
        | "w34"
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
      piece_condition: [
        "new_with_tags",
        "excellent",
        "very_good",
        "good",
        "light_wear",
        "visible_wear",
      ],
      piece_size: [
        "xxs",
        "xs",
        "s",
        "m",
        "l",
        "xl",
        "xxl",
        "one_size",
        "eu_35",
        "eu_36",
        "eu_37",
        "eu_38",
        "eu_39",
        "eu_40",
        "eu_41",
        "eu_42",
        "w24",
        "w25",
        "w26",
        "w27",
        "w28",
        "w29",
        "w30",
        "w31",
        "w32",
        "w33",
        "w34",
      ],
    },
  },
} as const
