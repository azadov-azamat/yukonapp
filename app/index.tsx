import { TouchableOpacity, View } from "react-native";
import LoginForm from '@/components/forms/login';
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserMe } from "@/redux/reducers/auth";
import { useRouter } from "expo-router";
import { CustomLanguageSelector } from "@/components/customs";
import { TabBarIcon } from "@/components/navigation/tab-bar-icon";

export default function MainPage() {
  
  const dispatch = useAppDispatch();
  const router = useRouter();
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

  React.useEffect(()=> {
    if (user && isNavigationReady) {
      router.push("/(tabs)");
    }
  }, [user, isNavigationReady]);
  
  return (
    <View className='relative items-center justify-center flex-1 bg-gray-100'>
       <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 py-3">
        {/* Search Button */}
        <TouchableOpacity
          className="flex items-center justify-center w-12 h-12 bg-gray-200 border-2 rounded-xl border-border-color"
          onPress={() => router.push("/search")}
        >
          <TabBarIcon name='search' color={'gray'}/>
        </TouchableOpacity>

        {/* Language Selector */}
        <CustomLanguageSelector />
      </View>
      <LoginForm />
    </View>
  );
}