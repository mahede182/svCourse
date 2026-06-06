import Realm from 'realm';

export class CourseModel extends Realm.Object<CourseModel> {
  _id!: string;
  title!: string;
  descriptionShort!: string;
  instructorId?: string;
  instructorName!: string;
  instructorExpertiseLevel?: string;
  durationWeeks!: number;
  priceUsd!: number;
  isPremium!: boolean;
  tags!: Realm.List<string>;
  rating!: number;
  lastUpdated!: string;

  enrolledUsers!: Realm.List<string>;
  favouritedUsers!: Realm.List<string>;
  sync_status!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Course',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      title: 'string',
      descriptionShort: 'string',
      instructorId: 'string?',
      instructorName: 'string',
      instructorExpertiseLevel: 'string?',
      durationWeeks: 'int',
      priceUsd: 'double',
      isPremium: 'bool',
      tags: 'string[]',
      rating: 'double',
      lastUpdated: 'string',

      enrolledUsers: 'string[]',
      favouritedUsers: 'string[]',
      sync_status: { type: 'string', default: 'synced' },
    },
  };
}
