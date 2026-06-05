import 'react-native-url-polyfill/auto';
import { Slot } from 'expo-router';

/**
 * Root layout component that renders the active route's slot.
 *
 * @returns A React element that hosts the routed child content via `<Slot />`.
 */
export default function RootLayout() {
  return <Slot />;
}
