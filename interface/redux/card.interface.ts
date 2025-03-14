export interface CardInitialProps {
    loading: boolean;
    card: cardItemProps | null;
    verifyData: verifyDataProps | null;
    receipt: receiptItemProps | null;
}

export interface receiptItemProps {
    _id: string;
    account: {
        title: string;
        value: string;
        name: string;
        main: boolean;
    }[];
    amount: number;
    cancel_time: number;
    card: any;
    create_time: number;
    pay_time: number;
    state: number;
    commission: number;
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