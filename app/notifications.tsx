import NotificationsScreen from "@/components/screen/NotificationsScreen";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { RelativePathString, Stack } from "expo-router";
import CustomHeader from "@/components/custom/header";
import { useTranslation } from "react-i18next";

export default function NotificationsPage() {
	// const insets = useSafeAreaInsets();r
	const { t } = useTranslation();

  return (
		<SafeAreaProvider style={{ flex: 1 }}>
			<Stack.Screen
				options={{
					headerShown: true,
					header: () => (
						<CustomHeader
							title={t ("pages.notifications")}
							goToRoute={"(tabs)" as RelativePathString}
						/>
					),
				}}
			/>

      {/* <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right}}> */}
      <View style={{ flex: 1 }}>
				<NotificationsScreen />
			</View>
		</SafeAreaProvider>
	);
}
