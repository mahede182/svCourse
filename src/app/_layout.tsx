import { OfflineBanner } from '@/src/shared/components/OfflineBanner';
import { RealmProvider, StoreProvider } from '@/src/providers';
import { Slot } from 'expo-router';
import 'react-native-url-polyfill/auto';

export default function RootLayout() {
  return (
    <StoreProvider>
      <RealmProvider>
        <OfflineBanner />
        <Slot />
      </RealmProvider>
    </StoreProvider>
  );
}
