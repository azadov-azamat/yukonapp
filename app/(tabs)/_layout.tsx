import React from 'react';
import { Tabs } from 'expo-router';
// import { Platform } from 'react-native';
import { TabBarIcon } from '@/components/navigation/tab-bar-icon';
import { Colors } from '@/utils/colors';

export default function TabLayout() {
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors['light'].tint,
        tabBarInactiveTintColor: Colors['light'].tint
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon size={28} name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon size={28} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon size={28} name="search" color={color} />,
        }}
      />
    </Tabs>
  );
}
