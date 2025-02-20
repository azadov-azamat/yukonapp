import React, { useEffect, useState } from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/tab-bar-icon';
import { Colors } from '@/utils/colors';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getUserMe } from '@/redux/reducers/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { auth, user } = useAppSelector(state => state.auth);
  const pathname = usePathname();
  const isTabHidden = pathname.startsWith("/profile/");

  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // Fetch user ID from AsyncStorage if Redux state is empty
  async function getLocalstorageData() {
    try {
      const authData = await AsyncStorage.getItem('authenticate');
      if (authData) {
        const { userId } = JSON.parse(authData);
        return userId;
      }
    } catch (error) {
      console.error("Error fetching auth data:", error);
    }
    return null;
  }

  // Check if the user is logged in and redirect if necessary
  useEffect(() => {
    if (isNavigationReady && !user) {
      router.replace("/auth"); // Redirect to auth page if the user is not authenticated
    }
  }, [user, isNavigationReady]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await getLocalstorageData();

      if (userId || auth?.userId) {
        try {
          await dispatch(getUserMe(auth?.userId || userId));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        router.replace("/auth"); // Redirect to login if no user ID is found
      }
      setIsNavigationReady(true);
    };

    fetchUserData();
  }, [auth]);

  // Show a loading screen while authentication is being checked
  if (!isNavigationReady) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors['light'].tint,
        tabBarInactiveTintColor: Colors['light'].tint,
        headerStyle: {
          elevation: 0, // Remove shadow for Android
          shadowOpacity: 0, // Remove shadow for iOS
        },
				tabBarLabelStyle: {
					// paddingTop: 100,
				},
        tabBarStyle: {
          height: 60,
          display: isTabHidden ? 'none' : 'flex', // Hide tabs for profile children
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('pages.main'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon size={24} name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        initialParams={{ arrival: '', departure: '' }}
        options={{
          title: t('search'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon size={24} name={focused ? "search" : "search-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('pages.profile'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon size={24} name={focused ? "person" : "person-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
