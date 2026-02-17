import { Alert, Linking } from 'react-native';
import {
  Currency,
  DynamicMultiSplitProps,
  PaymentChannels,
  PaystackParams,
  PaystackTransactionResponse,
  TransactionMethod,
  TransactionType,
  PaystackGeneratedConfig,
} from './types';

export const shouldHandleExternally = (url: string, hosts: Array<string | RegExp>): boolean =>
  !!url && hosts.some((matcher) => (typeof matcher === 'string' ? url.indexOf(matcher) === 0 : matcher.test(url)));

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

  if (!params.onSuccess || typeof params.onSuccess !== 'function') {
    errors.push('onSuccess callback is required and must be a function');
  }

  if (!params.onCancel || typeof params.onCancel !== 'function') {
    errors.push('onCancel callback is required and must be a function');
  }

  if (params.accessCode) {
    if (typeof params.accessCode !== 'string' || params.accessCode.trim() === '') {
      errors.push('accessCode must be a non-empty string');
    }
    if (params.email || params.amount) {
      errors.push('When accessCode is provided, email and amount should not be included');
    }

    if (errors.length > 0) {
      debug && console.warn('Paystack Validation Errors', errors);
      Alert.alert('Payment Error', errors.join('\n'));
      return false;
    }
    // If accessCode is provided, we assume it's a resume transaction and skip email/amount validation
    return true;
  }

  if (!params.email) errors.push('Email is required');

  if (!params.amount || typeof params.amount !== 'number' || params.amount <= 0) {
    errors.push('Amount must be a valid number greater than 0');
  }

  if (errors.length > 0) {
    debug && console.warn('Paystack Validation Errors:', errors);
    Alert.alert('Payment Error', errors.join('\n'));
    return false;
  }
  return true;
};

export const sanitize = (value: unknown, fallback: string | number | object, wrapString = true): string => {
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
  publicKey?: string;
  email?: string;
  amount?: number;
  reference?: string;
  metadata?: object;
  currency?: Currency;
  channels?: PaymentChannels;
  plan?: string;
  invoice_limit?: number;
  subaccount?: string;
  split_code?: string;
  split?: DynamicMultiSplitProps;
  accessCode?: string;
}): PaystackGeneratedConfig => {
  const callbacks: string = `
    onSuccess: function(response) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'success', data: response }));
    },
    onCancel: function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'cancel' }));
    },
    onLoad: function(response) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'load', data: response }));
    },
    onError: function(error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'error', error: { message: error.message } }));
    }
  `;

  if (config.accessCode && config.accessCode !== '' && config.accessCode !== undefined) {
    return {
      mode: TransactionType.RESUME,
      accessCode: config.accessCode,
      params: callbacks,
    };
  }

  if (!config.email || !config.amount) {
    throw new Error('Email and Amount are required to generate Paystack parameters');
  }
  if (!config.publicKey) {
    throw new Error('Public Key is required to generate Paystack parameters');
  }
  if (!config.reference) {
    throw new Error('Reference is required to generate Paystack parameters');
  }

  const props = [
    `key: '${config.publicKey}'`,
    `email: '${config.email}'`,
    `amount: ${(config.amount || 0) * 100}`,
    config.currency ? `currency: '${config.currency}'` : '',
    `reference: '${config.reference}'`,
    config.metadata ? `metadata: ${JSON.stringify(config.metadata)}` : '',
    config.channels ? `channels: ${JSON.stringify(config.channels)}` : '',
    config.plan ? `plan: '${config.plan}'` : '',
    config.invoice_limit ? `invoice_limit: ${config.invoice_limit}` : '',
    config.subaccount ? `subaccount: '${config.subaccount}'` : '',
    config.split_code ? `split_code: '${config.split_code}'` : '',
    config.split ? `split: ${JSON.stringify(config.split)}` : '',
    callbacks,
  ];

  return {
    mode: TransactionType.STANDARD,
    params: props.filter(Boolean).join(',\n'),
  };
};

export const paystackHtmlContent = (
  params: PaystackGeneratedConfig,
  method: TransactionMethod = TransactionMethod.CHECKOUT,
): string => {
  const functionCall =
    params.mode === TransactionType.RESUME
      ? `paystack.${method}('${params.accessCode}', { ${params.params} });`
      : `paystack.${method}({ ${params.params} });`;

  return `
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
          ${functionCall}
        }
      </script>
    </body>
    </html>
  `;
};
