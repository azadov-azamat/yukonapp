import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { Badge } from 'react-native-paper';

type NotificationType = 'job_interest' | 'job_match' | 'project_update' | 'vetting_confirmed';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  company: string;
};

type NotificationsData = {
  all: Notification[];
  ads: Notification[];
  news: Notification[];
};

const notificationsData: NotificationsData = {
  all: [
    { id: "1", type: "job_interest", title: "🎉 You have been invited to an interview at Rockstar Games!", company: "Rockstar Games" },
    { id: "2", type: "job_match", title: "Sound Engineer position available at EA", company: "Electronic Arts" },
    { id: "3", type: "project_update", title: "Brandy Kennedy posted a new project: Plants vs. Zombies", company: "Community" },
    { id: "4", type: "vetting_confirmed", title: "✅ Your credits for Asgard's Wrath have been vetted", company: "System" },
  ],
  ads: [
    { id: "3", type: "project_update", title: "Brandy Kennedy posted a new project: Plants vs. Zombies", company: "Community" },
  ],
  news: [
    { id: "1", type: "job_interest", title: "🎉 You have been invited to an interview at Rockstar Games!", company: "Rockstar Games" },
    { id: "2", type: "job_match", title: "Sound Engineer position available at EA", company: "Electronic Arts" },
  ]
};

// Get counts for tabs
const getTabCount = (tab: keyof NotificationsData) => notificationsData[tab].length;

// Component for displaying notification items
const NotificationItem = ({ item }: { item: Notification }) => {
  return (
    <View style={styles.notificationItem}>
			<Badge style={[getNotificationStyle(item.type), { paddingHorizontal: 10, alignSelf: 'flex-start', marginBottom: 10, borderRadius: 5 }]} size={20}>{item.type}</Badge>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.company}>{item.company}</Text>
    </View>
  );
};

type TabParamList = {
  'All': undefined;
  'Ads': undefined;
  'News': undefined;
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
    <Tab.Navigator
			screenOptions={{
				tabBarStyle: {
					// padding: 1
				},
			}}
		>
      <Tab.Screen
        name="All"
        options={{ title: `All (${getTabCount("all")})`}}
        component={NotificationList}
      />
      <Tab.Screen name="Ads" options={{ title: `Ads (${getTabCount("ads")})` }} component={NotificationList} />
      <Tab.Screen name="News" options={{ title: `News (${getTabCount("news")})` }} component={NotificationList} />
    </Tab.Navigator>
  );
};

// Get Different Styles for Different Notification Types
const getNotificationStyle = (type: NotificationType) => {
  switch (type) {
    case "job_interest":
      return { backgroundColor: "#ffcc00", borderLeftColor: "#ff6d00" };
    case "job_match":
      return { backgroundColor: "#00b8d9", borderLeftColor: "#007acc" };
    case "project_update":
      return { backgroundColor: "#ff99cc", borderLeftColor: "#e040fb" };
    case "vetting_confirmed":
      return { backgroundColor: "#4caf50", borderLeftColor: "#008c00" };
    default:
      return { backgroundColor: "#f9f9f9", borderLeftColor: "#e0e0e0" };
  }
};

// Styles
const styles = StyleSheet.create({
  notificationItem: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderBottomWidth: 1,
		borderColor: "#ced4da",
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
