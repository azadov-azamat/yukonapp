import {UserDataProps} from "./auth.interface.ts";
import {defaultKeys, productCardProps} from "./variable.interface.ts";

export interface LikeInitialStateProps {
    loading: boolean;
    likes: likeDataProps[] | [];
    like: likeDataProps | null;

    currentPage: number;
    pageCount: number;
    limit: number;
    totalCount: number;
}

export interface likeDataProps extends defaultKeys{
    liked: boolean;
    owner?: UserDataProps | null;
    product: productCardProps;
}
