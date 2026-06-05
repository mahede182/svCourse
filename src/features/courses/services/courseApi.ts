import Realm from 'realm';
import { apiSlice } from '@/src/store/apiSlice';
import { CourseModel } from '../models/CourseModel';
import { CourseRepository } from './courseRepository';

interface SupabaseCourseRow {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
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
          if (realmInstance && data) {
            CourseRepository.upsertFromRemote(
              realmInstance,
              data as unknown as Array<Record<string, unknown>>
            );
          }
        } catch {
          // Network failure — Realm still has local data, UI is unaffected
        }
      },
    }),
  }),
});

export const { useGetCoursesQuery } = courseApi;
