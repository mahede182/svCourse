import { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import 'react-native-url-polyfill/auto';

import { OfflineBanner } from '@/src/shared/components/OfflineBanner';
import { RealmProvider, StoreProvider, AuthProvider, useAuth } from '@/src/providers';

// The navigation logic must be inside the AuthProvider so it can access useAuth
function RootLayoutNav() {
  const { session, isInitialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, isInitialized, segments, router]);

  return (
    <>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f8fafc' } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="course/[id]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <StoreProvider>
      <RealmProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </RealmProvider>
    </StoreProvider>
  );
}
