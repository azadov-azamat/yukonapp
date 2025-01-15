import { Deserializer } from "jsonapi-serializer";
import {AuthDataProps} from "@/interface/redux/auth.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserModel from "@/models/user";
import { IUserModel } from "@/interface/redux/user.interface";
import { ILoadModel } from "@/interface/redux/load.interface";
import LoadModel from "@/models/load";

const DefaultDeserializer = new Deserializer({
    keyForAttribute: 'camelCase',
});

export function deserialize(models: unknown) {
    return DefaultDeserializer.deserialize(models);
}

export async function authenticate(data: AuthDataProps, id?: string) {
    await AsyncStorage.setItem('authenticate', JSON.stringify({...data, id}));
}

export const deserializeUser = (data: IUserModel): UserModel => {
    return new UserModel(data);
};

export const deserializeLoad = (data: ILoadModel): LoadModel => {
    return new LoadModel(data);
};
