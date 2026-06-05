import { Ionicons } from '@expo/vector-icons';
import { useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CourseModel, setRealmInstance, useGetCoursesQuery } from '@/src/features/courses';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '@/src/shared/constants/theme';
import { DEFAULT_COURSE_IMAGE } from '@/src/shared/constants/url';
import { useDebounce } from '@/src/shared/hooks/useDebounce';
import { setSearchQuery, toggleEnrolledFilter, useAppDispatch, useAppSelector } from '@/src/store';
import { useAuth } from '@/src/providers';

import { CourseCard } from '@/src/shared/components/CourseCard';

export default function CoursesScreen() {
  const realm = useRealm();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  const { searchQuery, isEnrolledFilter, sortOption } = useAppSelector((state) => state.ui);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isSearchVisible, setIsSearchVisible] = useState(!!searchQuery);
  const searchInputRef = useRef<TextInput>(null);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    setRealmInstance(realm);
  }, [realm]);

  const { isFetching, error, refetch } = useGetCoursesQuery();

  const baseCourses = useQuery(CourseModel);
  
  const courses = useMemo(() => {
    let result = baseCourses;

    if (searchQuery) {
      result = result.filtered('title CONTAINS[c] $0 OR descriptionShort CONTAINS[c] $0', searchQuery);
    }
    
    if (isEnrolledFilter && user?.id) {
      result = result.filtered('enrolledUsers CONTAINS $0', user.id);
    }

    if (sortOption === 'title_asc') {
      result = result.sorted('title', false);
    } else if (sortOption === 'title_desc') {
      result = result.sorted('title', true);
    } else {
      result = result.sorted('title', false);
    }

    return result;
  }, [baseCourses, searchQuery, isEnrolledFilter, sortOption, user]);

  const enrolledCount = useMemo(() => {
    if (!user) return 0;
    return baseCourses.filtered('enrolledUsers CONTAINS $0', user.id).length;
  }, [baseCourses, user]);

  const onRefresh = () => {
    refetch();
  };

  const toggleSearch = () => {
    setIsSearchVisible((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      } else {
        setLocalSearch('');
      }
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Course</Text>
        <Pressable style={styles.searchIconBtn} onPress={toggleSearch}>
          <Ionicons name="search" size={24} color={COLORS.text} />
        </Pressable>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
          <Pressable
            style={[styles.chip, !isEnrolledFilter && styles.chipActive]}
            onPress={() => isEnrolledFilter && dispatch(toggleEnrolledFilter())}
          >
            <Text style={[styles.chipText, !isEnrolledFilter && styles.chipTextActive]}>All Course</Text>
          </Pressable>
          <Pressable
            style={[styles.chip, isEnrolledFilter && styles.chipActive]}
            onPress={() => !isEnrolledFilter && dispatch(toggleEnrolledFilter())}
          >
            <Text style={[styles.chipText, isEnrolledFilter && styles.chipTextActive]}>
              Enrolled {enrolledCount > 0 ? `(${enrolledCount})` : ''}
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor={COLORS.textMuted}
            value={localSearch}
            onChangeText={setLocalSearch}
          />
        </View>
      )}

      <FlatList
        data={Array.from(courses)}
        renderItem={({ item }) => <CourseCard item={item} userId={user?.id} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !!courses.length}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          isFetching ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {error ? `Sync failed — showing cached data` : 'No courses match your filters.'}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  searchIconBtn: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.pill,
    ...SHADOWS.sm,
  },
  filterSection: {
    marginBottom: SPACING.sm,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipsContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
