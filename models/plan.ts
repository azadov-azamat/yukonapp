import { IPlanModel } from "@/interface/redux/variable.interface";

export default class PlanModel implements IPlanModel {
    id = 0;
    nameRu: string = '';
    nameUz: string = '';
    nameCyrl: string = '';
    descriptionRu: string = '';
    descriptionUz: string = '';
    descriptionCyrl: string = '';
    planType: string = '';
    duration_in_days: number = 0;
    price: number = 0;
  
    constructor(data: Partial<IPlanModel>) {
      Object.assign(this, data);
    }
  }