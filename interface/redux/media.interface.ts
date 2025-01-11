import {defaultKeys, productCardProps} from './variable.interface.ts';
import { UserDataProps } from './auth.interface.ts';

export interface MediaInitialStateProps {
    loading: boolean;
    media: mediaDataProps | null;
    uploadData: uploadDataProps;
}

export interface uploadDataProps {
    id: string;
    uploadUrl: string;
    expires: number;
}
export interface mediaDataProps extends defaultKeys {
    path: string;
    mediaType: 'photo' | 'video';
    contentType: string;
    order?: number;
    previewPath: string;
    product?: productCardProps | null;
    user?: UserDataProps | null;
}