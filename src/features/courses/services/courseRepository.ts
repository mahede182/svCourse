import Realm from 'realm';
import { CourseModel } from '../models/CourseModel';

export const CourseRepository = {
  upsertFromRemote(
    realm: Realm,
    remoteCourses: Array<Record<string, unknown>>
  ): void {
    realm.write(() => {
      for (const remote of remoteCourses) {
        const id = (remote.id ?? remote.course_id) as string | undefined;
        if (!id) continue;

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

  toggleEnrollment(realm: Realm, courseId: string): void {
    realm.write(() => {
      const course = realm.objectForPrimaryKey(CourseModel, courseId);
      if (course) {
        course.is_enrolled = !course.is_enrolled;
        course.sync_status = 'pending';
      }
    });
  },

  markSynced(realm: Realm, courseId: string): void {
    realm.write(() => {
      const course = realm.objectForPrimaryKey(CourseModel, courseId);
      if (course) {
        course.sync_status = 'synced';
      }
    });
  },
};
