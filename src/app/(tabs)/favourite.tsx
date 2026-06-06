import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@realm/react';
import { CourseModel } from '@/src/features/courses';
import { CourseCard } from '@/src/shared/components/CourseCard';
import { useAuth } from '@/src/providers';
import { AppColors, SPACING } from '@/src/shared/constants/theme';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

export default function FavouriteScreen() {
  const { colors: COLORS } = useAppTheme();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
  const { user } = useAuth();
  const baseCourses = useQuery(CourseModel);

  const favouriteCourses = useMemo(() => {
    if (!user) return [];
    return baseCourses.filtered('favouritedUsers CONTAINS $0', user.id);
  }, [baseCourses, user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Favourites</Text>
      </View>

      <FlatList
        data={Array.from(favouriteCourses)}
        renderItem={({ item }) => <CourseCard item={item} userId={user?.id} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={favouriteCourses.length === 0 ? styles.emptyListContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart-outline" size={64} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptySubtitle}>
              Courses you favourite will appear here. Start exploring and save the ones you like!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const createStyles = (COLORS: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100, 
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
