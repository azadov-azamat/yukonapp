export interface LoadInitialProps {
    load: loadDataProps | null;
    loads: loadDataProps[] | [];
    loading: boolean;
}

export interface loadDataProps {
    url: string;
    originCityName: string;
    destinationCityName: string;
    price: number;
    distance: number;
    distanceSeconds: number;
    telegram: string;
    phone: string;
    goods: string;
    cargoType: string;
    cargoType2: string;
    paymentType: string;
    description: string;
    loadReadyDate: string;
    loadingSide: string;
    customsClearanceLocation: string;
    weight: number;
    isDagruz: boolean;
    hasPrepayment: boolean;
    isLikelyOwner: boolean;
    isArchived?: boolean; // Default qiymat false
    isDeleted?: boolean; // Default qiymat false
    openMessageCounter?: number; // Default qiymat 0
    phoneViewCounter?: number; // Default qiymat 0
    prepaymentAmount?: number; // Default qiymat 0
    expirationButtonCounter?: number; // Default qiymat 0
    createdAt: Date;
    updatedAt: Date;
    loading?: boolean; // Default qiymat yo'q
    isWebAd?: boolean; // Default qiymat true
}