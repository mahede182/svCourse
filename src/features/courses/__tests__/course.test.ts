import { CourseRepository } from '../services/courseRepository';

describe('CourseRepository', () => {
  let mockRealm: any;
  let mockDb: Record<string, any>;

  beforeEach(() => {
    mockDb = {};
    mockRealm = {
      write: jest.fn((callback) => callback()),
      objectForPrimaryKey: jest.fn((model, id) => mockDb[id]),
      create: jest.fn((model, data, updateMode) => {
        if (updateMode === 'modified' && mockDb[data._id]) {
          // Merge
          mockDb[data._id] = { ...mockDb[data._id], ...data };
        } else {
          // Create
          mockDb[data._id] = data;
        }
      }),
    };
  });

  describe('upsertFromRemote', () => {
    it('should map remote Supabase data to local Realm schema and preserve local fields', () => {
      mockDb['course_1'] = {
        _id: 'course_1',
        title: 'Old Title',
        enrolledUsers: ['user_99'], // Local field
        favouritedUsers: [],
        sync_status: 'synced',
      };

      const remoteCourses = [
        {
          course_id: 'course_1',
          title: 'New Title',
          description_short: 'Desc',
          instructor_name: 'John',
          duration_weeks: 4,
          price_usd: 10,
          is_premium: true,
          tags: ['React'],
          rating: 4.5,
          last_updated: '2024-01-01T00:00:00Z',
        },
      ];

      CourseRepository.upsertFromRemote(mockRealm, remoteCourses);

      expect(mockRealm.write).toHaveBeenCalled();
      expect(mockDb['course_1'].title).toBe('New Title');
      // Verify local fields are preserved
      expect(mockDb['course_1'].enrolledUsers).toEqual(['user_99']);
      expect(mockDb['course_1'].sync_status).toBe('synced');
    });
  });
});
