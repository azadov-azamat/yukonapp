import { RelativePathString, Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import CustomHeader from "@/components/custom/header";

export default function ProfileLayout() {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* Main profile screen */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false
        }}
      />

      {/* Bookmarks subroute */}
      <Stack.Screen
        name="bookmarks"
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              title={t ("pages.bookmarks")}
              goToRoute={"/profile" as RelativePathString}
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
    {/* my-ads subroute */}
      <Stack.Screen
        name="my-ads"
        options={{
          header: () => (
            <CustomHeader
              title={t ("profile.my-ads")}
              goToRoute={"/profile" as RelativePathString} // Navigate back to Profile
            />
          ),
        }}
      />
      
      {/* help subroute */}
      <Stack.Screen
        name="help"
        options={{
          header: () => (
            <CustomHeader
              title={t ("profile.help")}
              goToRoute={"/profile" as RelativePathString} // Navigate back to Profile
            />
          ),
        }}
      />
    </Stack>
  );
}
