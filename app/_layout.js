import { Stack } from 'expo-router/stack';

// export default function Layout() {
//   return <Stack />
// }

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="VideoSDK2" options={{ headerShown: false }} />
      <Stack.Screen name="Text" options={{ headerShown: false }} />
    </Stack>
  );
}
