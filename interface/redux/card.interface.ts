export interface CardInitialProps {
    loading: boolean;
    card: cardItemProps | null;
    verifyData: verifyDataProps | null;
}

export interface cardItemProps {
    expire: string;
    number: string;
    recurrent: boolean;
    token: string;
    type: string;
    verify: boolean
}

export interface verifyDataProps {
    phone: string;
    sent: boolean;
    wait: number;
}