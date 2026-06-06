import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CourseModel } from '@/src/features/courses';
import { AppColors, SPACING, BORDER_RADIUS, SHADOWS } from '@/src/shared/constants/theme';
import { DEFAULT_COURSE_IMAGE } from '@/src/shared/constants/url';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

interface CourseCardProps {
  item: CourseModel;
  userId: string | undefined;
}

export const CourseCard = React.memo(({ item, userId }: CourseCardProps) => {
  const { colors: COLORS } = useAppTheme();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
  const isEnrolled = userId ? item.enrolledUsers.includes(userId) : false;

  return (
    <Link href={`/course/${item._id}` as any} asChild>
      <Pressable style={styles.card}>
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: DEFAULT_COURSE_IMAGE }}
            style={styles.cardImage}
            contentFit="cover"
            transition={200}
          />
          {isEnrolled && (
            <View style={styles.enrolledBadge}>
              <Text style={styles.enrolledText}>Enrolled</Text>
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.descriptionShort || 'No description available.'}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={COLORS.warning} />
              <Text style={styles.ratingText}>{item.rating?.toFixed(1) || '0.0'}</Text>
            </View>
            <Text style={styles.priceText}>{item.priceUsd === 0 ? 'Free' : `$${item.priceUsd}`}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
});

CourseCard.displayName = 'CourseCard';

const createStyles = (COLORS: AppColors) => StyleSheet.create({
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
});
