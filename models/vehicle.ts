import { http } from "@/config/api";
import { ICityModel, ICountryModel } from "@/interface/redux/variable.interface";
import { IVehicleModel } from "@/interface/redux/vehicle.interface";
import { updateUserSubscriptionModal } from "@/redux/reducers/auth";
import { phoneLoad } from "@/redux/reducers/variable";
import UserModel from "./user";
import { updateVehicle } from "@/redux/reducers/vehicle";
import { removePhoneNumbers } from "@/utils/general";
import Toast from "react-native-toast-message";

export default class VehicleModel implements IVehicleModel {
  id = null;
  url = '';
  originCityName = '';
  destinationCityNames: string[] = [];
  destinationCityIds: string[] = [];
  destinationCountryIds: string[] = [];
  volume = 0;
  isLikelyDispatcher = false;
  isDagruz = false;
  truckType = 'not_specified';
  truckType2 = 'not_specified';
  description = '';
  phone = '';
  telegram = '';
  weight = 0;
  phoneViewCounter = 0;
  openMessageCounter = 0;
  viewCount = 0;
  isArchived = false;
  isDeleted = false;
  deletedAt: Date | null = null;
  publishedDate: Date | null = null;
  loading = false;
  isWebAd = true;
  invalidButtonCounter = 0;
  originCity?: ICityModel;
  originCountry?: ICountryModel;
  currency: "UZS" | "USD" | "RUB" = "UZS";
  createdAt?: string;
  updatedAt?: string;
  
  constructor(data: Partial<IVehicleModel>) {
    Object.assign(this, data);
  }

  async phoneFunction(user: UserModel, dispatch: any, close?: () => void): Promise<void> {
    this.loading = true;
    await this.handleFunction({
      endpoint: `vehicles/${this.id}/phone`,
      user,
      dispatch,
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

  async urlFunction(user: UserModel, dispatch: any): Promise<void> {
    this.loading = true;
    await this.handleFunction({
        endpoint: `vehicles/${this.id}/url`, 
        user, 
        dispatch,
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
    dispatch(phoneLoad()); // loading true

    if (!user) {
        dispatch(phoneLoad()); // loading false
        return ''
    }

    try {
      const hasSubscription = await this.checkSubscription(user);

      if (!hasSubscription) {
        if (user.loadSearchLimit > 0) {
            const response = await http.get(endpoint);
            successCallback(response.data);
            user.loadSearchLimit--;
            await user.save(dispatch);
        } else {
            dispatch(updateUserSubscriptionModal());
            close?.();
        }
      } else {
        const response = await http.get(endpoint);
        successCallback(response.data);
      }
    } catch (e) {
      console.error('An error occurred:', e);
      dispatch(phoneLoad()); // loading false
    } finally {
      dispatch(phoneLoad()); // loading false
      close?.();
    }
  }

  async checkSubscription(user: UserModel) {
    try {
        return await user?.hasActiveSubscription();
    } catch (err) {
        console.log(err)
        return false;
    }
  }

  async save(dispatch: any) {
    await dispatch(updateVehicle({id: String(this.id), data: this}))
  }
}
