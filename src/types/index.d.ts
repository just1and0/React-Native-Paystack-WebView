export type Currency = 'NGN' | 'GHS' | 'USD' | 'ZAR';

export type PaymentChannels = 'bank' | 'card' | 'qr' | 'ussd' | 'mobile_money';

interface Response {
  status: string;
}
interface SuccessResponse extends Response {
  transactionRef?: string;
  data?: any;
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
  handleWebViewMessage?: (string) => void;
  onCancel: (Response) => void;
  onSuccess: (SuccessResponse) => void;
  autoStart?: boolean;
  activityIndicatorColor?: string;
}

export interface PayStackRef {
  startTransaction: () => void;
  endTransaction: () => void;
}
