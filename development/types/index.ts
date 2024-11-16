import * as React from 'react';
import { ModalProps } from 'react-native';
export type Currency = 'NGN' | 'GHS' | 'USD' | 'ZAR' | 'KES';

export type PaymentChannels = 'bank' | 'card' | 'qr' | 'ussd' | 'mobile_money' | 'bank_transfer' | 'eft' | 'apple_pay';

export type SplitTypes = 'flat' | 'percentage';

export type ChargeBearerTypes = 'all' | 'all-proportional' | 'account' | 'subaccount';

interface Response {
  status: string;
}
interface SuccessResponse extends Response {
  transactionRef?: string;
  data?: any;
}
interface DynamicSplitSubAccountInterface {
  subaccount: string;
  share: string;
}

export interface DynamicMultiSplitProps {
  type: SplitTypes;
  bearer_type: ChargeBearerTypes;
  subaccounts: DynamicSplitSubAccountInterface[];
  bearer_subaccount?: string; // only if bearer_type is 'subaccount'
  reference?: string;
}

type CustomField = {
  display_name: string;
  variable_name: string;
  value: string | number;
};

type CustomFilters = {
  recurring?: boolean;
  banks?: string[];
  card_brands?: ('verve' | 'visa' | 'mastercard')[];
  supported_mobile_money_providers?: ('mtn' | 'atl' | 'vod')[];
};

type Metadata = {
  cart_id?: string | number;
  custom_fields?: CustomField[];
  cancel_action?: string;
  custom_filters?: CustomFilters;
};

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
  plan?: string;
  invoice_limit?: number;
  subaccount?: string;  
  split_code?: string;
  split?: DynamicMultiSplitProps;
  handleWebViewMessage?: (string: string) => void;
  onCancel: (Response: Response) => void;
  onSuccess: (SuccessResponse:SuccessResponse) => void;
  autoStart?: boolean;
  activityIndicatorColor?: string;
  ref: React.ReactElement;
  modalProps?: ModalProps;
  metadata?: Metadata;
}

export interface PayStackRef {
  startTransaction: () => void;
  endTransaction: () => void;
}
