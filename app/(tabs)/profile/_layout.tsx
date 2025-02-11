import { Stack } from "expo-router";
import { CustomHeader } from "@/components/custom";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* Main profile screen */}
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <CustomHeader
              title="Profile"
              goToRoute="/" // Navigate to Main tab
            />
          ),
        }}
      />
      {/* Bookmarks subroute */}
      <Stack.Screen
        name="bookmarks"
        options={{
          header: () => (
            <CustomHeader
              title="Bookmarks"
              goToRoute="/profile" // Navigate back to Profile
            />
          ),
        }}
      />
    </Stack>
  );
}
