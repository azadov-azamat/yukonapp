import { RelativePathString, Stack } from "expo-router";
import { CustomHeader } from "@/components/custom";
import { useTranslation } from "react-i18next";

export default function ProfileLayout() {
  const { t } = useTranslation();
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* Main profile screen */}
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <CustomHeader
              title={t ('pages.profile')}
              goToRoute={"/" as RelativePathString} // Navigate to Main tab
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
              title={t ("pages.bookmarks")}
              goToRoute={"/profile" as RelativePathString} // Navigate back to Profile
            />
          ),
        }}
      />
      {/* payment subroute */}
      <Stack.Screen
        name="payment/[id]"
        options={{
          header: () => (
            <CustomHeader
              title={t ("pages.payment")}
              goToRoute={"/profile" as RelativePathString} // Navigate back to Profile
            />
          ),
        }}
      />
      {/* subscriptions subroute */}
      <Stack.Screen
        name="subscriptions"
        options={{
          header: () => (
            <CustomHeader
              title={t ("pages.subscriptions")}
              goToRoute={"/profile" as RelativePathString} // Navigate back to Profile
            />
          ),
        }}
      />
    </Stack>
  );
}
