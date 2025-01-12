import validator from 'validator';
import { DynamicMultiSplitProps, PaymentChannels, PayStackProps } from '../types/index';

const { isDecimal, isFloat, isInt, toFloat, toInt } = validator;

type AmountValue = string | number;

function isNumber(value: any): boolean {
  return typeof value === 'number';
}

function isString(value: any): boolean {
  return typeof value === 'string';
}

export function isValidStringAmount(stringAmount: string): boolean {
  if (isString(stringAmount) && stringAmount?.endsWith('.')) {
    return false;
  }

  return isDecimal(stringAmount);
}

export function isValidDecimalMonetaryValue(amountValue: AmountValue | any): boolean {
  if (!isNumber(amountValue) && !isString(amountValue)) {
    return false;
  }

  return isNumber(amountValue) || isValidStringAmount(amountValue);
}

export function isNegative(amountValue: AmountValue): boolean {
  if (typeof amountValue === 'string') {
    return amountValue.startsWith('-');
  }
  return amountValue < 0;
}

export function toNumber(string: string): number {
  if (isFloat(string)) {
    return toFloat(string);
  }

  if (isInt(string)) {
    return toInt(string);
  }
  return +string;
}

export function toString(amountValue: AmountValue) {
  return isNumber(amountValue) ? amountValue.toString() : amountValue;
}

export function toAmountInKobo(amountValue: AmountValue) {
  if (typeof amountValue === 'string') {
    return toNumber(amountValue) * 100;
  }
  return amountValue * 100;
}

export const getAmountValueInKobo = (amount: AmountValue): number => {
  if (isValidDecimalMonetaryValue(amount)) {
    return toAmountInKobo(amount);
  }
  return 0;
};

export const getChannels = (channelsArrary: PaymentChannels[]) => {
  if (channelsArrary?.length > 0) {
    const channelsString = JSON.stringify(channelsArrary);
    return `channels: ${channelsString},`;
  }
  return '';
};

export const buildKeyValueString = (key: string, value: string | undefined) =>
  value ? `${key}: '${value}',` : '';

export const dynamicSplitObjectIsValid = (
  split: DynamicMultiSplitProps | undefined
): split is DynamicMultiSplitProps => {
  return (
    split !== null &&
    typeof split === "object" &&
    split.type &&
    split.bearer_type &&
    Array.isArray(split.subaccounts)
  );
};

export const paystackHtmlContent = (Params: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paystack</title>
</head>
<body onload="payWithPaystack()" style="background-color:#fff;height:100vh">
  <script src="https://js.paystack.co/v2/inline.js"></script>
  <script>
    function payWithPaystack() {
      var paystack = new PaystackPop();
      paystack.newTransaction({
        ${Params}
        onSuccess: function(response) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            event: 'successful',
            transactionRef: response,
          }));
        },
        onCancel: function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            event: 'cancelled',
          }));
        },
      });
    }
  </script>
</body>
</html>
`;

export const generateMetaDataString = (firstName: string, lastName: string, billingName: string, metadata: any) => {
  return metadata
    ? `metadata: ${metadata},`
    : `metadata: { custom_fields: [{ display_name:  '${firstName + " " + lastName}', variable_name:  '${billingName}', value:'' }]},`;
};
