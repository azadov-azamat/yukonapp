import { ICountryModel } from "@/interface/redux/variable.interface";
import CityModel from "./city";

export default class CountryModel implements ICountryModel {
    id: number = 0;
    nameRu: string = '';
    nameUz: string = '';
    nameEn: string = '';
    names: string = '';
    icon: string = '';
    cities: CityModel[] = [];

    constructor(data: Partial<ICountryModel>) {
      Object.assign(this, data);
    }
  }
