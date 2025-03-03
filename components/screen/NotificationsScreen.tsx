import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

type NotificationType = 'job_interest' | 'job_match' | 'project_update' | 'vetting_confirmed';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  company: string;
};

type NotificationsData = {
  all: Notification[];
  community: Notification[];
  jobs: Notification[];
  profile: Notification[];
};

const notificationsData: NotificationsData = {
  all: [
    { id: "1", type: "job_interest", title: "🎉 You have been invited to an interview at Rockstar Games!", company: "Rockstar Games" },
    { id: "2", type: "job_match", title: "Sound Engineer position available at EA", company: "Electronic Arts" },
    { id: "3", type: "project_update", title: "Brandy Kennedy posted a new project: Plants vs. Zombies", company: "Community" },
    { id: "4", type: "vetting_confirmed", title: "✅ Your credits for Asgard's Wrath have been vetted", company: "System" },
  ],
  community: [
    { id: "3", type: "project_update", title: "Brandy Kennedy posted a new project: Plants vs. Zombies", company: "Community" },
  ],
  jobs: [
    { id: "1", type: "job_interest", title: "🎉 You have been invited to an interview at Rockstar Games!", company: "Rockstar Games" },
    { id: "2", type: "job_match", title: "Sound Engineer position available at EA", company: "Electronic Arts" },
  ],
  profile: [
    { id: "4", type: "vetting_confirmed", title: "✅ Your credits for Asgard's Wrath have been vetted", company: "System" },
  ],
};

// Get counts for tabs
const getTabCount = (tab: keyof NotificationsData) => notificationsData[tab].length;

// Component for displaying notification items
const NotificationItem = ({ item }: { item: Notification }) => {
  return (
    <View style={[styles.notificationItem, getNotificationStyle(item.type)]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.company}>{item.company}</Text>
    </View>
  );
};

type TabParamList = {
  'All': undefined;
  'Community': undefined;
  'Jobs': undefined;
  'Profile': undefined;
};

type TabScreenProps = MaterialTopTabScreenProps<TabParamList>;

const NotificationList: React.FC<TabScreenProps> = ({ route }) => {
  const tabName = route.name.split(' ')[0].toLowerCase() as keyof NotificationsData;
  return (
    <FlatList
      data={notificationsData[tabName]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NotificationItem item={item} />}
    />
  );
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

const NotificationsScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="All" options={{ title: `All (${getTabCount("all")})` }} component={NotificationList} />
      <Tab.Screen name="Community" options={{ title: `Community (${getTabCount("community")})` }} component={NotificationList} />
      <Tab.Screen name="Jobs" options={{ title: `Jobs (${getTabCount("jobs")})` }} component={NotificationList} />
      <Tab.Screen name="Profile" options={{ title: `Profile (${getTabCount("profile")})` }} component={NotificationList} />
    </Tab.Navigator>
  );
};

// Get Different Styles for Different Notification Types
const getNotificationStyle = (type: NotificationType) => {
  switch (type) {
    case "job_interest":
      return { backgroundColor: "#ffebee", borderLeftColor: "#e53935" };
    case "job_match":
      return { backgroundColor: "#e3f2fd", borderLeftColor: "#1e88e5" };
    case "project_update":
      return { backgroundColor: "#f3e5f5", borderLeftColor: "#8e24aa" };
    case "vetting_confirmed":
      return { backgroundColor: "#e8f5e9", borderLeftColor: "#43a047" };
    default:
      return { backgroundColor: "#f5f5f5", borderLeftColor: "#bdbdbd" };
  }
};

// Styles
const styles = StyleSheet.create({
  notificationItem: {
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    borderLeftWidth: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  company: {
    fontSize: 14,
    color: "#757575",
    marginTop: 5,
  },
});

export default NotificationsScreen;
