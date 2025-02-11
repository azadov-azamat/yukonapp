import React, { useEffect, useState } from "react";
import {Provider} from 'react-redux';
import { store } from "@/redux/store";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image, StatusBar, View, ActivityIndicator, Platform } from "react-native";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getUserMe } from '@/redux/reducers/auth';
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import { NativeWindStyleSheet } from "nativewind";
import '@/utils/i18n';

NativeWindStyleSheet.setOutput({
  default: "native",
});

function App() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { auth } = useAppSelector((state) => state.auth);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Tracks auth loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks auth status

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let userId = auth?.userId;

        // Check AsyncStorage if Redux auth state is empty
        if (!userId) {
          const authData = await AsyncStorage.getItem("authenticate");
          if (authData) {
            userId = JSON.parse(authData).userId;
          }
        }

        if (userId) {
          const res = await dispatch(getUserMe(userId));
          if (res.type === "auth/getUserMe/fulfilled") {
            setIsAuthenticated(true); // Authenticated
          } else {
            setIsAuthenticated(false); // Not authenticated
          }
        } else {
          setIsAuthenticated(false); // Not authenticated
        }
      } catch (error) {
        console.error("Error in auth check:", error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false); // Auth check complete
      }
    };

    checkAuth();
  }, [auth]);

  if (isAuthLoading) {
    // Show a loading indicator while authentication logic is in progress
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {isAuthenticated ? (
            <Stack.Screen name="(tabs)" /> // Show main tabs for authenticated users
          ) : (
            <Stack.Screen name="auth" /> // Show auth screens for unauthenticated users
          )}
        </Stack>

        <StatusBar
          barStyle="dark-content"
          backgroundColor="white"
        />
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#fff', // '#f7f7f7'
			paddingBottom: Platform.OS === 'android' ? 0 : 20,
    },
    loaderContainer: {
      flex: 1, // Takes full height
      justifyContent: "center", // Centers vertically
      alignItems: "center", // Centers horizontally
    },
  });

export default function RootLayout() {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  );
}
