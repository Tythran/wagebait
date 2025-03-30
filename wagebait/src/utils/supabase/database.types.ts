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
      active_games: {
        Row: {
          betting_pool: number | null
          current_player: string | null
          game_id: string
          new_bets: boolean | null
          round_number: number
          session_code: string
          start_time: string | null
        }
        Insert: {
          betting_pool?: number | null
          current_player?: string | null
          game_id?: string
          new_bets?: boolean | null
          round_number: number
          session_code: string
          start_time?: string | null
        }
        Update: {
          betting_pool?: number | null
          current_player?: string | null
          game_id?: string
          new_bets?: boolean | null
          round_number?: number
          session_code?: string
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "active_games_current_player_fkey"
            columns: ["current_player"]
            isOneToOne: false
            referencedRelation: "active_players"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "active_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["game_id"]
          },
        ]
      }
      active_players: {
        Row: {
          answer_chosen: number | null
          avatar_seed: string | null
          balance: number | null
          bet: number
          folded: boolean | null
          last_action: string | null
          player_id: string
          player_name: string | null
          player_number: number
          press_time: string | null
          session_code: string
        }
        Insert: {
          answer_chosen?: number | null
          avatar_seed?: string | null
          balance?: number | null
          bet: number
          folded?: boolean | null
          last_action?: string | null
          player_id?: string
          player_name?: string | null
          player_number: number
          press_time?: string | null
          session_code: string
        }
        Update: {
          answer_chosen?: number | null
          avatar_seed?: string | null
          balance?: number | null
          bet?: number
          folded?: boolean | null
          last_action?: string | null
          player_id?: string
          player_name?: string | null
          player_number?: number
          press_time?: string | null
          session_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "active_players_session_code_fkey"
            columns: ["session_code"]
            isOneToOne: false
            referencedRelation: "active_games"
            referencedColumns: ["session_code"]
          },
        ]
      }
      category: {
        Row: {
          category_id: string
          category_name: string | null
          game_id: string
        }
        Insert: {
          category_id?: string
          category_name?: string | null
          game_id?: string
        }
        Update: {
          category_id?: string
          category_name?: string | null
          game_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["game_id"]
          },
        ]
      }
      games: {
        Row: {
          created_by: string | null
          game_id: string
          game_title: string | null
        }
        Insert: {
          created_by?: string | null
          game_id?: string
          game_title?: string | null
        }
        Update: {
          created_by?: string | null
          game_id?: string
          game_title?: string | null
        }
        Relationships: []
      }
      question: {
        Row: {
          category_id: string
          correct_1: boolean | null
          correct_2: boolean | null
          correct_3: boolean | null
          correct_4: boolean | null
          option_1: string | null
          option_2: string | null
          option_3: string | null
          option_4: string | null
          question_id: string
          question_text: string | null
        }
        Insert: {
          category_id?: string
          correct_1?: boolean | null
          correct_2?: boolean | null
          correct_3?: boolean | null
          correct_4?: boolean | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          question_id?: string
          question_text?: string | null
        }
        Update: {
          category_id?: string
          correct_1?: boolean | null
          correct_2?: boolean | null
          correct_3?: boolean | null
          correct_4?: boolean | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          question_id?: string
          question_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["category_id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
