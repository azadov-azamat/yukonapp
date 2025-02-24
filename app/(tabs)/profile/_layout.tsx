import { RelativePathString, Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Appbar } from 'react-native-paper';

const CustomHeader = ({ title, goToRoute, rightComponent }: { title: string, goToRoute: string, rightComponent?: React.ReactNode }) => {
  const router = useRouter();

  return (
    <Appbar.Header className="flex-row justify-between px-3 bg-transparent">
      <Appbar.BackAction onPress={() => router.replace(goToRoute as RelativePathString)} />
      {/* <Appbar.Content title={title} /> */}
      {/*<Appbar.Action icon="dots-vertical" onPress={() => router.replace(goToRoute)} />*/}
      {rightComponent}
    </Appbar.Header>
  )
}

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
              title={t ("pages.my-ads")}
              goToRoute={"/profile" as RelativePathString} // Navigate back to Profile
            />
          ),
        }}
      />
    </Stack>
  );
}
