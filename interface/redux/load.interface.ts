import LoadModel from "@/models/load";
import { DirectionItemProps } from "../components";
import { defaultData, ICityModel, ICountryModel } from "./variable.interface";

export interface LoadInitialProps {
    load: LoadModel | null;
    loads: LoadModel[] | [];
    bookmarks: LoadModel[] | [];
    topSearches: DirectionItemProps[] | [];
    latestAds: ILoadModel[] | [];
    pagination: any;
    stats: any;
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
  }