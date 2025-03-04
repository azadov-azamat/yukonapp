import { RelativePathString, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import CustomHeader from "@/components/custom/header";

export default function NotificationsLayout() {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
					animation: "slide_from_left"
        }}
      />
      <Stack.Screen
        name="config"
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              title={t ("pages.notifications")}
              goToRoute={"/notifications" as RelativePathString}
            />
          ),
        }}
      />
    </Stack>
  );
}
