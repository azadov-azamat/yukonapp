import { IUserModel } from "@/interface/redux/user.interface";
import { IPlanModel, ISubscriptionModel } from "@/interface/redux/variable.interface";
import dayjs from 'dayjs';

export default class SubscriptionModel implements ISubscriptionModel {
    paymentSource: string = '';
    endDate: string | null = null;
    startDate: string | null = null;
    status: string = '';
    plan?: IPlanModel;
    user?: IUserModel;
  
    constructor(data: Partial<ISubscriptionModel>) {
      Object.assign(this, data);
    }
  
    // Getter: Is the subscription a trial?
    get isTrial(): boolean {
      return this.plan?.planType === 'trial';
    }
  
    // Getter: Is the subscription active?
    get isActive(): boolean {
      return this.daysLeft >= 0;
    }
  
    // Getter: Remaining days for the subscription
    get daysLeft(): number {
      if (!this.endDate) {
        return 0;
      }
  
      const today = dayjs().startOf('day');
      const trialEnd = dayjs(this.endDate).startOf('day');
  
      return trialEnd.diff(today, 'day');
    }
  }