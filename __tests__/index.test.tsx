import { validateParams, sanitize, generatePaystackParams } from '../development/utils';
import { Alert } from 'react-native';

jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() }
}));

describe('Paystack Utils', () => {
  describe('validateParams', () => {
    it('should return true for valid params', () => {
      const result = validateParams({
        email: 'test@example.com',
        amount: 5000,
        onSuccess: jest.fn(),
        onCancel: jest.fn()
      }, false);
      expect(result).toBe(true);
    });

    it('should fail with missing email and show alert', () => {
      const result = validateParams({
        email: '',
        amount: 5000,
        onSuccess: jest.fn(),
        onCancel: jest.fn()
      }, true);
      expect(result).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith('Payment Error', expect.stringContaining('Email is required'));
    });

    it('should fail with invalid amount', () => {
      const result = validateParams({
        email: 'test@example.com',
        amount: 0,
        onSuccess: jest.fn(),
        onCancel: jest.fn()
      }, true);
      expect(result).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith('Payment Error', expect.stringContaining('Amount must be a valid number'));
    });

    it('should fail with missing callbacks', () => {
      const result = validateParams({
        email: 'test@example.com',
        amount: 1000,
        onSuccess: undefined,
        onCancel: undefined
      } as any, true);
      expect(result).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith('Payment Error', expect.stringContaining('onSuccess callback is required'));
    });
  });

  describe('sanitize', () => {
    it('should wrap string by default', () => {
      expect(sanitize('hello', '', true)).toBe("'hello'");
    });

    it('should return stringified object', () => {
      expect(sanitize({ test: true }, {})).toBe(JSON.stringify({ test: true }));
    });

    it('should return fallback on error', () => {
      const circular = {};
      // @ts-ignore
      circular.self = circular;
      expect(sanitize(circular, 'fallback')).toBe(JSON.stringify('fallback'));
    });
  });

  describe('generatePaystackParams', () => {
    it('should generate JS object string with all fields', () => {
      const js = generatePaystackParams({
        publicKey: 'pk_test',
        email: 'email@test.com',
        amount: 100,
        reference: 'ref123',
        metadata: { order: 123 },
        currency: 'NGN',
        channels: ['card']
      });
      expect(js).toContain("key: 'pk_test'");
      expect(js).toContain("email: 'email@test.com'");
      expect(js).toContain("amount: 10000");
    });
  });
});