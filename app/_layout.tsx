import React, { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StatusBar, Platform } from "react-native";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getUserMe } from '@/redux/reducers/auth';
import Toast from 'react-native-toast-message';
import { NativeWindStyleSheet } from "nativewind";
import '@/utils/i18n';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { Provider as PaperProvider, ActivityIndicator } from "react-native-paper";
import { ThemeProvider, useTheme } from "@/config/ThemeContext"; // ✅ Import the Theme Context
import { BottomSheetProvider } from "@/hooks/context/bottom-sheet";

NativeWindStyleSheet.setOutput({
  default: "native",
});

function App() {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state) => state.auth);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let userId = auth?.userId;

        if (!userId) {
          const authData = await AsyncStorage.getItem("authenticate");
          if (authData) {
            userId = JSON.parse(authData).userId;
          }
        }

        if (userId) {
          const res = await dispatch(getUserMe(userId));
          setIsAuthenticated(res.type === "auth/getUserMe/fulfilled");
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error in auth check:", error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, [auth]);

  if (isAuthLoading) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 pb-[20px] ios:pb-5 bg-[#f7f7f7] dark:bg-black">
              <View className="items-center justify-center flex-1">
                <ActivityIndicator size="large" color={theme?.colors.primary} />
              </View>
            </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1, zIndex: 1000000 }}>
        <BottomSheetModalProvider>
          <BottomSheetProvider>
						<View style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? 10 : 0, backgroundColor: 'white' }}>
							<Stack screenOptions={{ headerShown: false }}>
								{isAuthenticated ? (
									<Stack.Screen name="(tabs)" />
								) : (
									<Stack.Screen name="auth" />
								)}
							</Stack>
							<StatusBar
								translucent
								barStyle={isDarkMode ? "light-content" : "dark-content"}
								backgroundColor={'transparent'}
							/>
							<Toast />
						</View>
          </BottomSheetProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ReduxProvider>
  );
}
