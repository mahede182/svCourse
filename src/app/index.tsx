import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery, useRealm } from '@realm/react';

import { CourseModel, useGetCoursesQuery, setRealmInstance } from '@/src/features/courses';

const CourseCard = React.memo(({ item }: { item: CourseModel }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.courseDescription}
      </Text>
      {item.is_enrolled && (
        <View style={styles.enrolledBadge}>
          <Text style={styles.enrolledText}>Enrolled</Text>
        </View>
      )}
    </View>
  );
});

CourseCard.displayName = 'CourseCard';

export default function HomeScreen() {
  const realm = useRealm();
  const courses = useQuery(CourseModel);

  useEffect(() => {
    setRealmInstance(realm);
  }, [realm]);

  const { isFetching, error } = useGetCoursesQuery();

  return (
    <View style={styles.container}>
      <FlatList
        data={Array.from(courses)}
        renderItem={({ item }) => <CourseCard item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>Courses</Text>
            {isFetching && <ActivityIndicator size="small" color="#818cf8" />}
          </View>
        }
        ListEmptyComponent={
          isFetching ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#818cf8" />
            </View>
          ) : (
            <Text style={styles.emptyText}>
              {error ? `Sync failed — showing cached data` : 'No courses found.'}
            </Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 60,
    paddingHorizontal: 20,
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
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  enrolledBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#312e81',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  enrolledText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a5b4fc',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
