import { Redirect } from 'expo-router';

export default function Index() {
  // Simple redirect to the auth flow
  // You would normally check global state/context to see if the user is authenticated here
  return <Redirect href="/(auth)/sign-in" />;
}
