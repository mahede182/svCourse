/**
 * Supabase Database type definitions.
 * Mirrors the actual remote schema.
 */
export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          course_id: string;
          title: string;
          description_short: string;
          instructor_id: string | null;
          instructor_name: string;
          instructor_expertise_level: string | null;
          duration_weeks: number;
          price_usd: number;
          is_premium: boolean;
          tags: string[];
          rating: number;
          last_updated: string;
        };
        Insert: {
          course_id?: string;
          title: string;
          description_short: string;
          instructor_id?: string | null;
          instructor_name: string;
          instructor_expertise_level?: string | null;
          duration_weeks: number;
          price_usd: number;
          is_premium: boolean;
          tags: string[];
          rating: number;
          last_updated?: string;
        };
        Update: {
          course_id?: string;
          title?: string;
          description_short?: string;
          instructor_id?: string | null;
          instructor_name?: string;
          instructor_expertise_level?: string | null;
          duration_weeks?: number;
          price_usd?: number;
          is_premium?: boolean;
          tags?: string[];
          rating?: number;
          last_updated?: string;
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
