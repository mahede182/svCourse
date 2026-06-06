import { AuthProvider, RealmProvider, StoreProvider, ThemeProvider, useAuth } from '@/src/providers';
import { OfflineBanner } from '@/src/shared/components/OfflineBanner';
import { SplashScreen } from '@/src/shared/components/SplashScreen';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import 'react-native-url-polyfill/auto';
import { KeyboardProvider } from '../providers/KeyboardProvider';

ExpoSplashScreen.preventAutoHideAsync().catch(() => { });

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
    <SplashScreen isReady={isInitialized}>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f8fafc' } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="course/[id]" />
      </Stack>
    </SplashScreen>
  );
}

export default function RootLayout() {
  return (
    <StoreProvider>
      <KeyboardProvider>
        <ThemeProvider>
          <RealmProvider>
            <AuthProvider>
              <RootLayoutNav />
              <Toast />
            </AuthProvider>
          </RealmProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </StoreProvider>
  );
}
