import { AppActivityIndicator } from '@/src/shared/components/AppActivityIndicator';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useRealm } from '@realm/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { CourseModel, CourseRepository, setRealmInstance, useGetCoursesQuery } from '@/src/features/courses';
import { useAuth } from '@/src/providers';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '@/src/shared/constants/theme';
import { useDebounce } from '@/src/shared/hooks/useDebounce';
import { setPremiumFilter, setSearchQuery, setSortOption, toggleEnrolledFilter, useAppDispatch, useAppSelector } from '@/src/store';

import { CourseCard } from '@/src/shared/components/CourseCard';

export default function CoursesScreen() {
  const realm = useRealm();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const { searchQuery, isEnrolledFilter, premiumFilter, sortOption } = useAppSelector((state) => state.course);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isSearchVisible, setIsSearchVisible] = useState(!!searchQuery);
  const [activeDropdown, setActiveDropdown] = useState<'sort' | 'premium' | null>(null);
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
    return CourseRepository.getFilteredAndSortedCourses(
      baseCourses,
      { searchQuery, isEnrolledFilter, premiumFilter, sortOption },
      user?.id
    );
  }, [baseCourses, searchQuery, isEnrolledFilter, premiumFilter, sortOption, user]);

  const enrolledCount = useMemo(() => {
    if (!user) return 0;
    return baseCourses.filtered('enrolledUsers CONTAINS $0', user.id).length;
  }, [baseCourses, user]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch().unwrap();
    } catch (err) {
      if (courses.length > 0) {
        Toast.show({
          type: 'error',
          text1: 'Sync Failed',
          text2: 'Unable to refresh courses. Showing cached data.',
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const lastSynced = useMemo(() => {
    if (baseCourses.length === 0) return null;
    const sorted = baseCourses.sorted('lastUpdated', true);
    return new Date(sorted[0].lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [baseCourses]);

  const sortLabels: Record<string, string> = {
    newest: 'Newest',
    rating_desc: 'Top Rated',
    price_asc: 'Price: Low to High'
  };

  const premiumLabels: Record<string, string> = {
    all: 'All Prices',
    premium: 'Premium',
    free: 'Free'
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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.heading}>Course</Text>
          {lastSynced && <Text style={[styles.syncText, { color: COLORS.primary }]}>Last synced: {lastSynced}</Text>}
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.dropdownBtnHeader} onPress={() => setActiveDropdown('sort')}>
            <Ionicons name="filter" size={14} color={COLORS.textSecondary} />
            <Text style={styles.dropdownBtnText} numberOfLines={1}>{sortLabels[sortOption]}</Text>
          </Pressable>
          <Pressable style={styles.dropdownBtnHeader} onPress={() => setActiveDropdown('premium')}>
            <Ionicons name="pricetag" size={14} color={COLORS.textSecondary} />
            <Text style={styles.dropdownBtnText} numberOfLines={1}>{premiumLabels[premiumFilter]}</Text>
          </Pressable>
          <Pressable style={styles.searchIconBtn} onPress={toggleSearch}>
            <Ionicons name="search" size={20} color={COLORS.text} />
          </Pressable>
        </View>
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
          <View style={styles.searchRow}>
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search courses..."
              placeholderTextColor={COLORS.textMuted}
              value={localSearch}
              onChangeText={setLocalSearch}
            />
          </View>
        </View>
      )}

      {activeDropdown && (
        <Modal transparent visible animationType="fade" onRequestClose={() => setActiveDropdown(null)}>
          <Pressable style={styles.modalOverlay} onPress={() => setActiveDropdown(null)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{activeDropdown === 'sort' ? 'Sort By' : 'Filter Price'}</Text>

              {activeDropdown === 'sort' && Object.entries(sortLabels).map(([val, label]) => (
                <Pressable key={val} style={styles.modalOption} onPress={() => { dispatch(setSortOption(val as any)); setActiveDropdown(null); }}>
                  <Text style={[styles.modalOptionText, sortOption === val && styles.modalOptionTextActive]}>{label}</Text>
                  {sortOption === val && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                </Pressable>
              ))}

              {activeDropdown === 'premium' && Object.entries(premiumLabels).map(([val, label]) => (
                <Pressable key={val} style={styles.modalOption} onPress={() => { dispatch(setPremiumFilter(val as any)); setActiveDropdown(null); }}>
                  <Text style={[styles.modalOptionText, premiumFilter === val && styles.modalOptionTextActive]}>{label}</Text>
                  {premiumFilter === val && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}

      <FlatList
        data={Array.from(courses)}
        renderItem={({ item }) => <CourseCard item={item} userId={user?.id} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          isFetching && !isRefreshing ? (
            <View style={styles.center}>
              <AppActivityIndicator size="large" />
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cloud-offline-outline" size={64} color={COLORS.textMuted} style={{ marginBottom: 16 }} />
              <Text style={styles.emptyTitle}>Connection Failed</Text>
              <Text style={styles.emptyText}>
                No internet connection and no cached data available. Please check your network and try again.
              </Text>
              <Pressable style={styles.retryBtn} onPress={onRefresh}>
                <Text style={styles.retryBtnText}>Retry Connection</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Courses Found</Text>
              <Text style={styles.emptyText}>
                No courses match your current filters.
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
    paddingTop: 40,
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
  syncText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  searchIconBtn: {
    padding: 8,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.pill,
    ...SHADOWS.sm,
  },
  headerTitleContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dropdownBtnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 8,
    paddingVertical: 8,
    ...SHADOWS.sm,
    gap: 4,
    maxWidth: 90,
  },
  filterSection: {
    marginBottom: SPACING.sm,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownBtnText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
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
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.pill,
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
