import React, { createContext, useCallback, useMemo, useState } from 'react';
import { Modal, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    PaystackParams,
    PaystackProviderProps,
    TransactionMethod
} from './types';
import { validateParams, paystackHtmlContent, generatePaystackParams, handlePaystackMessage, shouldHandleExternally, openExternalUrl } from './utils';
import { styles } from './styles';

export const DEFAULT_DEEP_LINK_HOSTS: string[] = [
    'https://joinzap.com/app/',
];

export const PaystackContext = createContext<{
    popup: {
        checkout: (params: PaystackParams) => void;
        newTransaction: (params: PaystackParams) => void;
        resumeTransaction: (params: PaystackParams) => void;
    };
} | null>(null);

export const PaystackProvider: React.FC<PaystackProviderProps> = ({
    publicKey,
    currency,
    defaultChannels = ['card'],
    deepLinkHosts = [],
    debug = false,
    children,
    onGlobalSuccess,
    onGlobalCancel,
}) => {
    const [visible, setVisible] = useState(false);
    const [params, setParams] = useState<PaystackParams | null>(null);
    const [method, setMethod] = useState<TransactionMethod>(TransactionMethod.CHECKOUT);

    const fallbackRef = useMemo(() => `ref_${Date.now()}`, []);

    const resolvedDeepLinkHosts = useMemo(
        () => [...DEFAULT_DEEP_LINK_HOSTS, ...deepLinkHosts],
        [deepLinkHosts]
    );

    const open = useCallback(
        (params: PaystackParams, selectedMethod: TransactionMethod) => {
            if (debug) console.log(`[Paystack] Opening modal with method: ${selectedMethod}`);
            if (!validateParams(params, debug)) return;
            setParams(params);
            setMethod(selectedMethod);
            setVisible(true);
        },
        [debug]
    );

    const checkout = (params: PaystackParams) => open(params, TransactionMethod.CHECKOUT);
    const newTransaction = (params: PaystackParams) => open(params, TransactionMethod.NEW_TRANSACTION);
    const resumeTransaction = (params: PaystackParams) => open(params, TransactionMethod.RESUME_TRANSACTION);

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
                ...(currency && { currency }),
                channels: defaultChannels, 
                plan: params.plan,
                invoice_limit: params.invoice_limit,
                subaccount: params.subaccount,
                split: params.split,
                split_code: params.split_code,
                accessCode: params.accessCode,
            }),
            method
        );
    }, [params, method]);

    if (debug && visible) {
        console.log('[Paystack] HTML Injected:', paystackHTML);
    }

    return (
        <PaystackContext.Provider value={{ popup: { checkout, newTransaction, resumeTransaction } }}>
            {children}
            <Modal visible={visible} transparent animationType="slide">
                <SafeAreaView style={styles.container}>
                    <WebView
                        originWhitelist={["*"]}
                        source={{ html: paystackHTML }}
                        onMessage={handleMessage}
                        onShouldStartLoadWithRequest={(request) => {
                            const url = request.url ?? '';
                            if (!shouldHandleExternally(url, resolvedDeepLinkHosts)) {
                                return true;
                            }
                            if (debug) console.log('[Paystack] Opening external/deep link via OS:', url);
                            void openExternalUrl(url, debug);
                            return false;
                        }}
                        javaScriptEnabled
                        domStorageEnabled
                        startInLoadingState
                        onLoadStart={() => debug && console.log('[Paystack] WebView Load Start')}
                        onLoadEnd={() => debug && console.log('[Paystack] WebView Load End')}
                        renderLoading={() => <ActivityIndicator size="large" />}
                    />
                </SafeAreaView>
            </Modal>
        </PaystackContext.Provider>
    );
};
