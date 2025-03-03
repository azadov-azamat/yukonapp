import { INotificationModel } from "@/interface/redux/notification.interface";
import { IUserModel } from "@/interface/redux/user.interface";

export default class NotificationModel implements INotificationModel {
    id = 0;
    title: string = '';
    message: string = '';
    status: string = '';
    nType: string = '';
		createdAt?: string;
  	updatedAt?: string;
    userId: string = '';
    user?: IUserModel;

    constructor(data: Partial<INotificationModel>) {
      Object.assign(this, data);
    }
  }
