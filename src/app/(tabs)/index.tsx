import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, SPACING, BORDER_RADIUS, SHADOWS } from '@/src/shared/constants/theme';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

export default function DashboardScreen() {
  const { colors: COLORS } = useAppTheme();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, User</Text>
          <Text style={styles.subtitle}>Let's learn something new today!</Text>
        </View>
        <Pressable style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          <View style={styles.notificationBadge} />
        </Pressable>
      </View>

      <View style={styles.bannerContainer}>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>Get 50% Off Premium</Text>
          <Text style={styles.bannerSubtitle}>Unlock all courses and AI summaries instantly.</Text>
          <Pressable style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Upgrade Now</Text>
          </Pressable>
        </View>
        <Ionicons name="star" size={80} color="rgba(255,255,255,0.2)" style={styles.bannerIcon} />
      </View>

      <Text style={styles.sectionTitle}>Continue Learning</Text>
      <Pressable style={styles.continueCard} onPress={() => router.push('/(tabs)/courses')}>
        <View style={styles.continueIconContainer}>
          <Ionicons name="logo-react" size={32} color="#ffffff" />
        </View>
        <View style={styles.continueContent}>
          <Text style={styles.continueTitle}>React Native Crash Course</Text>
          <Text style={styles.continueSubtitle}>Module 3: Navigation</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '63%' }]} />
            </View>
            <Text style={styles.progressText}>63%</Text>
          </View>
        </View>
        <Ionicons name="play-circle" size={32} color={COLORS.primary} style={styles.playIcon} />
      </Pressable>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Featured Course</Text>
        <Text style={styles.seeAll} onPress={() => router.push('/(tabs)/courses')}>See All</Text>
      </View>
      <Pressable style={styles.featuredCard} onPress={() => router.push('/(tabs)/courses')}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
          style={styles.featuredImage}
          contentFit="cover"
        />
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>BEST SELLER</Text>
        </View>
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>Fullstack Web Development</Text>
          <Text style={styles.featuredSubtitle}>Master frontend and backend engineering from scratch.</Text>
          <View style={styles.featuredFooter}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={COLORS.warning} />
              <Text style={styles.ratingText}>4.9 (1.2k reviews)</Text>
            </View>
            <Text style={styles.priceText}>Free</Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Explore Topics</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>
      <View style={styles.topicsGrid}>
        {[
          { id: '1', title: 'Business', icon: 'briefcase', color: COLORS.business },
          { id: '2', title: 'Design', icon: 'color-palette', color: COLORS.design },
          { id: '3', title: 'Coding', icon: 'code-slash', color: COLORS.primary },
          { id: '4', title: 'Finance', icon: 'cash', color: COLORS.finance },
        ].map((topic) => (
          <View key={topic.id} style={styles.topicItem}>
            <View style={[styles.topicIconContainer, { backgroundColor: `${topic.color}15` }]}>
              <Ionicons name={topic.icon as any} size={28} color={topic.color} />
            </View>
            <Text style={styles.topicTitle}>{topic.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const createStyles = (COLORS: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  notificationBtn: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.pill,
    ...SHADOWS.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  bannerContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.md,
  },
  bannerTextContainer: {
    flex: 1,
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  bannerBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.pill,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  bannerIcon: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    zIndex: 1,
    transform: [{ rotate: '15deg' }],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  seeAll: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  continueCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
    borderCurve: 'continuous',
  },
  continueIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  continueSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.pill,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.pill,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  playIcon: {
    marginLeft: SPACING.sm,
  },
  featuredCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
    borderCurve: 'continuous',
  },
  featuredImage: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.border,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  featuredBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  featuredContent: {
    padding: SPACING.md,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.success,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  topicItem: {
    width: '22%',
    alignItems: 'center',
  },
  topicIconContainer: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  topicTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});
