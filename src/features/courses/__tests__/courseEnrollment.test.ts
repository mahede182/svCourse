import { CourseRepository } from '../services/courseRepository';

describe('CourseRepository - Enrollment', () => {
  let mockRealm: any;
  let mockDb: Record<string, any>;

  beforeEach(() => {
    mockDb = {};
    mockRealm = {
      write: jest.fn((callback) => callback()),
      objectForPrimaryKey: jest.fn((model, id) => mockDb[id]),
      create: jest.fn((model, data, updateMode) => {
        if (updateMode === 'modified' && mockDb[data._id]) {
          mockDb[data._id] = { ...mockDb[data._id], ...data };
        } else {
          mockDb[data._id] = data;
        }
      }),
    };
  });

  describe('toggleEnrollment', () => {
    it('should add user to enrolledUsers and set sync_status to pending if not enrolled', () => {
      mockDb['course_2'] = {
        _id: 'course_2',
        enrolledUsers: [],
        sync_status: 'synced',
      };

      CourseRepository.toggleEnrollment(mockRealm, 'course_2', 'user_1');

      expect(mockDb['course_2'].enrolledUsers).toContain('user_1');
      expect(mockDb['course_2'].sync_status).toBe('pending');
    });

    it('should remove user from enrolledUsers if already enrolled', () => {
      mockDb['course_3'] = {
        _id: 'course_3',
        enrolledUsers: ['user_1'],
        sync_status: 'synced',
      };

      CourseRepository.toggleEnrollment(mockRealm, 'course_3', 'user_1');

      expect(mockDb['course_3'].enrolledUsers).not.toContain('user_1');
      expect(mockDb['course_3'].sync_status).toBe('pending');
    });
  });
});
