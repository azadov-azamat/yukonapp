import { IUserModel } from "@/interface/redux/user.interface";
import { IAnalyticsEvent } from "@/interface/redux/variable.interface";

export default class AnalyticsEvent implements IAnalyticsEvent {
    id: number = 0;
    platform: 'web' | 'bot' | 'mobile' = 'mobile';
    pageUrl: string = '';
    platformInfo?: string = '';
    user: IUserModel = {} as IUserModel;
    eventType: string = '';
    textMessage: string = '';
    metadata?: string;
    metadataHash?: string;
    createdAt?: string;
    updatedAt?: string;
  
    constructor(data: Partial<IAnalyticsEvent>) {
      Object.assign(this, data);
    }
}