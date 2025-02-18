import { CustomLanguageSelector } from "@/components/custom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/reducers/auth";
import { Colors } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button, Text } from "react-native-paper";
import { useTheme } from "@/config/ThemeContext";

export default function ProfilePage() {
  const router = useRouter();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth)
  const { isDarkMode, toggleTheme } = useTheme();
  
  const logoutFunction = async () => {
    await AsyncStorage.clear();
    dispatch(logout());
    router.replace('/auth');
  }

  return (
    <View className="relative flex-1 px-4 pt-8 bg-gray-100">
    {/* Header */}
      <View className="flex-row items-center mb-6">
        <View className="flex-row items-center flex-1">
          <View className="items-center justify-center w-16 h-16 mr-4 border rounded-full border-border-color">
            <Ionicons
              name="person"        
              size={24}
              color={'gray'}
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold ">{user?.fullName}</Text>
            <Text className="">{user?.role}</Text>
          </View>
        </View>
        <TouchableOpacity className="mr-2">
          <Ionicons name="pencil-outline" size={24} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>

      {/* Menu Options */}
      <View className="flex-col flex-1 gap-2">
        <MenuItem
          title="profile.bookmarks"
          icon="bookmark"
          onPress={() => router.replace('/profile/bookmarks')}
        />
        <MenuItem
          title="profile.subscriptions"
          icon="cart"
          onPress={() => router.replace('/profile/subscriptions')}
        />
      
        <MenuItem title="profile.notifications" icon="notifications" />
        <MenuItem title="profile.help" icon="help-circle" />
        <MenuItem title="About" icon="information-circle" />
        <CustomLanguageSelector/>
        {/* Log Out */}
        <TouchableOpacity onPress={logoutFunction} className="absolute bottom-0 flex-row items-center px-4 py-4 bg-white border-b rounded-lg -right-4 -left-4 border-border-color">
          <Ionicons name="log-out-outline" size={24} color="#FF3D00" />
          <Text className="ml-4 text-base text-red-500">{t ('profile.logout')}</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text variant="titleLarge">Current Theme: {isDarkMode ? "Dark" : "Light"}</Text>
          <Button mode="contained" onPress={toggleTheme} style={{ marginTop: 20 }}>
            Toggle Theme
          </Button>
        </View>
      </View>
  </View>
);
}

// Menu Item Component
const MenuItem = ({ title, icon, onPress }: {title: string; icon: keyof typeof Ionicons.glyphMap; onPress?: () => void}) => {
  const {t} = useTranslation();

  return (
    <TouchableOpacity className="flex-row items-center px-2 py-4 bg-white border-b rounded-lg border-border-color" onPress={onPress}>
      <Ionicons name={icon} size={24} color={Colors.light.tint} />
      <Text className="ml-4 text-base">{t (title)}</Text>
  </TouchableOpacity>
  );
}
