import React from 'react';
import { Tabs } from 'expo-router';
// import { Platform } from 'react-native';
import { TabBarIcon } from '@/components/navigation/tab-bar-icon';
import { Colors } from '@/utils/colors';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getUserMe } from '@/redux/reducers/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTopSearches } from '@/redux/reducers/load';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {auth} = useAppSelector(state => state.auth);

  async function getLocalstorageData() {
    const authData = await AsyncStorage.getItem('authenticate');
    if (authData) {
        const { userId } = JSON.parse(authData);
        return userId;
    }
    return null;
  }

  React.useLayoutEffect(() => {
    const fetchUserData = async () => {
      const userId = await getLocalstorageData();
      await dispatch(getUserMe(auth?.userId || userId)).unwrap();
    };

    fetchUserData();
  }, [auth]);

  React.useEffect(()=> {
    dispatch(getTopSearches())
  },  []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors['light'].tint,
        tabBarInactiveTintColor: Colors['light'].tint,
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
