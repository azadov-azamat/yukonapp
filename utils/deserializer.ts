import UserModel from "@/models/user";
import { IUserModel } from "@/interface/redux/user.interface";
import { ILoadModel } from "@/interface/redux/load.interface";
import LoadModel from "@/models/load";
import { ICityModel, IPlanModel, ISubscriptionModel, ICountryModel, IAnalyticsEvent } from "@/interface/redux/variable.interface";
import PlanModel from "@/models/plan";
import { IVehicleModel } from "@/interface/redux/vehicle.interface";
import VehicleModel from "@/models/vehicle";
import SubscriptionModel from "@/models/subscription";
import CityModel from "@/models/city";
import CountryModel from "@/models/country";
import NotificationModel from "@/models/notification";
import { INotificationModel } from "@/interface/redux/notification.interface";
import AnalyticsEvent from "@/models/analytics-event";

export const deserializeUser = (data: IUserModel): UserModel => {
    return new UserModel(data);
};

export const deserializeLoad = (data: ILoadModel): LoadModel => {
    return new LoadModel(data);
};

export const deserializeVehicle = (data: IVehicleModel): VehicleModel => {
	return new VehicleModel(data);
};

export const deserializePlan = (data: IPlanModel): PlanModel => {
    return new PlanModel(data);
};

export const deserializeSubscription = (data: ISubscriptionModel): SubscriptionModel => {
    return new SubscriptionModel(data);
};

export const deserializeCity = (data: ICityModel): CityModel => {
    return new CityModel(data);
};

export const deserializeCountry = (data: ICountryModel): CountryModel => {
	return new CountryModel(data);
};

export const deserializeNotification = (data: INotificationModel): NotificationModel => {
	return new NotificationModel(data);
};

export const deserialiseAnalyticsEvent = (data: IAnalyticsEvent): AnalyticsEvent => {
    return new AnalyticsEvent(data);
}