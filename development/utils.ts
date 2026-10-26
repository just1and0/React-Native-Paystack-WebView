import { Alert, Linking } from 'react-native';
import { Currency, DynamicMultiSplitProps, PaymentChannels, PaystackParams, PaystackTransactionResponse } from './types';

export const shouldHandleExternally = (
  url: string,
  hosts: Array<string | RegExp>
): boolean =>
  !!url &&
  hosts.some((matcher) =>
    typeof matcher === 'string' ? url.indexOf(matcher) === 0 : matcher.test(url)
  );

export const openExternalUrl = async (url: string, debug = false): Promise<void> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      if (debug) console.log('[Paystack] No app can handle URL:', url);
      return;
    }
    await Linking.openURL(url);
  } catch (err) {
    if (debug) console.log('[Paystack] Linking.openURL failed:', err);
  }
};

export const validateParams = (params: PaystackParams, debug: boolean): boolean => {
  const errors: string[] = [];
  if (!params.email) errors.push('Email is required');
  if (!params.amount || typeof params.amount !== 'number' || params.amount <= 0) {
    errors.push('Amount must be a valid number greater than 0');
  }
  if (!params.onSuccess || typeof params.onSuccess !== 'function') {
    errors.push('onSuccess callback is required and must be a function');
  }
  if (!params.onCancel || typeof params.onCancel !== 'function') {
    errors.push('onCancel callback is required and must be a function');
  }

  if (errors.length > 0) {
    debug && console.warn('Paystack Validation Errors:', errors);
    Alert.alert('Payment Error', errors.join('\n'));
    return false;
  }
  return true;
};

export const sanitize = (
  value: unknown,
  fallback: string | number | object,
  wrapString = true
): string => {
  try {
    if (typeof value === 'string') return wrapString ? `'${value}'` : value;
    return JSON.stringify(value ?? fallback);
  } catch (e) {
    return JSON.stringify(fallback);
  }
};

export const handlePaystackMessage = ({
  event,
  debug,
  params,
  onGlobalSuccess,
  onGlobalCancel,
  close,
}: {
  event: any;
  debug: boolean;
  params: PaystackParams | null;
  onGlobalSuccess?: (data: PaystackTransactionResponse) => void;
  onGlobalCancel?: () => void;
  close?: () => void;
}) => {
  try {
    const data = JSON.parse(event.nativeEvent.data);
    if (debug) console.log('[Paystack] Message Received:', data);

    switch (data.event) {
      case 'success': {
        if (debug) console.log('[Paystack] Success:', data.data);
        params?.onSuccess(data.data);
        onGlobalSuccess?.(data.data);
        close?.();
        break;
      }
      case 'cancel': {
        if (debug) console.log('[Paystack] Cancelled');
        params?.onCancel();
        onGlobalCancel?.();
        close?.();
        break;
      }
      case 'error': {
        if (debug) console.error('[Paystack] Error:', data.error);
        params?.onError?.(data.error);
        close?.();
        break;
      }
      case 'load': {
        if (debug) console.log('[Paystack] Loaded:', data);
        params?.onLoad?.(data.data);
        break;
      }
    }
  } catch (e) {
    if (debug) console.warn('[Paystack] Message Error:', e);
  }
};

/**
 * Serialises a value for embedding in the inline <script>. JSON.stringify escapes
 * quotes and backslashes, so an email like o'brien@example.com no longer ends the
 * string early and breaks the whole checkout script. `<` is escaped too, so a
 * value containing `</script>` can't close the script tag, and U+2028/U+2029 are
 * escaped because they are valid in JSON but end a line in older JS engines.
 */
export const toJsLiteral = (value: unknown): string =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

/** Paystack expects the amount in the smallest unit as an integer (e.g. kobo). */
export const toSubunit = (amount: number): number => Math.round(amount * 100);

export const generatePaystackParams = (config: {
  publicKey: string;
  email: string;
  amount: number;
  reference: string;
  metadata?: object;
  currency?: Currency;
  channels: PaymentChannels;
  plan?: string;
  invoice_limit?: number;
  subaccount?: string;
  split_code?: string;
  split?: DynamicMultiSplitProps;
}): string => {
  const props = [
    `key: ${toJsLiteral(config.publicKey)}`,
    `email: ${toJsLiteral(config.email)}`,
    `amount: ${toSubunit(config.amount)}`,
    config.currency ? `currency: ${toJsLiteral(config.currency)}` : '',
    `reference: ${toJsLiteral(config.reference)}`,
    config.metadata ? `metadata: ${toJsLiteral(config.metadata)}` : '',
    config.channels ? `channels: ${toJsLiteral(config.channels)}` : '',
    config.plan ? `plan: ${toJsLiteral(config.plan)}` : '',
    config.invoice_limit ? `invoice_limit: ${toJsLiteral(config.invoice_limit)}` : '',
    config.subaccount ? `subaccount: ${toJsLiteral(config.subaccount)}` : '',
    config.split_code ? `split_code: ${toJsLiteral(config.split_code)}` : '',
    config.split ? `split: ${toJsLiteral(config.split)}` : '',
    `onSuccess: function(response) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'success', data: response }));
      }`,
    `onCancel: function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'cancel' }));
      }`,
    `onLoad: function(response) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'load', data: response }));
      }`,
    `onError: function(error) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'error', error: { message: error.message } }));
      }`
  ];

  return props.filter(Boolean).join(',\n');
};

export const paystackHtmlContent = (
  params: string,
  method: 'checkout' | 'newTransaction' = 'checkout'
): string => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Paystack</title>
    </head>
    <body onload="payWithPaystack()" style="background-color:#fff;height:100vh">
      <script>
        // Without these, a checkout that never starts (offline, or Paystack's
        // script blocked) left a blank modal and no callback ever fired.
        function reportError(message) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'error', error: { message: message } }));
        }
      </script>
      <script
        src="https://js.paystack.co/v2/inline.js"
        onerror="reportError('Could not load Paystack. Check your internet connection and try again.')"
      ></script>
      <script>
        function payWithPaystack() {
          if (typeof PaystackPop === 'undefined') return;
          try {
            var paystack = new PaystackPop();
            paystack.${method}({
              ${params}
            });
          } catch (e) {
            reportError((e && e.message) || 'Could not start the payment.');
          }
        }
      </script>
    </body>
    </html>
  `;
