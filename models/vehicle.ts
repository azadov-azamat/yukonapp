import { http } from "@/config/api";
import { ICityModel, ICountryModel } from "@/interface/redux/variable.interface";
import { IVehicleModel } from "@/interface/redux/vehicle.interface";

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
  isArchived = false;
  isDeleted = false;
  deletedAt: Date | null = null;
  publishedDate: Date | null = null;
  loading = false;
  isWebAd = true;
  invalidButtonCounter = 0;
  originCity?: ICityModel;
  originCountry?: ICountryModel;

  constructor(data: Partial<IVehicleModel>) {
    Object.assign(this, data);
  }

  async phoneFunction(close?: () => void): Promise<void> {
    await this.handleFunction(
      `vehicles/${this.id}/phone`,
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
    await this.handleFunction(`vehicles/${this.id}/url`, async (response) => {
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
