/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { WebView } from "react-native-webview";

function Paystack(props, ref) {
  const [isLoading, setisLoading] = useState(true);
  const [showModal, setshowModal] = useState(false);

  useEffect(() => {
    autoStartCheck();
  }, []);

  const autoStartCheck = () => {
    if (props.autoStart) {
      setshowModal(true);
    }
  };

  useImperativeHandle(ref, () => ({
    StartTransaction() {
      setshowModal(true);
    },
    endTransaction() {
      setshowModal(false);
    },
  }));

  const Paystackcontent = `   
      <!DOCTYPE html>
      <html lang="en">
              <head>
                      <meta charset="UTF-8">
                      <meta http-equiv="X-UA-Compatible" content="ie=edge">
                      <!-- Latest compiled and minified CSS -->
                      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                      <!-- Fonts -->
                      <link rel="dns-prefetch" href="//fonts.gstatic.com">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">
                      <title>SUBSCRIPTION</title>
              </head>
              <body  onload="payWithPaystack()" style="background-color:#fff;height:100vh ">
                      <script src="https://js.paystack.co/v1/inline.js"></script>
                      <script type="text/javascript">
                              window.onload = payWithPaystack;
                              function payWithPaystack(){
                              var handler = PaystackPop.setup({ 
                                key: '${props.paystackKey}',
                                email: '${props.billingEmail}',
                                amount: ${props.amount}00, 
                                channels: ${props.channels},
                                currency: ${props.currency},
                                ref: '${props.refNumber}', // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
                                metadata: {
                                custom_fields: [
                                        {
                                        display_name:  '${props.billingName}',
                                        variable_name:  '${props.billingName}',
                                        value:''
                                        }
                                ]
                                },
                                callback: function(response){
                                      var resp = {event:'successful', transactionRef:response};
                                       window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                                },
                                onClose: function(){
                                   var resp = {event:'cancelled'};
                                   window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                                }
                                });
                                handler.openIframe();
                                }
                      </script> 
              </body>
      </html> 
      `;

  const messageReceived = (data) => {
    var webResponse = JSON.parse(data);
    if (props.handleWebViewMessage) {
      props.handleWebViewMessage(data);
    }
    switch (webResponse.event) {
      case "cancelled":
        setshowModal(false);
        props.onCancel({ status: "cancelled" });
        break;

      case "successful":
        setshowModal(false);
        const reference = webResponse.transactionRef;

        props.onSuccess({
          status: "success",
          transactionRef: reference,
          data: webResponse,
        });
        break;

      default:
        if (props.handleWebViewMessage) {
          props.handleWebViewMessage(data);
        }
        break;
    }
  };

  const showPaymentModal = () => {
    setshowModal(true);
  };

  const button = props.renderButton ? (
    props.renderButton(showPaymentModal)
  ) : (
    <TouchableOpacity
      style={props.btnStyles}
      onPress={() => showPaymentModal()}
    >
      <Text style={props.textStyles}>{props.buttonText}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[{ flex: 1 }, props.SafeAreaViewContainer]}>
      <Modal
        style={[{ flex: 1 }]}
        visible={showModal}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={[{ flex: 1 }, props.SafeAreaViewContainerModal]}>
          <WebView
            style={[{ flex: 1 }]}
            source={{ html: Paystackcontent }}
            onMessage={(e) => {
              messageReceived(e.nativeEvent.data);
            }}
            onLoadStart={() => setisLoading(true)}
            onLoadEnd={() => setisLoading(false)}
          />

          {isLoading && (
            <View>
              <ActivityIndicator
                size="large"
                color={props.ActivityIndicatorColor}
              />
            </View>
          )}
        </SafeAreaView>
      </Modal>
      {props.showPayButton && button}
    </SafeAreaView>
  );
}

export default forwardRef(Paystack);

Paystack.defaultProps = {
  buttonText: "Pay Now",
  amount: 10,
  ActivityIndicatorColor: "green",
  autoStart: false,
  showPayButton: true,
  currency: "NGN",
  refNumber: "" + Math.floor(Math.random() * 1000000000 + 1),
  channels: ["card"],
};
