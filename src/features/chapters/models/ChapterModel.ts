import Realm from 'realm';

export class ChapterModel extends Realm.Object<ChapterModel> {
  _id!: string;
  courseId!: string;
  title!: string;
  content?: string;
  orderIndex!: number;

  is_completed!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Chapter',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      courseId: 'string',
      title: 'string',
      content: 'string?',
      orderIndex: { type: 'int', default: 0 },

      is_completed: { type: 'bool', default: false },
    },
  };
}
