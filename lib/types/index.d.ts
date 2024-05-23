import * as React from 'react';
export declare type Currency = 'NGN' | 'GHS' | 'USD' | 'ZAR';
export declare type PaymentChannels = 'bank' | 'card' | 'qr' | 'ussd' | 'mobile_money';
export declare type SplitTypes = 'flat' | 'percentage';
export declare type ChargeBearerTypes = 'all' | 'all-proportional' | 'account' | 'subaccount';
interface Response {
    status: string;
}
interface SuccessResponse extends Response {
    transactionRef?: string;
    data?: any;
}
interface DynamicSplitSubAccountObject {
    subaccount: string;
    share: string;
}
export interface DynamicMultiSplitObject {
    type: SplitTypes;
    bearer_type: ChargeBearerTypes;
    subaccounts: DynamicSplitSubAccountObject[];
    bearer_subaccount?: string;
    reference?: string;
}
export interface PayStackProps {
    paystackKey: string;
    billingEmail: string;
    firstName?: string;
    lastName?: string;
    phone?: string | number;
    amount: string | number;
    currency?: Currency;
    channels?: PaymentChannels[];
    refNumber?: string;
    billingName?: string;
    subaccount?: string;
    split_code?: string;
    split?: DynamicMultiSplitObject;
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
