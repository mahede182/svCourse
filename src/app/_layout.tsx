import 'react-native-url-polyfill/auto';
import { Slot } from 'expo-router';
import { RealmProvider } from '@/src/providers';

export default function RootLayout() {
  return (
    <RealmProvider>
      <Slot />
    </RealmProvider>
  );
}
