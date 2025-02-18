import React, { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Platform, StatusBar } from "react-native";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getUserMe } from '@/redux/reducers/auth';
import Toast from 'react-native-toast-message';
import { NativeWindStyleSheet } from "nativewind";
import '@/utils/i18n';

import { Provider as PaperProvider, ActivityIndicator, MD2Colors } from "react-native-paper";
import { ThemeProvider, useTheme } from "@/config/ThemeContext"; // ✅ Import the Theme Context

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
          <SafeAreaView style={[styles.safeArea, { backgroundColor: theme?.colors?.background || '#f7f7f7' }]}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={theme?.colors.primary} />
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme?.colors?.background || '#f7f7f7' }]}>
          <Stack screenOptions={{ headerShown: false }}>
            {isAuthenticated ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="auth" />}
          </Stack>

          <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={theme?.colors.background}
          />
          <Toast />
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ReduxProvider>
  );
}
