/* eslint-disable prefer-const */
import {
  toAmountInKobo,
  isValidDecimalMonetaryValue,
  isValidStringAmount,
  isNegative,
  toNumber,
  getAmountValueInKobo,
  getChannels,
  buildKeyValueString,
  dynamicSplitObjectIsValid,
  paystackHtmlContent,
} from '../development//utils/helper';
import { DynamicMultiSplitProps, PaymentChannels } from '../development/types';

describe('Utility functions work properly', () => {
  test('getChannels should return a stingified array with comma', () => {
    let testChannels: PaymentChannels[] = ['card', 'bank'];
    let expectedOutput = 'channels: ["card","bank"],';

    const result = getChannels(testChannels);
    expect(result).toBe(expectedOutput);
  });

  test('toAmountInKobo should return kobo value for amount', () => {
    let result = toAmountInKobo('4600.00');
    expect(result).toBe(460000);

    result = toAmountInKobo(1200.93);
    expect(result).toBe(120093);
  });

  test('getAmountValueInKobo should return kobo value for valid amounts', () => {
    let result = getAmountValueInKobo('4600.00');
    expect(result).toBe(460000);

    result = toAmountInKobo('not_correct_money_amount');
    expect(result).toBe(NaN);
  });

  test('isValidDecimalMonetaryValue should return true for only valid amount', () => {
    let result = isValidDecimalMonetaryValue('2500.00');
    expect(result).toBe(true);
  });

  test('isValidStringAmount should return true for only valid amount strings', () => {
    let result = isValidStringAmount('2500.00');
    expect(result).toBe(true);

    result = isValidStringAmount('not_money_amout');
    expect(result).toBe(false);
  });

  test('toNumber should convert string amount to number ', () => {
    const result = toNumber('2500.00');
    expect(result).toBe(2500);
  });
  test('isNegative should return true if amount is negative ', () => {
    let result = isNegative('-200.00');
    expect(result).toBe(true);

    result = isNegative(-200.0);
    expect(result).toBe(true);

    result = isNegative(200.0);
    expect(result).toBe(false);
  });
});

describe('Utility functions work properly', () => {
  test('buildKeyValueString should return correct string for key-value', () => {
    let result = buildKeyValueString('key1', 'value1');
    expect(result).toBe("key1: 'value1',");

    result = buildKeyValueString('key2', undefined);
    expect(result).toBe('');
  });

  test('dynamicSplitObjectIsValid should return true for valid split object', () => {
    const validSplit: DynamicMultiSplitProps = {
      type: 'percentage',
      bearer_type: 'all',
      subaccounts: [{ subaccount: 'sub1', share: '50' }]
    };

    let result = dynamicSplitObjectIsValid(validSplit);
    expect(result).toBe(true);
  });
 
  test('paystackHtmlContent should return HTML with correct params', () => {
    const params = "key1: 'value1', key2: 'value2'";
    const result = paystackHtmlContent(params);
    expect(result).toContain("key1: 'value1',");
    expect(result).toContain("key2: 'value2'");
  });
});