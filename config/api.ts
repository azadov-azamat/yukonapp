import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/utils/i18n";
import Toast from 'react-native-toast-message';
import { Alert } from "react-native";

export const baseUrl = `${process.env.EXPO_PUBLIC_BACKEND_HOST}/api`;

export const http = axios.create({
    baseURL: baseUrl,
    headers: {
        Accept: "application/json",
    },
})

http.interceptors.request.use(async (config) => {
    const authData = await AsyncStorage.getItem('authenticate');
    if (authData) {
        try {
            const { token } = JSON.parse(authData);
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error parsing authentication data:', error);
        }
    }
    return config;
}, (error) => {
    console.log("error - 29", error);
    if (error.response?.status === 401) {
        console.log("401");
        // const router = useRouter();
        // router.push("/");
    }
    return Promise.reject(error);
});
