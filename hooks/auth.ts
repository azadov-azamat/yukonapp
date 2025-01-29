import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserMe } from "@/redux/reducers/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {auth, user, loading} = useAppSelector(state => state.auth);
    // const [isNavigationReady, setIsNavigationReady] = React.useState(false);

    async function getLocalstorageData() {
        const authData = await AsyncStorage.getItem('authenticate');
        if (authData) {
            const { userId } = JSON.parse(authData);
            return userId;
        }
        return null;
    }
    
    React.useEffect(() => {
        console.log("Auth loading state:", loading);
        console.log("Auth user state:", user);
    }, [loading, user]);

      React.useEffect(() => {
        const fetchUserData = async () => {
          const userId = await getLocalstorageData();
          if (userId || auth?.userId) {
            await dispatch(getUserMe(auth?.userId || userId)); 
          } else {
            router.replace("/");
          }
        //   setIsNavigationReady(true);
        };
    
        fetchUserData();
      }, [auth]);
    
      React.useEffect(()=> {
        if (user) {
          router.replace("/main/(tabs)/search");
        }
      }, [user]);

  return { user, loading };
};
