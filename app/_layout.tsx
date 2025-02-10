// import React from "react";
// import { Stack, useRouter } from "expo-router";
// import {Provider} from 'react-redux';
// import { store } from "@/redux/store";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { SafeAreaView, StyleSheet, Image, StatusBar, View, Text, TouchableOpacity } from "react-native";
// import { NativeWindStyleSheet } from "nativewind";
// import Toast from 'react-native-toast-message';
// import '@/utils/i18n';
// import { useTranslation } from "react-i18next";
// import { Ionicons } from "@expo/vector-icons";

// NativeWindStyleSheet.setOutput({
//   default: "native",
// });

// function App() {
//   const {t} = useTranslation();
//   const router = useRouter()

//   const styles = StyleSheet.create({
//     safeArea: {
//       flex: 1,
//       backgroundColor: '#f7f7f7',
//     },
//   });

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.safeArea}>
//           <Stack screenOptions={{
//               // header: () => {
//               //   return null;
//               // },
//             }}
//             initialRouteName="index"
//           >
//             <Stack.Screen name="index" options={{ headerShown: false, title: 'Home' }} />
//             <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//             <Stack.Screen name="auth/login" options={{ headerShown: false }} />
//             <Stack.Screen name="profile/bookmarks" options={{ headerShown: true, title: t ('pages.bookmarks')}} />
//             <Stack.Screen name="forgot-password" options={{ headerShown: false, title: 'Forgot password' }} />
//             <Stack.Screen name="subscription/[id]" options={{
//                 headerShown: true,
//                 title: t('pages.payment'),
//                 header: () => {
//                   return (
//                     <TouchableOpacity onPress={() => router.back()} className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between flex-1 px-4 bg-white h-14">
//                         <View className="flex-row items-center space-x-2">
//                             <Ionicons name="arrow-back" size={22}/>
//                             <Text className="text-xl font-bold">{t ('pages.payment')}</Text>
//                         </View>
//                         <Image
//                                 source={require("@/assets/images/pay-me.png")}
//                                 resizeMode="contain" // or 'cover', 'stretch', etc.
//                                 className="w-20 h-10"
//                         />
//                    </TouchableOpacity>
//                   );
//                 },
//               }}
//             />
//           </Stack>

//           <StatusBar
//             barStyle="dark-content"
//             backgroundColor="white"
//           />
//           <Toast />
//       </SafeAreaView>
//     </SafeAreaProvider>
//   )
// }

// export default function RootLayout() {
//   return (
//     <Provider store={store}>
//       <App/>
//     </Provider>
//   );
// }


import React, { useEffect, useState } from "react";
import {Provider} from 'react-redux';
import { store } from "@/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView, StyleSheet, Image, StatusBar, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
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
      <SafeAreaView style={styles.safeArea}>
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
      backgroundColor: '#f7f7f7',
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
