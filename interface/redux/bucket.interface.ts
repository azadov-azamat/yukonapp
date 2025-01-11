import {UserDataProps} from "./auth.interface.ts";
import {defaultKeys, productCardProps} from "./variable.interface.ts";

export interface BucketInitialStateProps {
    loading: boolean;
    buckets: bucketProps[] | [];
    bucket: bucketProps | null;

    currentPage: number;
    pageCount: number;
    limit: number;
    totalCount: number;
}

export interface bucketProps extends defaultKeys{
    count: number;
    size: string;
    product: productCardProps | null;
    user?: UserDataProps | null;
}