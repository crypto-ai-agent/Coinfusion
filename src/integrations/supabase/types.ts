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
      content_cards: {
        Row: {
          card_type: Database["public"]["Enums"]["card_type"]
          content_ids: string[] | null
          created_at: string | null
          description: string | null
          display_order: number
          guides: Json | null
          header_description: string | null
          header_title: string | null
          id: string
          is_active: boolean | null
          layout_type: string | null
          style_variant: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          card_type: Database["public"]["Enums"]["card_type"]
          content_ids?: string[] | null
          created_at?: string | null
          description?: string | null
          display_order?: number
          guides?: Json | null
          header_description?: string | null
          header_title?: string | null
          id?: string
          is_active?: boolean | null
          layout_type?: string | null
          style_variant?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          card_type?: Database["public"]["Enums"]["card_type"]
          content_ids?: string[] | null
          created_at?: string | null
          description?: string | null
          display_order?: number
          guides?: Json | null
          header_description?: string | null
          header_title?: string | null
          id?: string
          is_active?: boolean | null
          layout_type?: string | null
          style_variant?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      educational_content: {
        Row: {
          author_id: string
          category: string
          content: string
          content_type: string
          created_at: string | null
          has_quiz: boolean | null
          id: string
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          category: string
          content: string
          content_type?: string
          created_at?: string | null
          has_quiz?: boolean | null
          id?: string
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          content_type?: string
          created_at?: string | null
          has_quiz?: boolean | null
          id?: string
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_requests: {
        Row: {
          created_at: string | null
          feature_name: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feature_name: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feature_name?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      featured_quiz_selections: {
        Row: {
          created_at: string | null
          id: string
          quiz_ids: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          quiz_ids?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          quiz_ids?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      guides: {
        Row: {
          category: string
          created_at: string | null
          description: string
          difficulty: string
          id: string
          points: number | null
          progress: number | null
          read_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          difficulty: string
          id?: string
          points?: number | null
          progress?: number | null
          read_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          difficulty?: string
          id?: string
          points?: number | null
          progress?: number | null
          read_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          author_id: string
          category: string
          content: string
          content_type: string
          created_at: string | null
          id: string
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          category: string
          content: string
          content_type?: string
          created_at?: string | null
          id?: string
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          content_type?: string
          created_at?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      page_layouts: {
        Row: {
          created_at: string | null
          id: string
          layout_order: Json
          page_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          layout_order?: Json
          page_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          layout_order?: Json
          page_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      popular_course_selections: {
        Row: {
          content_ids: string[] | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          content_ids?: string[] | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          content_ids?: string[] | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      popular_guide_selections: {
        Row: {
          created_at: string | null
          guide_ids: string[] | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          guide_ids?: string[] | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          guide_ids?: string[] | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      price_history: {
        Row: {
          coin_id: string
          id: string
          market_cap_usd: number | null
          price_usd: number
          timestamp: string | null
          volume_24h_usd: number | null
        }
        Insert: {
          coin_id: string
          id?: string
          market_cap_usd?: number | null
          price_usd: number
          timestamp?: string | null
          volume_24h_usd?: number | null
        }
        Update: {
          coin_id?: string
          id?: string
          market_cap_usd?: number | null
          price_usd?: number
          timestamp?: string | null
          volume_24h_usd?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          display_name: string | null
          email_notifications: boolean | null
          id: string
          phone_number: string | null
          preferred_language: string | null
          timezone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          email_notifications?: boolean | null
          id: string
          phone_number?: string | null
          preferred_language?: string | null
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          email_notifications?: boolean | null
          id?: string
          phone_number?: string | null
          preferred_language?: string | null
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          attempt_number: number | null
          completed_at: string | null
          duration_minutes: number | null
          feedback: string | null
          id: string
          quiz_id: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          answers: Json
          attempt_number?: number | null
          completed_at?: string | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          quiz_id?: string | null
          score: number
          user_id?: string | null
        }
        Update: {
          answers?: Json
          attempt_number?: number | null
          completed_at?: string | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          quiz_id?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          explanation: string | null
          feedback_correct: string | null
          feedback_incorrect: string | null
          id: string
          options: Json
          question: string
          quiz_id: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          explanation?: string | null
          feedback_correct?: string | null
          feedback_incorrect?: string | null
          id?: string
          options: Json
          question: string
          quiz_id?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          explanation?: string | null
          feedback_correct?: string | null
          feedback_incorrect?: string | null
          id?: string
          options?: Json
          question?: string
          quiz_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          category_id: string | null
          content_id: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_duration: unknown | null
          guide_id: string | null
          id: string
          is_expert_quiz: boolean | null
          points: number | null
          prerequisites: string[] | null
          quiz_type: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          content_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: unknown | null
          guide_id?: string | null
          id?: string
          is_expert_quiz?: boolean | null
          points?: number | null
          prerequisites?: string[] | null
          quiz_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          content_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: unknown | null
          guide_id?: string | null
          id?: string
          is_expert_quiz?: boolean | null
          points?: number | null
          prerequisites?: string[] | null
          quiz_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "quiz_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "educational_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_items: {
        Row: {
          available_quantity: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          points_cost: number
          updated_at: string | null
        }
        Insert: {
          available_quantity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          points_cost: number
          updated_at?: string | null
        }
        Update: {
          available_quantity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          points_cost?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_content: string[] | null
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity: string | null
          total_points: number | null
          user_id: string
        }
        Insert: {
          completed_content?: string[] | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity?: string | null
          total_points?: number | null
          user_id: string
        }
        Update: {
          completed_content?: string[] | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity?: string | null
          total_points?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          id: string
          redeemed_at: string | null
          reward_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          id?: string
          redeemed_at?: string | null
          reward_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          id?: string
          redeemed_at?: string | null
          reward_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "reward_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      watchlist_items: {
        Row: {
          alert_price_high: number | null
          alert_price_low: number | null
          coin_id: string
          created_at: string | null
          id: string
          watchlist_id: string | null
        }
        Insert: {
          alert_price_high?: number | null
          alert_price_low?: number | null
          coin_id: string
          created_at?: string | null
          id?: string
          watchlist_id?: string | null
        }
        Update: {
          alert_price_high?: number | null
          alert_price_low?: number | null
          coin_id?: string
          created_at?: string | null
          id?: string
          watchlist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_items_watchlist_id_fkey"
            columns: ["watchlist_id"]
            isOneToOne: false
            referencedRelation: "watchlists"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlists: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          list_type: string | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          list_type?: string | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          list_type?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_slug: {
        Args: {
          base_slug: string
        }
        Returns: string
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      card_type:
        | "guide_collection"
        | "quiz_section"
        | "progress_tracker"
        | "featured_content"
        | "ai_highlight"
        | "news_collection"
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
