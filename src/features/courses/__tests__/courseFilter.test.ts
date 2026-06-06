import { CourseRepository } from '../services/courseRepository';

describe('CourseRepository - Filters and Search', () => {
  describe('getFilteredAndSortedCourses', () => {
    // Mocking Realm.Results with chaining support for filtered and sorted
    const createMockResults = (arr: any[]) => {
      const results = [...arr] as any;
      
      results.filtered = (query: string, ...args: any[]) => {
        if (query.includes('isPremium == true')) {
          return createMockResults(arr.filter(c => c.isPremium === true));
        }
        if (query.includes('isPremium == false')) {
          return createMockResults(arr.filter(c => c.isPremium === false));
        }
        if (query.includes('enrolledUsers CONTAINS')) {
          const userId = args[0];
          return createMockResults(arr.filter(c => c.enrolledUsers.includes(userId)));
        }
        if (query.includes('CONTAINS[c]')) {
          const search = args[0].toLowerCase();
          return createMockResults(arr.filter(c => 
            c.title.toLowerCase().includes(search) || 
            c.descriptionShort.toLowerCase().includes(search) ||
            c.instructorName.toLowerCase().includes(search) ||
            c.tags.some((t: string) => t.toLowerCase().includes(search))
          ));
        }
        return createMockResults(arr);
      };
      
      results.sorted = (field: string, reverse: boolean) => {
        return createMockResults([...arr].sort((a, b) => {
          if (a[field] < b[field]) return reverse ? 1 : -1;
          if (a[field] > b[field]) return reverse ? -1 : 1;
          return 0;
        }));
      };
      
      return results;
    };

    const mockCourses = createMockResults([
      { _id: '1', title: 'React Native Advanced', descriptionShort: 'Build apps', instructorName: 'Alice', tags: ['mobile'], isPremium: true, priceUsd: 50, rating: 4.8, enrolledUsers: ['user_1'] },
      { _id: '2', title: 'Expo Basics', descriptionShort: 'Learn Expo', instructorName: 'Bob', tags: ['mobile', 'expo'], isPremium: false, priceUsd: 0, rating: 4.5, enrolledUsers: [] },
      { _id: '3', title: 'Web Dev', descriptionShort: 'HTML and CSS', instructorName: 'Alice', tags: ['web'], isPremium: true, priceUsd: 20, rating: 4.2, enrolledUsers: [] },
    ]);

    it('should filter by search query across multiple fields', () => {
      const result = CourseRepository.getFilteredAndSortedCourses(mockCourses, { searchQuery: 'expo', isEnrolledFilter: false, premiumFilter: 'all', sortOption: 'newest' });
      expect(result.length).toBe(1);
      expect(result[0]._id).toBe('2');
    });

    it('should filter by premium status', () => {
      const result = CourseRepository.getFilteredAndSortedCourses(mockCourses, { searchQuery: '', isEnrolledFilter: false, premiumFilter: 'premium', sortOption: 'newest' });
      expect(result.length).toBe(2);
      expect(result.map((c: any) => c._id)).toEqual(expect.arrayContaining(['1', '3']));
    });

    it('should filter by enrolled status', () => {
      const result = CourseRepository.getFilteredAndSortedCourses(mockCourses, { searchQuery: '', isEnrolledFilter: true, premiumFilter: 'all', sortOption: 'newest' }, 'user_1');
      expect(result.length).toBe(1);
      expect(result[0]._id).toBe('1');
    });

    it('should sort by price correctly', () => {
      const result = CourseRepository.getFilteredAndSortedCourses(mockCourses, { searchQuery: '', isEnrolledFilter: false, premiumFilter: 'all', sortOption: 'price_asc' });
      expect(result[0]._id).toBe('2'); // Price 0
      expect(result[1]._id).toBe('3'); // Price 20
      expect(result[2]._id).toBe('1'); // Price 50
    });
  });
});
