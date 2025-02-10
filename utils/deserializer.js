import UserModel from "@/models/user";
import { IUserModel } from "@/interface/redux/user.interface";
import { ILoadModel } from "@/interface/redux/load.interface";
import LoadModel from "@/models/load";
import { IPlanModel } from "@/interface/redux/variable.interface";
import PlanModel from "@/models/plan";

export const deserializeUser = (data: IUserModel): UserModel => {
    return new UserModel(data);
};

export const deserializeLoad = (data: ILoadModel): LoadModel => {
    return new LoadModel(data);
};

export const deserializePlan = (data: IPlanModel): PlanModel => {
    return new PlanModel(data);
};
