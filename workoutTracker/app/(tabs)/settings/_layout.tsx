import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="progresstracker" />
      <Stack.Screen name="workout-history" />
      <Stack.Screen name="profilepage" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
