import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/reducers/auth";
import { Colors } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity } from "react-native";

export default function ProfilePage() {
  const router = useRouter();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth)
  
  const logoutFunction =()=> {
    dispatch(logout());
    router.push('../');
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
          // onPress={() => navigation.navigate("Orders")}
        />
        <MenuItem
          title="profile.subscriptions"
          icon="cart"
          // onPress={() => navigation.navigate("Wishlist")}
        />
      
        <MenuItem title="profile.notifications" icon="notifications" />
        <MenuItem title="profile.help" icon="help-circle" />
        <MenuItem title="About" icon="information-circle" />

        {/* Log Out */}
        <TouchableOpacity onPress={logoutFunction} className="absolute bottom-0 flex-row items-center px-4 py-4 bg-white border-b rounded-lg -right-4 -left-4 border-border-color">
          <Ionicons name="log-out-outline" size={24} color="#FF3D00" />
          <Text className="ml-4 text-base text-red-500">{t ('profile.logout')}</Text>
        </TouchableOpacity>
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