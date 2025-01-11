import { Deserializer } from "jsonapi-serializer";
import {AuthDataProps, AuthInitialProps} from "@/interface/redux/auth.interface";

const DefaultDeserializer = new Deserializer({
    keyForAttribute: 'camelCase',
});

export function deserialize(models: unknown) {
    return DefaultDeserializer.deserialize(models);
}

export function authenticate(state: AuthInitialProps, data: AuthDataProps, id: string) {
    state.auth = data;
    localStorage.setItem('authenticate', JSON.stringify({...data, id}));
}
