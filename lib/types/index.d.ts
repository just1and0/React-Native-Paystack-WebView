import * as React from 'react';
export declare type Currency = 'NGN' | 'GHS' | 'USD' | 'ZAR';
export declare type PaymentChannels = 'bank' | 'card' | 'qr' | 'ussd' | 'mobile_money';
interface Response {
    status: string;
}
interface SuccessResponse extends Response {
    transactionRef?: string;
    data?: any;
}
export interface PayStackProps {
    paystackKey: string;
    metadata?: object;
    billingEmail: string;
    firstName?: string;
    lastName?: string;
    phone?: string | number;
    amount: string | number;
    currency?: Currency;
    plan?: string;
    channels?: PaymentChannels[];
    refNumber?: string;
    billingName?: string;
    subaccount?: string;
    handleWebViewMessage?: (string: string) => void;
    onCancel: (Response: Response) => void;
    onSuccess: (SuccessResponse: SuccessResponse) => void;
    autoStart?: boolean;
    activityIndicatorColor?: string;
    ref: React.ReactElement;
}
export interface PayStackRef {
    startTransaction: () => void;
    endTransaction: () => void;
}
export {};
