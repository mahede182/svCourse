/**
 * Supabase Database type definitions.
 * Mirrors the actual remote schema.
 */
export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          cover_image_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          cover_image_url?: string | null;
        };
      };
      chapters: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          content: string | null;
          order_index: number;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          content?: string | null;
          order_index: number;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          content?: string | null;
          order_index?: number;
        };
      };
    };
  };
};

/** Convenience row types */
export type Course = Database['public']['Tables']['courses']['Row'];
export type Chapter = Database['public']['Tables']['chapters']['Row'];
