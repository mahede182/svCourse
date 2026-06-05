import Realm from 'realm';
import { ChapterModel } from '@/src/models';

export const ChapterRepository = {
  // Bulk upsert chapters from remote data while preserving local-only fields
  upsertFromRemote(
    realm: Realm,
    remoteChapters: Array<{
      id: string;
      course_id: string;
      title: string;
      content?: string | null;
      order_index: number;
    }>
  ): void {
    realm.write(() => {
      for (const remote of remoteChapters) {
        const existing = realm.objectForPrimaryKey(ChapterModel, remote.id);

        realm.create(
          ChapterModel,
          {
            _id: remote.id,
            courseId: remote.course_id,
            title: remote.title,
            content: remote.content ?? undefined,
            orderIndex: remote.order_index,
            // Preserve local-only field
            is_completed: existing?.is_completed ?? false,
          },
          Realm.UpdateMode.Modified
        );
      }
    });
  },

  /**
   * Mark a chapter as completed.
   */
  markCompleted(realm: Realm, chapterId: string): void {
    realm.write(() => {
      const chapter = realm.objectForPrimaryKey(ChapterModel, chapterId);
      if (chapter) {
        chapter.is_completed = true;
      }
    });
  },
};
