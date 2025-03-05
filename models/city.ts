import { ICityModel } from "@/interface/redux/variable.interface";
import CountryModel from "./country";

export default class CityModel implements ICityModel {
    id: number = 0;
    nameRu: string = '';
    nameUz: string = '';
    nameEn: string = '';
    countryId: string = '';
    country?: CountryModel;
  
    constructor(data: Partial<ICityModel>) {
      Object.assign(this, data);
    }
}