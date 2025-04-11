import VehicleModel from "@/models/vehicle";
import { defaultData, ICityModel, ICountryModel, vehicleCountriesProps } from "./variable.interface";

export interface VehicleInitialProps {
    vehicle: VehicleModel | null;
    vehicles: VehicleModel[] | [];
    countries: ICountryModel[] | [];
    loading: boolean;
    pagination: any;
    stats: any;
}


export interface IVehicleModel extends defaultData{
    url: string;
    originCityName: string;
    destinationCityNames: string[];
    destinationCityIds: string[];
    destinationCountryIds: string[];
    volume: number;
    isLikelyDispatcher: boolean;
    isDagruz: boolean;
    truckType: string;
    truckType2: string;
    description: string;
    phone: string;
    telegram: string;
    weight: number;
    phoneViewCounter: number;
    openMessageCounter: number;
    viewCount: number;
    isArchived: boolean;
    isDeleted: boolean;
    deletedAt: Date | null;
    publishedDate: Date | null;
    loading: boolean;
    isWebAd: boolean;
    invalidButtonCounter: number;
    originCity?: ICityModel;
    originCountry?: ICountryModel;
    currency: 'UZS' | 'USD' | 'RUB';
  }
