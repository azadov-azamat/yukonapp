import { IUserModel } from "./user.interface";

export interface NotificationInitialProps {
	notifications: INotificationModel[] | [];
	loading: boolean;
}

export interface INotificationModel {
	id?: number | null;
	title: string;
	message: string;
	status: string;
	nType: string;
	userId: string;
	user?: IUserModel;
	createdAt?: string;
  updatedAt?: string;
}
