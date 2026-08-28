export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      comments: {
        Row: {
          content: string;
          created_at: string;
          id: number;
          modified_at: string;
          nickname: string;
          password: string;
          post_id: number;
        };
        Insert: {
          content?: string;
          created_at?: string;
          id?: number;
          modified_at?: string;
          nickname?: string;
          password?: string;
          post_id: number;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: number;
          modified_at?: string;
          nickname?: string;
          password?: string;
          post_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      menus: {
        Row: {
          created_at: string;
          hidden: boolean;
          id: string;
          modified_at: string;
          name: string;
          order_idx: number;
          parent_id: string | null;
          slug: string;
        };
        Insert: {
          created_at?: string;
          hidden?: boolean;
          id?: string;
          modified_at?: string;
          name?: string;
          order_idx?: number;
          parent_id?: string | null;
          slug?: string;
        };
        Update: {
          created_at?: string;
          hidden?: boolean;
          id?: string;
          modified_at?: string;
          name?: string;
          order_idx?: number;
          parent_id?: string | null;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menus_parent_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "menus";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          content: string;
          created_at: string;
          excerpt: string;
          hidden: boolean;
          id: number;
          menu_id: string;
          modified_at: string;
          tags: string[] | null;
          thumbnail: string | null;
          title: string;
        };
        Insert: {
          content?: string;
          created_at?: string;
          excerpt?: string;
          hidden?: boolean;
          id?: number;
          menu_id?: string;
          modified_at?: string;
          tags?: string[] | null;
          thumbnail?: string | null;
          title?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          excerpt?: string;
          hidden?: boolean;
          id?: number;
          menu_id?: string;
          modified_at?: string;
          tags?: string[] | null;
          thumbnail?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_menu_id_fkey";
            columns: ["menu_id"];
            isOneToOne: false;
            referencedRelation: "menus";
            referencedColumns: ["id"];
          },
        ];
      };
      temp_posts: {
        Row: {
          content: string;
          created_at: string;
          hidden: boolean;
          id: number;
          menu_id: string;
          modified_at: string;
          tags: string[] | null;
          thumbnail: string | null;
          title: string;
        };
        Insert: {
          content?: string;
          created_at?: string;
          hidden?: boolean;
          id?: number;
          menu_id?: string;
          modified_at?: string;
          tags?: string[] | null;
          thumbnail?: string | null;
          title?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          hidden?: boolean;
          id?: number;
          menu_id?: string;
          modified_at?: string;
          tags?: string[] | null;
          thumbnail?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "temp_posts_menu_id_fkey";
            columns: ["menu_id"];
            isOneToOne: false;
            referencedRelation: "menus";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      fn_menus_reorder: { Args: { updates: Json }; Returns: undefined };
      get_post_neighbors: { Args: { p_post_id: number }; Returns: Json };
      posts_bulk_delete: {
        Args: { post_ids: number[] };
        Returns: {
          post_id: number;
          reason: string;
          title: string;
        }[];
      };
      posts_bulk_move_menu: {
        Args: { post_ids: number[]; target_menu_id: string };
        Returns: {
          post_id: number;
          reason: string;
          title: string;
        }[];
      };
      posts_bulk_update_hidden: {
        Args: { new_hidden: boolean; post_ids: number[] };
        Returns: {
          post_id: number;
          reason: string;
          title: string;
        }[];
      };
      reserve_post_id: { Args: never; Returns: number };
      reserve_temp_post_id: { Args: never; Returns: number };
      search_posts_or_title_phrase_or_tags_any: {
        Args: { q?: string };
        Returns: {
          content: string;
          created_at: string;
          excerpt: string;
          hidden: boolean;
          id: number;
          menu_id: string;
          modified_at: string;
          tags: string[] | null;
          thumbnail: string | null;
          title: string;
        }[];
        SetofOptions: {
          from: "*";
          to: "posts";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
