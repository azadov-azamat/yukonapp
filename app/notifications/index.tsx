import NotificationsScreen from "@/components/screen/NotificationsScreen";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RelativePathString, router, Stack } from "expo-router";
import CustomHeader from "@/components/custom/header";
import { useTranslation } from "react-i18next";
import { IconButton } from "react-native-paper";

export default function NotificationsPage() {
	const { t } = useTranslation();

	const navigateToConfig = () => {
    router.push('/notifications/config');
  };

  return (
		<SafeAreaProvider style={{ flex: 1 }}>
			<Stack.Screen
				options={{
					headerShown: true,
					header: () => (
						<CustomHeader
							title={t ("pages.notifications")}
							goToRoute={"(tabs)" as RelativePathString}
							rightComponent={
                <IconButton
                  icon="cog"
                  size={24}
                  onPress={navigateToConfig}
                />
              }
							headerStyle={{
								height: 50,
							}}
						/>
					),
				}}
			/>

      <View style={{ flex: 1 }}>
				<NotificationsScreen />
			</View>
		</SafeAreaProvider>
	);
}
