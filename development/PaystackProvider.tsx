import React, { createContext, useCallback, useMemo, useState } from 'react';
import { Modal, View, ActivityIndicator, } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import {
    PaystackParams,
    PaystackProviderProps,
} from './types';
import { validateParams, paystackHtmlContent, generatePaystackParams, handlePaystackMessage } from './utils';
import { styles } from './styles';

export const PaystackContext = createContext<{
    popup: {
        checkout: (params: PaystackParams) => void;
        newTransaction: (params: PaystackParams) => void;
    };
} | null>(null);

export const PaystackProvider: React.FC<PaystackProviderProps> = ({
    publicKey,
    currency = 'NGN',
    defaultChannels = ['card'],
    debug = false,
    children,
    onGlobalSuccess,
    onGlobalCancel,
}) => {
    const [visible, setVisible] = useState(false);
    const [params, setParams] = useState<PaystackParams | null>(null);
    const [method, setMethod] = useState<'checkout' | 'newTransaction'>('checkout');

    const fallbackRef = useMemo(() => `ref_${Date.now()}`, []);

    const open = useCallback(
        (params: PaystackParams, selectedMethod: 'checkout' | 'newTransaction') => {
            if (debug) console.log(`[Paystack] Opening modal with method: ${selectedMethod}`);
            if (!validateParams(params, debug)) return;
            setParams(params);
            setMethod(selectedMethod);
            setVisible(true);
        },
        [debug]
    );

    const checkout = (params: PaystackParams) => open(params, 'checkout');
    const newTransaction = (params: PaystackParams) => open(params, 'newTransaction');

    const close = () => {
        setVisible(false);
        setParams(null);
    }

    const handleMessage = (event: WebViewMessageEvent) => {
        handlePaystackMessage({
            event,
            debug,
            params,
            onGlobalSuccess,
            onGlobalCancel,
            close,
        });
    };

    const paystackHTML = useMemo(() => {
        if (!params) return '';
        return paystackHtmlContent(
            generatePaystackParams({
                publicKey,
                email: params.email,
                amount: params.amount,
                reference: params.reference || fallbackRef,
                metadata: params.metadata,
                currency,
                channels: defaultChannels,
            }),
            method
        );
    }, [params, method]);

    if (debug && visible) {
        console.log('[Paystack] HTML Injected:', paystackHTML);
    }

    return (
        <PaystackContext.Provider value={{ popup: { checkout, newTransaction } }}>
            {children}
            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.container}>
                    <WebView
                        originWhitelist={["*"]}
                        source={{ html: paystackHTML }}
                        onMessage={handleMessage}
                        javaScriptEnabled
                        domStorageEnabled
                        startInLoadingState
                        onLoadStart={() => debug && console.log('[Paystack] WebView Load Start')}
                        onLoadEnd={() => debug && console.log('[Paystack] WebView Load End')}
                        renderLoading={() => <ActivityIndicator size="large" />}
                    />
                </View>
            </Modal>
        </PaystackContext.Provider>
    );
};