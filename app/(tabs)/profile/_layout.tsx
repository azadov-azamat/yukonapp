import { RelativePathString, Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Appbar } from 'react-native-paper';

const CustomHeader = ({ title, goToRoute }) => {
  const router = useRouter();

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={() => router.replace(goToRoute)} />
      <Appbar.Content title={title} />
      <Appbar.Action icon="dots-vertical" onPress={() => router.replace(goToRoute)} />
    </Appbar.Header>
  )
}

export default function ProfileLayout() {
  const { t } = useTranslation();
  return (
    <Stack screenOptions={{ headerShown: false }}>
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
    </Stack>
  );
}
