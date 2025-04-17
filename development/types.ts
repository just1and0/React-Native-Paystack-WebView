export type PaystackTransactionResponse = {
    reference: string;
    trans: string;
    transaction: string;
    status: string;
    message?: string;
};

export type PaystackOnloadResponse = { id: string; accessCode: string; customer: Record<string, any> }

export type PaystackProviderProps = {
    publicKey: string;
    currency?: Currency;
    defaultChannels?: PaymentChannels;
    debug?: boolean;
    children: React.ReactNode;
    onGlobalSuccess?: (data: PaystackTransactionResponse) => void;
    onGlobalCancel?: () => void;
};

export type PaystackParams = {
    email: string;
    amount: number;
    metadata?: Record<string, any>;
    reference?: string;
    plan?: string;
    invoice_limit?: number;
    subaccount?: string;
    split_code?: string;
    split?: DynamicMultiSplitProps;
    onSuccess: (data: PaystackTransactionResponse) => void;
    onCancel: () => void;
    onLoad?: (res: PaystackOnloadResponse) => void;
    onError?: (res: any) => void;
};

export type PaystackCheckoutParams = {
    email: string;
    amount: number;
    reference?: string;
    metadata?: Record<string, any>;
    plan?: string;
    invoice_limit?: number;
    subaccount?: string;
    split_code?: string;
    split?: DynamicMultiSplitProps;
    onSuccess: (res: SuccessResponse) => void;
    onCancel: (res: Response) => void;
    onLoad?: (res: { id: string; accessCode: string; customer: Record<string, any> }) => void;
    onError?: (err: { message: string }) => void;
};

export interface Response {
    status: string;
    data?: string;
}

export interface SuccessResponse extends Response {
    transactionRef?: string;
    data?: any;
}

export type Currency = 'NGN' | 'GHS' | 'USD' | 'ZAR' | 'KES';

export type PaymentChannels = ('bank' | 'card' | 'qr' | 'ussd' | 'mobile_money' | 'bank_transfer' | 'eft' | 'apple_pay')[];

export type SplitTypes = 'flat' | 'percentage';

export type ChargeBearerTypes = 'all' | 'all-proportional' | 'account' | 'subaccount';

interface DynamicSplitSubAccountInterface {
    subaccount: string;
    share: string;
}

export interface DynamicMultiSplitProps {
    type: SplitTypes;
    bearer_type: ChargeBearerTypes;
    subaccounts: DynamicSplitSubAccountInterface[];
    bearer_subaccount?: string;
    reference?: string;
}
