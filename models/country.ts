import { ICountryModel, ICityModel } from "@/interface/redux/variable.interface";

export default class CountryModel implements ICountryModel {
    nameRu: string = '';
    nameUz: string = '';
    nameEn: string = '';
    names: string = '';
    icon: string = '';
    cities: ICityModel[] = [];
  
    constructor(data: Partial<ICountryModel>) {
      Object.assign(this, data);
    }
  }