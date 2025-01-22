import React from 'react';
import { Tabs } from 'expo-router';
// import { Platform } from 'react-native';
import { TabBarIcon } from '@/components/navigation/tab-bar-icon';
import { Colors } from '@/utils/colors';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getUserMe } from '@/redux/reducers/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next';
import { useRouter } from "expo-router";
import { fontScale } from 'nativewind';

export default function TabLayout() {

  const router = useRouter();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {auth, user} = useAppSelector(state => state.auth);

  const [isNavigationReady, setIsNavigationReady] = React.useState(false);

  async function getLocalstorageData() {
    const authData = await AsyncStorage.getItem('authenticate');
    if (authData) {
        const { userId } = JSON.parse(authData);
        return userId;
    }
    return null;
  }

  React.useEffect(()=> {
    if (!user && isNavigationReady) {
      router.push("/");
    }
  }, [user, isNavigationReady]);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const userId = await getLocalstorageData();
      if (userId || auth?.userId) {
        await dispatch(getUserMe(auth?.userId || userId)); 
      } else {
        router.push("/");
      }
      setIsNavigationReady(true);
    };

    fetchUserData();
  }, [auth]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors['light'].tint,
        tabBarInactiveTintColor: Colors['light'].tint,
          headerStyle: {
          elevation: 0, // Android uchun shadow yo'q qilish
          shadowOpacity: 0, // iOS uchun shadow yo'q qilish
        },
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t ('pages.main'),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon size={24} name={focused ? "home" : "home-outline"} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          initialParams={{ arrival: '', departure: '' }}
          options={{
            title: t ('pages.cargo'),          
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon size={24} name={focused ? "search" : "search-outline"} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t ('pages.profile'),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon size={24} name={focused ? "person" : "person-outline"} color={color} />
            ),
          }}
        />
    </Tabs>
  );
}
