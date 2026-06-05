import Realm, { BSON } from 'realm';

export class CourseModel extends Realm.Object<CourseModel> {
  _id!: string;
  title!: string;
  courseDescription?: string;
  coverImageUrl?: string;

  // Local-only fields
  is_enrolled!: boolean;
  sync_status!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Course',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      title: 'string',
      courseDescription: 'string?',
      coverImageUrl: 'string?',

      // Local-only — preserved during upserts
      is_enrolled: { type: 'bool', default: false },
      sync_status: { type: 'string', default: 'synced' },
    },
  };
}
