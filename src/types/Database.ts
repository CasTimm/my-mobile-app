export type Database = {
  public: {
    Tables: {
      parks: {
        Row: {
          id: string;
          name: string;
          location: string;
          rating: number | null;
          crowd: string | null;
          amenities: string[];
          description: string | null;
        };
        Insert: {
          id: string;
          name: string;
          location: string;
          rating?: number | null;
          crowd?: string | null;
          amenities?: string[];
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          rating?: number | null;
          crowd?: string | null;
          amenities?: string[];
          description?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
