import { Deserializer } from "jsonapi-serializer";
import {AuthDataProps, AuthInitialProps} from "@/interface/redux/auth.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DefaultDeserializer = new Deserializer({
    keyForAttribute: 'camelCase',
});

export function deserialize(models: unknown) {
    return DefaultDeserializer.deserialize(models);
}

export async function authenticate(data: AuthDataProps, id?: string) {
    await AsyncStorage.setItem('authenticate', JSON.stringify({...data, id}));
}
