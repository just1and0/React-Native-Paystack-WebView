import { validateParams, sanitize, generatePaystackParams, shouldHandleExternally, openExternalUrl, handlePaystackMessage, paystackHtmlContent, toJsLiteral, toSubunit } from '../development/utils';
import { Alert, Linking } from 'react-native';

jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() },
  Linking: { canOpenURL: jest.fn(), openURL: jest.fn() }
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
      expect(js).toContain('key: "pk_test"');
      expect(js).toContain('email: "email@test.com"');
      expect(js).toContain("amount: 10000");
    });

    // Evaluates the generated object literal, as the WebView would.
    const evaluate = (js: string) => new Function(`return {${js}};`)();

    it('keeps the script valid when a value contains a quote', () => {
      const js = generatePaystackParams({
        publicKey: 'pk_test',
        email: "o'brien@example.com",
        amount: 100,
        reference: 'ref123',
        channels: ['card'],
      });
      expect(evaluate(js).email).toBe("o'brien@example.com");
    });

    it('cannot close the script tag from inside a value', () => {
      const js = generatePaystackParams({
        publicKey: 'pk_test',
        email: 'a@b.com',
        amount: 100,
        reference: 'ref123',
        metadata: { note: '</script><script>alert(1)</script>' },
        channels: ['card'],
      });
      expect(js).not.toContain('</script>');
      expect(evaluate(js).metadata.note).toBe('</script><script>alert(1)</script>');
    });

    it('sends a whole number of subunits', () => {
      const js = generatePaystackParams({
        publicKey: 'pk_test',
        email: 'a@b.com',
        amount: 19.99,
        reference: 'ref123',
        channels: ['card'],
      });
      expect(evaluate(js).amount).toBe(1999);
    });
  });

  describe('toJsLiteral', () => {
    it('escapes characters that break an inline script', () => {
      expect(toJsLiteral('</script>')).toBe('"\\u003c/script>"');
      expect(toJsLiteral('a\u2028b')).toBe('"a\\u2028b"');
    });
  });

  describe('toSubunit', () => {
    it('rounds to an integer', () => {
      expect(toSubunit(19.99)).toBe(1999);
      expect(toSubunit(10.5)).toBe(1050);
      expect(toSubunit(5000)).toBe(500000);
    });
  });

  describe('handlePaystackMessage', () => {
    const messageEvent = (payload: object) => ({ nativeEvent: { data: JSON.stringify(payload) } });
    const baseParams = () => ({
      email: 'a@b.com',
      amount: 100,
      onSuccess: jest.fn(),
      onCancel: jest.fn(),
      onLoad: jest.fn(),
      onError: jest.fn(),
    });

    it('passes the load event to onLoad', () => {
      const params = baseParams();
      const loaded = { id: '1', accessCode: 'ac_1', customer: {} };
      handlePaystackMessage({ event: messageEvent({ event: 'load', data: loaded }), debug: false, params });
      expect(params.onLoad).toHaveBeenCalledWith(loaded);
    });

    it('passes errors to onError and closes the modal', () => {
      const params = baseParams();
      const close = jest.fn();
      handlePaystackMessage({
        event: messageEvent({ event: 'error', error: { message: 'boom' } }),
        debug: false,
        params,
        close,
      });
      expect(params.onError).toHaveBeenCalledWith({ message: 'boom' });
      expect(close).toHaveBeenCalled();
    });

    it('still closes on error when no onError was given', () => {
      const close = jest.fn();
      const { onError, ...params } = baseParams();
      handlePaystackMessage({
        event: messageEvent({ event: 'error', error: { message: 'boom' } }),
        debug: false,
        params,
        close,
      });
      expect(close).toHaveBeenCalled();
    });
  });

  describe('paystackHtmlContent', () => {
    it('reports a failure to load or start the checkout', () => {
      const html = paystackHtmlContent('key: "pk_test"');
      expect(html).toContain('onerror=');
      expect(html).toContain("typeof PaystackPop === 'undefined'");
      expect(html).toContain('catch (e)');
    });
  });

  describe('shouldHandleExternally', () => {
    it('matches a string host by prefix', () => {
      expect(
        shouldHandleExternally('https://joinzap.com/app/abc', ['https://joinzap.com/app/'])
      ).toBe(true);
    });

    it('does not match when only part of the URL contains the prefix', () => {
      expect(
        shouldHandleExternally('https://evil.com/?u=https://joinzap.com/app/', ['https://joinzap.com/app/'])
      ).toBe(false);
    });

    it('matches a RegExp host', () => {
      expect(
        shouldHandleExternally('mypartner://pay', [/^mypartner:\/\//])
      ).toBe(true);
    });

    it('returns false when no host matches', () => {
      expect(
        shouldHandleExternally('https://checkout.paystack.com/123', ['https://joinzap.com/app/'])
      ).toBe(false);
    });

    it('returns false for an empty URL', () => {
      expect(shouldHandleExternally('', ['https://joinzap.com/app/'])).toBe(false);
    });
  });

  describe('openExternalUrl', () => {
    beforeEach(() => {
      (Linking.canOpenURL as jest.Mock).mockReset();
      (Linking.openURL as jest.Mock).mockReset();
    });

    it('opens the URL when an app can handle it', async () => {
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      (Linking.openURL as jest.Mock).mockResolvedValue(undefined);

      await openExternalUrl('https://joinzap.com/app/abc');

      expect(Linking.canOpenURL).toHaveBeenCalledWith('https://joinzap.com/app/abc');
      expect(Linking.openURL).toHaveBeenCalledWith('https://joinzap.com/app/abc');
    });

    it('does not open the URL when no app can handle it', async () => {
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(false);

      await openExternalUrl('mypartner://pay');

      expect(Linking.openURL).not.toHaveBeenCalled();
    });

    it('swallows errors instead of throwing', async () => {
      (Linking.canOpenURL as jest.Mock).mockRejectedValue(new Error('boom'));

      await expect(openExternalUrl('https://joinzap.com/app/abc')).resolves.toBeUndefined();
      expect(Linking.openURL).not.toHaveBeenCalled();
    });
  });
});