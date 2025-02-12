import { ICityModel, ICountryModel } from "@/interface/redux/variable.interface";

export default class CityModel implements ICityModel {
    id: number = 0;
    nameRu: string = '';
    nameUz: string = '';
    nameEn: string = '';
    countryId: string = '';
    country?: ICountryModel;
  
    constructor(data: Partial<ICityModel>) {
      Object.assign(this, data);
    }
}