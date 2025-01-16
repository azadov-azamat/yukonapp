import { http } from "@/config/api";
import { ILoadModel } from "@/interface/redux/load.interface";
import { ICityModel, ICountryModel } from "@/interface/redux/variable.interface";

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

  async phoneFunction(close?: () => void): Promise<void> {
    await this.handleFunction(
      `loads/${this.id}/phone`,
      async (res) => {
        this.phone = res.phone || '';
        this.telegram = res.username ? `https://t.me/${res.username}` : '';
        this.phoneViewCounter += 1;

        if (!this.phone) {
          console.warn('Phone not found');
        }
      },
      close,
    );
  }

  async urlFunction(): Promise<void> {
    await this.handleFunction(`loads/${this.id}/url`, async (response) => {
      console.log('Opening URL:', response.url);
      this.openMessageCounter += 1;
    });
  }

  async handleFunction(endpoint: string, successCallback: (response: any) => void, close?: () => void): Promise<void> {
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
}
