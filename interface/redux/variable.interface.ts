import PlanModel from "@/models/plan";
import { IUserModel } from "./user.interface";

export interface VariableInitialProps {
    plans: PlanModel[] | [];
    selectedPlan: PlanModel | null;
    loading: boolean;
    phoneLoading: boolean;
    activeLoaders: number;
}

export interface CityInitialProps {
    cities: any;
    extractCity: extractCityProps | null;
    loading: boolean;
}

export interface extractCityProps {
    destination?: itemCityProps | null;
    hasDestination?: boolean;
    origin: itemCityProps;
    truckType?: any;
}

export interface ICountryModel extends defaultData {
    nameRu: string;
    nameUz: string;
    nameEn: string;
    names: string;
    icon: string;
    cities: ICityModel[];
}

export interface ICityModel extends defaultData {
    nameRu?: string;
    nameUz?: string;
    nameEn: string;
    countryId: string;
    country?: ICountryModel;
}

export interface IPlanModel extends defaultData {
    nameRu: string;
    nameUz: string;
    nameCyrl: string;
    descriptionRu: string;
    descriptionUz: string;
    descriptionCyrl: string;
    planType: string;
    durationInDays: number;
    price: number;
}

export interface ISubscriptionModel extends defaultData{
    paymentSource: string;
    endDate: string | null;
    startDate: string | null;
    status: string;
    plan?: IPlanModel;
    user?: IUserModel;
  
    isTrial: boolean;
    isActive: boolean;
    daysLeft: number;
}

export interface ISavedFilterModel extends defaultData {
    isLikelyOwner: boolean;
    isDisabled: boolean;
    truckType: string;
    originCity?: ICityModel;
    destinationCity?: ICityModel;
    owner?: IUserModel;
}

export interface itemCityProps extends defaultData {
    country_id?: number;
    name_uz: string;
    name_ru: string;
    name_variant?: string;
    type?: string;
}

export interface defaultData {
    id?: number | null;
    createdAt?: string;
    updatedAt?: string;
}
  