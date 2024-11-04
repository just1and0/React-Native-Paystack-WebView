import validator from 'validator';
import { PaymentChannels } from './types/index';

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
