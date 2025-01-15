import { IPlanModel } from "@/interface/redux/variable.interface";

export default class PlanModel implements IPlanModel {
    nameRu: string = '';
    nameUz: string = '';
    nameCyrl: string = '';
    descriptionRu: string = '';
    descriptionUz: string = '';
    descriptionCyrl: string = '';
    planType: string = '';
    durationInDays: number = 0;
    price: number = 0;
  
    constructor(data: Partial<IPlanModel>) {
      Object.assign(this, data);
    }
  }