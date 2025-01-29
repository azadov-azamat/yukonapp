import React from "react";
import { Stack } from "expo-router";
import {Provider} from 'react-redux';
import { store } from "@/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { NativeWindStyleSheet } from "nativewind";
import Toast from 'react-native-toast-message';
import '@/utils/i18n';

NativeWindStyleSheet.setOutput({
  default: "native",
});

function App() {

  return (
    <SafeAreaProvider>
        <Stack screenOptions={{
          header: () => {
            return null;
          },
          }}
          initialRouteName="index"
        >
          <Stack.Screen name="index" options={{ headerShown: false, title: 'Home' }}/> 
          <Stack.Screen name="forgot-password" options={{ headerShown: false, title: 'Forgot password' }}/> 
          <Stack.Screen name="subscription" options={{ headerShown: false, title: 'Subscription' }}/> 
        </Stack>

        <StatusBar
          barStyle="dark-content"
          backgroundColor="white"
        />
        <Toast />
    </SafeAreaProvider>
  )
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  );
}
