import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${supabaseUrl}/rest/v1`,
    prepareHeaders: (headers) => {
      headers.set('apikey', supabaseKey);
      headers.set('Authorization', `Bearer ${supabaseKey}`);
      return headers;
    },
  }),
  tagTypes: ['Courses', 'Chapters'],
  endpoints: () => ({}),
});
