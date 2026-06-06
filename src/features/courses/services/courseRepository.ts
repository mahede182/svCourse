import Realm from 'realm';
import { CourseModel } from '../models/CourseModel';

export const CourseRepository = {
  upsertFromRemote(
    realm: Realm,
    remoteCourses: Array<Record<string, unknown>>
  ): void {
    realm.write(() => {
      for (const remote of remoteCourses) {
        const id = remote.course_id as string | undefined;
        if (!id) continue;

        const existing = realm.objectForPrimaryKey(CourseModel, id);

        realm.create(
          CourseModel,
          {
            _id: id,
            title: (remote.title as string) ?? '',
            descriptionShort: (remote.description_short as string) ?? '',
            instructorId: (remote.instructor_id as string | null) ?? undefined,
            instructorName: (remote.instructor_name as string) ?? '',
            instructorExpertiseLevel: (remote.instructor_expertise_level as string | null) ?? undefined,
            durationWeeks: (remote.duration_weeks as number) ?? 0,
            priceUsd: (remote.price_usd as number) ?? 0,
            isPremium: (remote.is_premium as boolean) ?? false,
            tags: (remote.tags as string[]) ?? [],
            rating: (remote.rating as number) ?? 0,
            lastUpdated: (remote.last_updated as string) ?? new Date().toISOString(),

            ...(existing ? {} : { enrolledUsers: [], favouritedUsers: [] }),
            sync_status: existing?.sync_status ?? 'synced',
          },
          Realm.UpdateMode.Modified
        );
      }
    });
  },

  toggleEnrollment(realm: Realm, courseId: string, userId: string): void {
    realm.write(() => {
      const course = realm.objectForPrimaryKey(CourseModel, courseId);
      if (course) {
        const index = course.enrolledUsers.indexOf(userId);
        if (index > -1) {
          course.enrolledUsers.splice(index, 1);
        } else {
          course.enrolledUsers.push(userId);
        }
        course.sync_status = 'pending';
      }
    });
  },

  toggleFavourite(realm: Realm, courseId: string, userId: string): void {
    realm.write(() => {
      const course = realm.objectForPrimaryKey(CourseModel, courseId);
      if (course) {
        const index = course.favouritedUsers.indexOf(userId);
        if (index > -1) {
          course.favouritedUsers.splice(index, 1);
        } else {
          course.favouritedUsers.push(userId);
        }
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
