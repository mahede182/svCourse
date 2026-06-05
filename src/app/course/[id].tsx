import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useObject, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { CourseModel, CourseRepository } from '@/src/features/courses';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/src/shared/constants/theme';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const realm = useRealm();
  const course = useObject(CourseModel, id);
  const [activeTab, setActiveTab] = useState<'details' | 'lessons'>('details');

  if (!course) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Course not found.</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const toggleEnrollment = () => {
    CourseRepository.toggleEnrollment(realm, id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerOverlay}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: course.coverImageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
          style={styles.coverImage}
          contentFit="cover"
          transition={300}
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.title} selectable>{course.title}</Text>
          
          <View style={styles.instructorRow}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={16} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.instructorName}>Jaxson Culhane</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="document-text-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.statText}>24 Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.statText}>8h 24m</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color={COLORS.warning} />
              <Text style={styles.statText}>4.4/5</Text>
            </View>
          </View>

          {course.is_enrolled && (
            <View style={styles.progressContainer}>
              <View style={styles.progressRow}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '20%' }]} />
                </View>
                <Text style={styles.progressText}>20%</Text>
              </View>
            </View>
          )}

          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, activeTab === 'details' && styles.tabActive]}
              onPress={() => setActiveTab('details')}
            >
              <Text style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>Details</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'lessons' && styles.tabActive]}
              onPress={() => setActiveTab('lessons')}
            >
              <Text style={[styles.tabText, activeTab === 'lessons' && styles.tabTextActive]}>Lessons</Text>
            </Pressable>
          </View>

          {activeTab === 'details' ? (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description} selectable>
                {course.courseDescription || 'No description provided for this course. It covers the fundamentals and practical applications.'}
              </Text>
              <Text style={styles.readMore}>Show all</Text>
            </View>
          ) : (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Course Syllabus</Text>
              {[1, 2, 3].map((num) => (
                <View key={num} style={styles.moduleItem}>
                  <Text style={styles.moduleTitle}>Module {num} Introduction</Text>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>Free</Text>
        </View>
        <Pressable
          style={[styles.button, course.is_enrolled ? styles.buttonUnenroll : styles.buttonEnroll]}
          onPress={toggleEnrollment}
        >
          <Text style={[styles.buttonText, course.is_enrolled && styles.buttonTextUnenroll]}>
            {course.is_enrolled ? 'Unenroll' : 'Enroll Now'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
  },
  backButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  coverImage: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.border,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    letterSpacing: -0.5,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  instructorName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: SPACING.lg,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.pill,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.pill,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.pill,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.pill,
  },
  tabActive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.text,
  },
  tabContent: {
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  readMore: {
    color: COLORS.error,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  moduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  button: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonEnroll: {
    backgroundColor: COLORS.primary,
  },
  buttonUnenroll: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextUnenroll: {
    color: COLORS.textSecondary,
  },
});
