import { OfflineBanner } from '@/src/shared/components/OfflineBanner';
import { RealmProvider, StoreProvider } from '@/src/providers';
import { Stack } from 'expo-router/stack';
import 'react-native-url-polyfill/auto';

export default function RootLayout() {
  return (
    <StoreProvider>
      <RealmProvider>
        <OfflineBanner />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f8fafc' } }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="course/[id]" />
        </Stack>
      </RealmProvider>
    </StoreProvider>
  );
}
