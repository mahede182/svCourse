import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useQuery, useRealm } from '@realm/react';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { CourseModel, useGetCoursesQuery, setRealmInstance } from '@/src/features/courses';
import { useAppDispatch, useAppSelector, setSearchQuery, toggleEnrolledFilter } from '@/src/store';
import { useDebounce } from '@/src/shared/hooks/useDebounce';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/src/shared/constants/theme';

const CourseCard = React.memo(({ item }: { item: CourseModel }) => {
  return (
    <Link href={`/course/${item._id}` as any} asChild>
      <Pressable style={styles.card}>
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: item.coverImageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
            style={styles.cardImage}
            contentFit="cover"
            transition={200}
          />
          {item.is_enrolled && (
            <View style={styles.enrolledBadge}>
              <Text style={styles.enrolledText}>Enrolled</Text>
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.courseDescription || 'No description available.'}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={COLORS.warning} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
            <Text style={styles.priceText}>Free</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
});

CourseCard.displayName = 'CourseCard';

export default function CoursesScreen() {
  const realm = useRealm();
  const dispatch = useAppDispatch();
  
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
      result = result.filtered('title CONTAINS[c] $0 OR courseDescription CONTAINS[c] $0', searchQuery);
    }
    
    if (isEnrolledFilter) {
      result = result.filtered('is_enrolled == true');
    }

    if (sortOption === 'title_asc') {
      result = result.sorted('title', false);
    } else if (sortOption === 'title_desc') {
      result = result.sorted('title', true);
    } else {
      result = result.sorted('title', false);
    }

    return result;
  }, [baseCourses, searchQuery, isEnrolledFilter, sortOption]);

  const onRefresh = () => {
    refetch();
  };

  const toggleSearch = () => {
    setIsSearchVisible((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      } else {
        setLocalSearch(''); // Clear search when closing
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
            <Text style={[styles.chipText, isEnrolledFilter && styles.chipTextActive]}>Enrolled</Text>
          </Pressable>
          {['Design', 'Coding', 'Finance', 'Business'].map(category => (
            <Pressable key={category} style={styles.chip}>
              <Text style={styles.chipText}>{category}</Text>
            </Pressable>
          ))}
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
        renderItem={({ item }) => <CourseCard item={item} />}
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
    borderCurve: 'continuous',
  },
  cardImageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.border,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  enrolledBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  enrolledText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  cardContent: {
    padding: SPACING.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.success,
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
