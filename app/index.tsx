import { Image, View } from "react-native";
import LoginForm from '@/components/forms/login';
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserMe } from "@/redux/reducers/auth";
import { useRouter } from "expo-router";

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
    <View className='items-center justify-center flex-1 bg-gray-100'>
      <LoginForm />
    </View>
  );
}