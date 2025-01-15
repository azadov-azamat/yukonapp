import { IUserModel } from "@/interface/redux/user.interface";
import { ICityModel, ISavedFilterModel } from "@/interface/redux/variable.interface";

export default class SavedFilterModel implements ISavedFilterModel {
    isLikelyOwner: boolean = false;
    isDisabled: boolean = false;
    truckType: string = 'not_specified';
    originCity?: ICityModel;
    destinationCity?: ICityModel;
    owner?: IUserModel;
  
    constructor(data: Partial<ISavedFilterModel>) {
      Object.assign(this, data);
    }
  }