import { defaultData, ICityModel, ICountryModel } from "./variable.interface";

export interface LoadInitialProps {
    load: ILoadModel | null;
    loads: ILoadModel[] | [];
    loading: boolean;
}


export interface ILoadModel extends defaultData {
    url: string;
    originCityName: string;
    destinationCityName: string;
    price: number;
    distance: number;
    distanceSeconds: number;
    phone: string;
    telegram: string;
    goods: string;
    cargoType: string;
    cargoType2: string;
    paymentType: string;
    description: string;
    loadReadyDate: string;
    loadingSide: string;
    customsClearanceLocation: string;
    weight: number;
    isDagruz: boolean;
    hasPrepayment: boolean;
    isLikelyOwner: boolean;
    isArchived: boolean;
    isDeleted: boolean;
    openMessageCounter: number;
    phoneViewCounter: number;
    prepaymentAmount: number;
    expirationButtonCounter: number;
    publishedDate: Date | null;
    loading: boolean;
    isWebAd: boolean;
    originCity?: ICityModel;
    originCountry?: ICountryModel;
    destinationCity?: ICityModel;
    destinationCountry?: ICountryModel;
  
    // distanceInKm: string;
    // distanceInHours: string;
    // phoneFunction(close?: () => void): Promise<void>;
    // urlFunction(): Promise<void>;
    // handleFunction(endpoint: string, successCallback: (response: any) => void, close?: () => void): Promise<void>;
  }