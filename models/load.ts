import { http } from "@/config/api";
import { ILoadModel } from "@/interface/redux/load.interface";
import { ICityModel, ICountryModel } from "@/interface/redux/variable.interface";
import { updateLoad } from "@/redux/reducers/load";
import { removePhoneNumbers } from "@/utils/general";
import Toast from "react-native-toast-message";
import UserModel from "./user";

export default class LoadModel implements ILoadModel {
  id = null;
  url = '';
  originCityName = '';
  destinationCityName = '';
  price = 0;
  distance = 0;
  distanceSeconds = 0;
  phone = '';
  telegram = '';
  goods = '';
  cargoType = 'not_specified';
  cargoType2 = 'not_specified';
  paymentType = 'not_specified';
  description = '';
  loadReadyDate = '';
  loadingSide = '';
  customsClearanceLocation = '';
  weight = 0;
  isDagruz = false;
  hasPrepayment = false;
  isLikelyOwner = false;
  isArchived = false;
  isDeleted = false;
  openMessageCounter = 0;
  phoneViewCounter = 0;
  prepaymentAmount = 0;
  expirationButtonCounter = 0;
  publishedDate: Date | null = null;
  loading = false;
  isWebAd = true;
  originCity?: ICityModel;
  originCountry?: ICountryModel;
  destinationCity?: ICityModel;
  destinationCountry?: ICountryModel;
  createdAt?: string;
  updatedAt?: string;

  constructor(data: Partial<ILoadModel>) {
    Object.assign(this, data);
  }

  get distanceInKm(): string {
    if (!this.distance) return '0';
    return Math.round(this.distance / 1000).toString();
  }

  get distanceInHours(): string {
    const seconds = this.distanceSeconds;
    if (!seconds) return '0h';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes} Min`;
  }

  async phoneFunction(user: UserModel, dispatch: any, close?: () => void): Promise<void> {
    this.loading = true;
    await this.handleFunction({
      endpoint: `loads/${this.id}/phone`,
      user,
      successCallback: async (res) => {
        const {removedPhones} = removePhoneNumbers(this.description);

        this.phone = res.phone || removedPhones?.[0];
        if (res.username) {
            this.telegram = `https://t.me/${res.username}`;
        } else if (res.ownerPhone) {
            this.telegram = `https://t.me/+${res.ownerPhone}`;
        }
  
        if (this.phoneViewCounter) {
            this.phoneViewCounter += 1;
        } else {
            this.phoneViewCounter = 1;
        }

        if (!this.phone) {
            Toast.show({
                type: 'warning',
                text1: 'phone-not-found',
            });
        }
        this.loading = false;
        this.save(dispatch);
      },
      close
    });
  }

  async urlFunction(user: UserModel): Promise<void> {
    this.loading = true;
    await this.handleFunction({
        endpoint: `loads/${this.id}/url`, 
        user, 
        successCallback: async (response) => {
            console.log('Opening URL:', response.url);
            this.openMessageCounter += 1;
            this.loading = false;
        }}
);
  }

  async handleFunction({
    endpoint,
    user,
    successCallback,
    close,
  }: {
    endpoint: string;
    user: UserModel;
    successCallback: (response: any) => void;
    close?: () => void;
  }): Promise<void> {
    this.loading = true;

    try {
      const response = await http.get(endpoint);
      successCallback(response.data);
    } catch (e) {
      console.error('An error occurred:', e);
    } finally {
      this.loading = false;
      close?.();
    }
  }

  async save(dispatch: any) {
    await dispatch(updateLoad({id: this.id || '', data: this}))
  }
}
