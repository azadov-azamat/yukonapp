import axios from "axios";
import { useNavigation } from '@react-navigation/native';;
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    console.error("error - 29", error);
    if (error.response?.status === 401) {
        // const {navigate} = useNavigation();
        // navigate('home');
    }
    return Promise.reject(error);
});


export const sendRequest = async (url: string, body: any, method = "POST") => {
    try {
        const authData = await AsyncStorage.getItem('authenticate');

        if (authData) {
            const { token } = JSON.parse(authData);
            const response = await fetch(baseUrl + url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body),
            });
            const result = await response.json();
            if (result.error) {
                handleRequestError(result.error);
                return null;
            }
            return result;
        }
    } catch (e) {
        console.error("Network error:", e);
        return null;
    }
};

export const handleRequestError = (error: any) => {
    const errorMessages: Record<string, string> = {
        "-31300": "Card data is incorrect.",
        "-31900": "Card data is incorrect.",
        "-31103": "Confirmation code is incorrect.",
        "-31101": "Confirmation code has expired.",
        "-31630": "Not enough funds.",
    };
    alert(errorMessages[error.code] || "Unhandled error.");
};
