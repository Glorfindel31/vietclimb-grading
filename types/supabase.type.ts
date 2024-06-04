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
      rates_grades: {
        Row: {
          created_at: string
          id: number
          route_grade: number
          route_rate: number
          route_top: boolean
          URID_linked: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          route_grade?: number
          route_rate?: number
          route_top?: boolean
          URID_linked: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          route_grade?: number
          route_rate?: number
          route_top?: boolean
          URID_linked?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rates_grades_URID_linked_fkey"
            columns: ["URID_linked"]
            isOneToOne: true
            referencedRelation: "routes"
            referencedColumns: ["URID"]
          },
          {
            foreignKeyName: "rates_grades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["UID"]
          },
        ]
      }
      routes: {
        Row: {
          id: number
          RID: number | null
          route_color: string | null
          route_date: string | null
          route_grade: number | null
          route_link: string | null
          route_setter: string | null
          URID: string | null
          zone_name: string | null
        }
        Insert: {
          id?: number
          RID?: number | null
          route_color?: string | null
          route_date?: string | null
          route_grade?: number | null
          route_link?: string | null
          route_setter?: string | null
          URID?: string | null
          zone_name?: string | null
        }
        Update: {
          id?: number
          RID?: number | null
          route_color?: string | null
          route_date?: string | null
          route_grade?: number | null
          route_link?: string | null
          route_setter?: string | null
          URID?: string | null
          zone_name?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          arms: number | null
          birthdate: string | null
          created_at: string
          displayed_name: string | null
          email: string
          height: number | null
          id: number
          role: string
          show_arms: boolean | null
          show_birthdate: boolean | null
          show_height: boolean
          show_name: boolean | null
          show_rank: boolean
          show_tops: boolean
          UID: string
        }
        Insert: {
          arms?: number | null
          birthdate?: string | null
          created_at?: string
          displayed_name?: string | null
          email: string
          height?: number | null
          id?: number
          role?: string
          show_arms?: boolean | null
          show_birthdate?: boolean | null
          show_height?: boolean
          show_name?: boolean | null
          show_rank?: boolean
          show_tops?: boolean
          UID: string
        }
        Update: {
          arms?: number | null
          birthdate?: string | null
          created_at?: string
          displayed_name?: string | null
          email?: string
          height?: number | null
          id?: number
          role?: string
          show_arms?: boolean | null
          show_birthdate?: boolean | null
          show_height?: boolean
          show_name?: boolean | null
          show_rank?: boolean
          show_tops?: boolean
          UID?: string
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
