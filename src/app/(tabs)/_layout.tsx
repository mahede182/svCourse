import React, { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { COLORS } from '@/src/shared/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/providers';
import { useQuery } from '@realm/react';
import { CourseModel } from '@/src/features/courses';

export default function TabsLayout() {
  const { user } = useAuth();
  const courses = useQuery(CourseModel);
  const favouriteCount = useMemo(() => {
    if (!user) return 0;
    return courses.filtered('favouritedUsers CONTAINS $0', user.id).length;
  }, [courses, user]);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          title: 'Favourite',
          tabBarBadge: favouriteCount > 0 ? favouriteCount : undefined,
          tabBarBadgeStyle: { backgroundColor: COLORS.error, color: '#fff' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
