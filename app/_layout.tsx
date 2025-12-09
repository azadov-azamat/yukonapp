import React, { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
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

import { configureForegroundHandling, registerForPushAsync, addNotificationListeners, getLastResponse } from '../utils/notifications';

import * as Linking from "expo-linking";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://3d1313a2655a8a7a407523879cc9faf4@o530575.ingest.us.sentry.io/4510118569181184',
  
  debug: false,  
  enableLogs: true,
  // beforeSend(event, hint) {
  //   // console.log(event, hint);
  //   return event;
  // },
  // beforeBreadcrumb(breadcrumb, hint) {
  //   // console.log(breadcrumb, hint);
  //   return breadcrumb;
  // },
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
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

  React.useEffect(() => {
    configureForegroundHandling();              // foreground xulq-atvor
    (async () => {
      const token = await registerForPushAsync("355249bb-7f55-452a-80b0-81a49689458f");
      console.log("token", token)
      // token-ni backendga yuborib saqlab qo‘ying
      const last = await getLastResponse();
      console.log("last", last)
      // agar cold start bosilgan notifikatsiyadan bo‘lsa, shu yerda navigatsiya qiling
    })();
    
    const unsubscribe = addNotificationListeners(
      (n) => { 
        console.log(' =============== n =============== ', n)
      },
      (r) => { 
        console.log(" =============== r =============== ", r)
       },
    );
    
    return unsubscribe;
    
  }, []);
  
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

export default Sentry.wrap(function RootLayout() {
  
  // Sentry.showFeedbackWidget();
  // Sentry.hideFeedbackButton();

  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ReduxProvider>
  );
});