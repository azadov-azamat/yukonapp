import UserModel from "@/models/user";

export interface AuthInitialProps {
    user: UserModel | null;
    auth: AuthDataProps | null;
    uniquePhoneExists: boolean;
    successSendSms: boolean;
    loading: boolean;
    location: [number, number] | [];
}

export interface AuthDataProps {
    token: string;
    userId: number;
    expires: string;
}