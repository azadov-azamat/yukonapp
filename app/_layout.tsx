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

import * as Linking from "expo-linking";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://3d1313a2655a8a7a407523879cc9faf4@o530575.ingest.us.sentry.io/4510118569181184',
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  debug: true,            // yoki true

  // Enable Logs
  // enableLogs: true,

  integrations: [
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      styles: {
        submitButton: {
          backgroundColor: "#6a1b9a",
        },
      },
      namePlaceholder: "Fullname",
      isNameRequired: true,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  // integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

NativeWindStyleSheet.setOutput({
  default: "native",
});

function App() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { auth } = useAppSelector((state) => state.auth);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      // console.log("Deep link keldi:", url);
      const parsed = Linking.parse(url);
      console.log(parsed); // { scheme: 'yukon.uz.app', path: 'tg-login', queryParams: { ... } }
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        // console.log("Cold start deep link:", url);
      }
    });

    return () => sub.remove();
  }, []);
  
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
          if (res.type === "auth/getUserMe/fulfilled") {
            setIsAuthenticated(true);
            router.push("/(tabs)"); //causes Error with navigation
          } else {
            setIsAuthenticated(false);
          }
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

  useEffect(() => {}, [isAuthenticated]);

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
									<Stack.Screen name="(tabs)" options={{ animation: "slide_from_left" }} />
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

Sentry.showFeedbackWidget();
Sentry.hideFeedbackButton();

export default Sentry.wrap(function RootLayout() {
  return (
    // <View className="w-auto h-auto max-w-[400px] flex justify-center">
    // </View>
    <ReduxProvider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ReduxProvider>
  );
});