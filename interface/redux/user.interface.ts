import { defaultData } from "./variable.interface";

export interface IUserModel extends defaultData {
    firstName: string;
    lastName: string;
    phone: string;
    telegramId?: number;
    telegramUsername?: string;
    password: string;
    smsToken: string;
    role: string | null;
    vehicleSearchLimit: number;
    loadSearchLimit: number;
    newLoadsNotifierEnabled: boolean;
    hasPassword: boolean;
    bookmarkedLoadIds: string[];
    bookmarkedVehicleIds: string[];
    markedExpiredLoads: string[];
    markedInvalidVehicles: string[];
    isAgreed: boolean;
}
  