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
  useImperativeHandle
} from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
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
    }
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
                                currency: "NGN",
                                ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
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
                                   //postMessage(JSON.stringify(resp))
                                   window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                                }
                                });
                                handler.openIframe();
                                }
                      </script> 
              </body>
      </html> 
      `;

  const messageRecived = data => {
    var webResponse = JSON.parse(data);
    switch (webResponse.event) {
      case "cancelled":
        setshowModal(false);
        props.onCancel();

        break;

      case "successful":
        setshowModal(false);
        const reference = webResponse.transactionRef.reference;

        fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + props.paystackSecretKey
          })
        })
          .then(response => response.json())
          .then(data => {
            props.onSuccess({
              status: "success",
              data: webResponse.transactionRef,
              cardDetails: data.data.authorization
            });
          })
          .catch(error => {
            props.onCancel();
          });
        break;

      default:
        setshowModal(false);
        props.onCancel();

        break;
    }
  };

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
            onMessage={e => {
              messageRecived(e.nativeEvent.data);
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
      {props.showPayButton && (
        <TouchableOpacity
          style={props.btnStyles}
          onPress={() => setshowModal(true)}
        >
          <Text style={props.textStyles}>{props.buttonText}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

export default forwardRef(Paystack);

Paystack.defaultProps = {
  buttonText: "Pay Now",
  amount: 10,
  ActivityIndicatorColor: "green",
  autoStart: false,
  showPayButton: true
};
