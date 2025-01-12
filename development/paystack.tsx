import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  useCallback,
} from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import {
  buildKeyValueString,
  dynamicSplitObjectIsValid,
  getAmountValueInKobo,
  getChannels,
  paystackHtmlContent,
} from "./utils/helper";
import { PayStackProps, PayStackRef } from "./types";
import { styles } from "./style";

const CLOSE_URL = "https://standard.paystack.co/close";

const Paystack = forwardRef<PayStackRef, PayStackProps>(
  (
    {
      paystackKey,
      billingEmail,
      phone,
      lastName,
      firstName,
      amount = "0.00",
      currency = "NGN",
      channels = ["card"],
      refNumber,
      billingName,
      plan,
      invoice_limit,
      subaccount,
      split_code,
      split,
      handleWebViewMessage,
      onCancel,
      autoStart = false,
      onSuccess,
      activityIndicatorColor = "green",
      modalProps,
      metadata,
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const webViewRef = useRef<WebView>(null);

    useEffect(() => {
      if (autoStart) {
        setShowModal(true);
      }
    }, [autoStart]);

    useImperativeHandle(ref, () => ({
      startTransaction: () => setShowModal(true),
      endTransaction: () => setShowModal(false),
    }));

    const generatePaystackParams = () => {

      const params = [
        buildKeyValueString("key", paystackKey),
        buildKeyValueString("email", billingEmail),
        buildKeyValueString("firstname", firstName),
        buildKeyValueString("lastname", lastName),
        buildKeyValueString("phone", `${phone}`),
        buildKeyValueString("amount", `${getAmountValueInKobo(amount)}`),
        buildKeyValueString("currency", currency),
        getChannels(channels),
        buildKeyValueString("ref", refNumber),
        buildKeyValueString("subaccount", subaccount),
        buildKeyValueString("split_code", split_code),
        buildKeyValueString("plan", plan),
        buildKeyValueString("invoice_limit", invoice_limit?.toString()),
        dynamicSplitObjectIsValid(split)
          ? `split: ${JSON.stringify(split)},`
          : "",
        metadata
          ? `metadata: ${metadata},`
          : `metadata: { custom_fields: [{ display_name: '${firstName} ${lastName}', variable_name: '${billingName}', value: '' }]},`,
      ];
      return params.filter(Boolean).join("\n");
    };


    const HTML_CONTENT = paystackHtmlContent(generatePaystackParams());

    const handleMessageReceived = useCallback(
      (data: string) => {
        const webResponse = JSON.parse(data);

        switch (webResponse.event) {
          case "cancelled":
            onCancel?.({ status: "cancelled", data: webResponse });
            setShowModal(false);
            break;

          case "successful":
            onSuccess?.({
              status: "success",
              transactionRef: webResponse.transactionRef,
              data: webResponse,
            });
            setShowModal(false);
            break;

          default:
            handleWebViewMessage?.({ status: "error", data: webResponse });
            break;
        }
      },
      [handleWebViewMessage, onCancel, onSuccess]
    );

    const handleNavigationStateChange = useCallback(
      (state: WebViewNavigation) => {
        if (state.url === CLOSE_URL) {
          setShowModal(false);
        }
      },
      []
    );

    const handleError = useCallback(
      (error: any) => {
        handleWebViewMessage?.({ status: "error", data: error });
        setShowModal(false);
      },
      [handleWebViewMessage]
    );

    return (
      <Modal
        style={styles.modalContainer}
        visible={showModal}
        animationType="slide"
        transparent={false}
        {...modalProps}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <WebView
            style={styles.webView}
            source={{ html: HTML_CONTENT }}
            onError={handleError}
            onMessage={(e) => handleMessageReceived(e.nativeEvent.data)}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onNavigationStateChange={handleNavigationStateChange}
            ref={webViewRef}
            cacheEnabled={false}
            cacheMode="LOAD_NO_CACHE"
          />
          {isLoading && (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" color={activityIndicatorColor} />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
  }
);

export default Paystack;
