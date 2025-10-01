import { http } from "@/config/api";
import { ILoadModel } from "@/interface/redux/load.interface";
// import { ICityModel, ICountryModel } from "@/interface/redux/variable.interface";
import { updateLoad } from "@/redux/reducers/load";
import { openLink, removePhoneNumbers } from "@/utils/general";
import Toast from "react-native-toast-message";
import UserModel from "./user";
import { updateUserSubscriptionModal } from "@/redux/reducers/auth";
import { phoneLoad, urlLoad } from "@/redux/reducers/variable";
import CityModel from "./city";
import CountryModel from "./country";
import { Alert } from "react-native";
import { Linking } from "react-native";

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
  viewCount = 0;
  expirationButtonCounter = 0;
  publishedDate: Date | null = null;
  loading = false;
  isWebAd = true;
  originCity?: CityModel;
  originCountry?: CountryModel;
  destinationCity?: CityModel;
  destinationCountry?: CountryModel;
  currency?: string;
  pricingUnit?: string;
  createdAt?: string;
  updatedAt?: string;
  
  constructor(data: Partial<ILoadModel>) {
    Object.assign(this, data);
  }

  get distanceInKm(): string {
    if (!this.distance) return '0';
    return Math.round(this.distance / 1000).toString();
  }

  isBookmark(user: UserModel): boolean {
    const ids = user?.bookmarkedLoadIds    
    return ids?.includes(String(this.id));
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
      dispatch,
      successCallback: async (res) => {
        const {removedPhones} = removePhoneNumbers(this.description);

        this.phone = res.phone || removedPhones?.[0] || res.ownerPhone;
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
                type: 'error',
                text1: 'phone-not-found',
            });
        }
        this.loading = false;
        this.save(dispatch);
      },
      close
    });
  }

  async urlFunction(user: UserModel, dispatch: any): Promise<void> {
    this.loading = true;
    if (this.url) {
      window.location.href = this.url;
      this.openMessageCounter += 1;
      this.loading = false;
      return;
    }
    await this.handleFunction({
        endpoint: `loads/${this.id}/url`, 
        user, 
        dispatch,
        successCallback: async (response) => {
            if (!response.url) {
              Toast.show({
                  type: 'error',
                  text1: 'url-not-found',
              });
            } else {
              this.url = response.url;
              this.openMessageCounter += 1;
              openLink(this.url);
            }

            this.loading = false;
            this.save(dispatch);
        }}
    );
  }

  async handleFunction({
    endpoint,
    user,
    dispatch,
    successCallback,
    close,
  }: {
    endpoint: string;
    user: UserModel;
    dispatch: any;
    successCallback: (response: any) => void;
    close?: () => void;
  }) {
    let loading: any;
    if (endpoint.endsWith('/phone')) {
      loading = phoneLoad;
    } else if (endpoint.endsWith('/url')){
      loading = urlLoad;
    }
    dispatch(loading()); // loading true

    if (!user) {
        dispatch(loading()); // loading false
        return ''
    }

    console.log(` asdfadsfasd`)
    try {
      const hasSubscription = await this.checkSubscription(user);

      console.log('hasSubscription', hasSubscription);

      if (!hasSubscription) {
        if (user.loadSearchLimit > 0) {
            const response = await http.get(endpoint, {
              headers: {
                'X-Track': '1',
                'X-Track-Event': 'open_message_info',
                'X-Track-Meta': JSON.stringify({type: 'Load', recordId: this.id})
              }
            });
            successCallback(response.data);
            user.loadSearchLimit--;
            await user.save(dispatch);
        } else {
            dispatch(updateUserSubscriptionModal());
            close?.();
        }
      } else {
        const response = await http.get(endpoint, {
          headers: {
              'X-Track': '1',
              'X-Track-Event': 'open_message_info',
              'X-Track-Meta': JSON.stringify({type: 'Load', recordId: this.id})
          }
        });
        successCallback(response.data);
      }
    } catch (e) {
      console.error('An error occurred:', e);
      dispatch(loading()); // loading false
    } finally {
      dispatch(loading()); // loading false
      close?.();
    }
  }

  async checkSubscription(user: UserModel) {
    try {
      console.log('Checking subscription for user:', user.id);
        const { active } = await user?.fetchActiveSubscription();
        return active
    } catch (err) {
        console.log(err)
        return false;
    }
  }

  async save(dispatch: any) {
    await dispatch(updateLoad({id: String(this.id), data: this}))
  }
}
