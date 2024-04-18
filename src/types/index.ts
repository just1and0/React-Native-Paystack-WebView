import * as React from 'react';
export type Currency = 'NGN' | 'GHS' | 'USD' | 'ZAR';

export type PaymentChannels = 'bank' | 'card' | 'qr' | 'ussd' | 'mobile_money';

interface Response {
  status: string;
}
interface SuccessResponse extends Response {
  transactionRef?: string;
  data?: any;
}

interface CustomFieldProps {
  display_name: string,
  variable_name: string,
  value: string
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
  customFields?: CustomFieldProps[];
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
