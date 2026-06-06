import type { Database } from './db.types';

/** Convenience row types derived from the database schema */
export type Course = Database['public']['Tables']['courses']['Row'];
export type Chapter = Database['public']['Tables']['chapters']['Row'];

export type { Database };
