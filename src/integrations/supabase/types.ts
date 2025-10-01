export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agent_memory: {
        Row: {
          agent_id: string
          content: Json
          created_at: string | null
          id: string
          memory_type: string
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          content: Json
          created_at?: string | null
          id?: string
          memory_type: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          content?: Json
          created_at?: string | null
          id?: string
          memory_type?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_memory_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "executive_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      executive_agents: {
        Row: {
          appearance: Json | null
          capabilities: Json | null
          context: Json | null
          created_at: string | null
          gender: string | null
          id: string
          is_active: boolean | null
          name: string
          personality: string | null
          updated_at: string | null
          user_id: string
          voice: string | null
        }
        Insert: {
          appearance?: Json | null
          capabilities?: Json | null
          context?: Json | null
          created_at?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          personality?: string | null
          updated_at?: string | null
          user_id: string
          voice?: string | null
        }
        Update: {
          appearance?: Json | null
          capabilities?: Json | null
          context?: Json | null
          created_at?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          personality?: string | null
          updated_at?: string | null
          user_id?: string
          voice?: string | null
        }
        Relationships: []
      }
      hip_configurations: {
        Row: {
          assistant_interaction_level: string | null
          brand_colors: Json | null
          collect_guest_email: boolean | null
          created_at: string | null
          custom_domain: string | null
          enable_calendar_connection_flow: boolean | null
          enable_calendar_integration: boolean | null
          enable_interactive_buttons: boolean | null
          enable_meeting_reminders: boolean | null
          enable_meeting_scheduling: boolean | null
          id: string
          is_public: boolean | null
          preferred_meeting_types: Json | null
          profile_description: string | null
          require_meeting_purpose: boolean | null
          show_calendar: boolean | null
          show_chatbot: boolean | null
          show_intelligent_alerts: boolean | null
          show_smart_scheduling: boolean | null
          show_suggested_venues: boolean | null
          updated_at: string | null
          user_id: string
          venue_recommendations: Json | null
          virtual_platforms: Json | null
        }
        Insert: {
          assistant_interaction_level?: string | null
          brand_colors?: Json | null
          collect_guest_email?: boolean | null
          created_at?: string | null
          custom_domain?: string | null
          enable_calendar_connection_flow?: boolean | null
          enable_calendar_integration?: boolean | null
          enable_interactive_buttons?: boolean | null
          enable_meeting_reminders?: boolean | null
          enable_meeting_scheduling?: boolean | null
          id?: string
          is_public?: boolean | null
          preferred_meeting_types?: Json | null
          profile_description?: string | null
          require_meeting_purpose?: boolean | null
          show_calendar?: boolean | null
          show_chatbot?: boolean | null
          show_intelligent_alerts?: boolean | null
          show_smart_scheduling?: boolean | null
          show_suggested_venues?: boolean | null
          updated_at?: string | null
          user_id: string
          venue_recommendations?: Json | null
          virtual_platforms?: Json | null
        }
        Update: {
          assistant_interaction_level?: string | null
          brand_colors?: Json | null
          collect_guest_email?: boolean | null
          created_at?: string | null
          custom_domain?: string | null
          enable_calendar_connection_flow?: boolean | null
          enable_calendar_integration?: boolean | null
          enable_interactive_buttons?: boolean | null
          enable_meeting_reminders?: boolean | null
          enable_meeting_scheduling?: boolean | null
          id?: string
          is_public?: boolean | null
          preferred_meeting_types?: Json | null
          profile_description?: string | null
          require_meeting_purpose?: boolean | null
          show_calendar?: boolean | null
          show_chatbot?: boolean | null
          show_intelligent_alerts?: boolean | null
          show_smart_scheduling?: boolean | null
          show_suggested_venues?: boolean | null
          updated_at?: string | null
          user_id?: string
          venue_recommendations?: Json | null
          virtual_platforms?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
