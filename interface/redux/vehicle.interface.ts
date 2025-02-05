import { defaultData, ICityModel, ICountryModel } from "./variable.interface";

export interface LoadInitialProps {
    vehicle: IVehicleModel | null;
    vehicles: IVehicleModel[] | [];
    loading: boolean;
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
    isArchived: boolean;
    isDeleted: boolean;
    deletedAt: Date | null;
    publishedDate: Date | null;
    loading: boolean;
    isWebAd: boolean;
    invalidButtonCounter: number;
    originCity?: ICityModel;
    originCountry?: ICountryModel;
  
    // phoneFunction(close?: () => void): Promise<void>;
    // urlFunction(): Promise<void>;
    // handleFunction(endpoint: string, successCallback: (response: any) => void, close?: () => void): Promise<void>;
  }