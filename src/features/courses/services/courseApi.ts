import { apiSlice } from '@/src/store';
import Realm from 'realm';
import { CourseRepository } from './courseRepository';

interface SupabaseCourseRow {
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
}

let realmInstance: Realm | null = null;

export function setRealmInstance(realm: Realm) {
  realmInstance = realm;
}

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<SupabaseCourseRow[], void>({
      query: () => ({
        url: '/courses',
        params: { select: '*' },
      }),
      providesTags: ['Courses'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (realmInstance && Array.isArray(data)) {
            CourseRepository.upsertFromRemote(
              realmInstance,
              data as unknown as Array<Record<string, unknown>>
            );
          } else if (data && !Array.isArray(data)) {
            console.error('Invalid response shape from Supabase: Expected an array.');
          }
        } catch (err) {
          console.error('Supabase request failed:', err);
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetCoursesQuery } = courseApi;
