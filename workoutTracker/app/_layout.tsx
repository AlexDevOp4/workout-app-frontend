import { Stack } from "expo-router";
import { UserProvider } from "./UserContext";
export default function RootLayout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(pages)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/workouts" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
