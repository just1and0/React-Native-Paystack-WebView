import { Alert } from 'react-native';
import { Currency, DynamicMultiSplitProps, PaymentChannels, PaystackParams, PaystackTransactionResponse } from './types';

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
        close?.();
        break;
      }
      case 'load': {
        if (debug) console.log('[Paystack] Loaded:', data);
        break;
      }
    }
  } catch (e) {
    if (debug) console.warn('[Paystack] Message Error:', e);
  }
};

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
    `key: '${config.publicKey}'`,
    `email: '${config.email}'`,
    `amount: ${config.amount * 100}`,
    config.currency ? `currency: '${config.currency}'` : '',
    `reference: '${config.reference}'`,
    config.metadata ? `metadata: ${JSON.stringify(config.metadata)}` : '',
    config.channels ? `channels: ${JSON.stringify(config.channels)}` : '',
    config.plan ? `plan: '${config.plan}'` : '',
    config.invoice_limit ? `invoice_limit: ${config.invoice_limit}` : '',
    config.subaccount ? `subaccount: '${config.subaccount}'` : '',
    config.split_code ? `split_code: '${config.split_code}'` : '',
    config.split ? `split: ${JSON.stringify(config.split)}` : '',
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
      <script src="https://js.paystack.co/v2/inline.js"></script>
      <script>
        function payWithPaystack() {
          var paystack = new PaystackPop();
          paystack.${method}({
            ${params}
          });
        }
      </script>
    </body>
    </html>
  `;
