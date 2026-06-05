import Realm from 'realm';
import { CourseModel } from '@/src/models';

export const CourseRepository = {
  // Bulk upsert courses from remote data while preserving local-only fields
  upsertFromRemote(
    realm: Realm,
    remoteCourses: Array<Record<string, unknown>>
  ): void {
    if (remoteCourses.length > 0) {
      console.log('[CourseRepo] First record keys:', Object.keys(remoteCourses[0]));
      console.log('[CourseRepo] First record:', JSON.stringify(remoteCourses[0]));
    }

    realm.write(() => {
      for (const remote of remoteCourses) {
        const id = (remote.id ?? remote.course_id) as string | undefined;
        if (!id) {
          console.warn('[CourseRepo] Skipping record with no id:', remote);
          continue;
        }

        const existing = realm.objectForPrimaryKey(CourseModel, id);

        realm.create(
          CourseModel,
          {
            _id: id,
            title: (remote.title as string) ?? '',
            courseDescription: (remote.description as string) ?? undefined,
            coverImageUrl: (remote.cover_image_url as string) ?? undefined,
            is_enrolled: existing?.is_enrolled ?? false,
            sync_status: existing?.sync_status ?? 'synced',
          },
          Realm.UpdateMode.Modified
        );
      }
    });
  },

  /**
   * Toggle enrollment status for a course.
   * Sets sync_status to 'pending' for background sync.
   */
  toggleEnrollment(realm: Realm, courseId: string): void {
    realm.write(() => {
      const course = realm.objectForPrimaryKey(CourseModel, courseId);
      if (course) {
        course.is_enrolled = !course.is_enrolled;
        course.sync_status = 'pending';
      }
    });
  },

  /**
   * Mark a course's sync as complete.
   */
  markSynced(realm: Realm, courseId: string): void {
    realm.write(() => {
      const course = realm.objectForPrimaryKey(CourseModel, courseId);
      if (course) {
        course.sync_status = 'synced';
      }
    });
  },
};
