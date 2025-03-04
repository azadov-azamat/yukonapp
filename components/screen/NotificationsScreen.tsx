import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { Badge } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getNotifications } from "@/redux/reducers/notification";
import type { RootState } from "@/redux/store";
import type { INotificationModel } from "@/interface/redux/notification.interface";

type NotificationType = 'all' | 'text_message' | 'ads' | 'news';

// Component for displaying notification items
const NotificationItem = ({ item }: { item: INotificationModel }) => {
  return (
    <View style={styles.notificationItem}>
      <Badge style={[getNotificationStyle(item.nType as NotificationType), { paddingHorizontal: 10, alignSelf: 'flex-start', marginBottom: 10, borderRadius: 5 }]} size={20}>
        {item.nType}
      </Badge>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );
};

type TabParamList = {
  All: undefined;
  Ads: undefined;
  News: undefined;
};

type TabScreenProps = MaterialTopTabScreenProps<TabParamList>;

const NotificationList: React.FC<TabScreenProps> = ({ route }) => {
  const notifications = useAppSelector((state: RootState) => state.notification.notifications) || [];
  const tabName = route.name.toLowerCase();

  const filteredNotifications = React.useMemo(() => {
    if (tabName === 'all') return notifications;
    return notifications.filter((notification: INotificationModel) =>
      notification.nType.toLowerCase().includes(tabName)
    );
  }, [notifications, tabName]);

  return (
    <FlatList
      data={filteredNotifications}
      keyExtractor={(item) => item.id?.toString() ?? ''}
      renderItem={({ item }) => <NotificationItem item={item} />}
    />
  );
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

export const NotificationsScreen = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state: RootState) => state.notification.notifications) || [];
  const [selectedTab, setSelectedTab] = useState<NotificationType>('all');

  useEffect(() => {
    dispatch(getNotifications({}));
  }, [dispatch]);

  const getTabCount = (type: NotificationType) => {
    if (type === 'all') return notifications.length;
    return notifications.filter((notification: INotificationModel) => notification.nType === type).length;
  };

  const filteredNotifications = notifications.filter((notification: INotificationModel) => {
    if (selectedTab === 'all') return true;
    return notification.nType === selectedTab;
  });

  const renderTabLabel = (label: string, count: number, focused: boolean) => (
    <View style={styles.tabLabel}>
      <Text style={[styles.tabText, focused && styles.tabTextFocused]}>{label}</Text>
      <View style={[styles.badge, focused && styles.badgeFocused]}>
        <Text style={[styles.badgeText, focused && styles.badgeTextFocused]}>{count}</Text>
      </View>
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#ced4da",
        },
      }}
    >
      <Tab.Screen
        name="All"
        options={{
          tabBarLabel: ({focused}) => renderTabLabel('ALL', getTabCount('all'), focused),
        }}
        component={NotificationList}
      />
      <Tab.Screen
        name="Ads"
        options={{
          tabBarLabel: ({focused}) => renderTabLabel('ADS', getTabCount('ads'), focused),
        }}
        component={NotificationList}
      />
      <Tab.Screen
        name="News"
        options={{
          tabBarLabel: ({focused}) => renderTabLabel('NEWS', getTabCount('news'), focused),
        }}
        component={NotificationList}
      />
    </Tab.Navigator>
  );
};

// Get Different Styles for Different Notification Types
const getNotificationStyle = (type: NotificationType) => {
  switch (type) {
    case "text_message":
      return { backgroundColor: "#ffcc00", borderLeftColor: "#ff6d00" };
    case "ads":
      return { backgroundColor: "#00b8d9", borderLeftColor: "#007acc" };
    case "news":
      return { backgroundColor: "#ff99cc", borderLeftColor: "#e040fb" };
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
  message: {
    fontSize: 14,
    color: "#757575",
    marginTop: 5,
  },
  tabLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    color: '#666',
  },
  tabTextFocused: {
    color: '#623bff',
  },
  badge: {
    backgroundColor: '#666',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: 5,
		minWidth: 18,
		minHeight: 18,
  },
  badgeFocused: {
    backgroundColor: '#623bff',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    lineHeight: 18,
  },
  badgeTextFocused: {
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;
