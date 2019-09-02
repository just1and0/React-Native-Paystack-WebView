/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from 'react'
import {
  WebView,
  Modal,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { WebView } from 'react-native-webview'

export default class Paystack extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  Paystack = {
    html: `  
      <!DOCTYPE html>
      <html lang="en">
              <head>
                      <meta charset="UTF-8">
                      <meta http-equiv="X-UA-Compatible" content="ie=edge">
                      <!-- Latest compiled and minified CSS -->
                      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                      <!-- Fonts -->
                      <link rel="dns-prefetch" href="//fonts.gstatic.com">
                      <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">
                      <title>SUBSCRIPTION</title>
              </head>
              <body  onload="payWithPaystack()" style="background-color:#fff;height:100vh ">
                      <script src="https://js.paystack.co/v1/inline.js"></script>
                      <script type="text/javascript">
                              window.onload = payWithPaystack;
                              function payWithPaystack(){
                              var handler = PaystackPop.setup({ 
                                key: '${this.props.paystackKey}',
                                email: '${this.props.billingEmail}',
                                amount: ${this.props.amount}00,
                                currency: "NGN",
                                ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
                                metadata: {
                                custom_fields: [
                                        {
                                        display_name:  '${ this.props.billingName}',
                                        variable_name:  '${this.props.billingName}',
                                        value:''
                                        }
                                ]
                                },
                                callback: function(response){
                                      var resp = {event:'successful', transactionRef:response.reference};
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
      `
  }

  messageRecived = data => {
    var webResponse = JSON.parse(data)
    switch (webResponse.event) {
      case 'cancelled':
        this.setState({ showModal: false }, () => {
          this.props.onCancel()
        })
        break

      case 'successful':
        this.setState({ showModal: false }, () => {
          this.props.onSuccess(webResponse.transactionRef)
        })
        break

      default:
        this.setState({ showModal: false }, () => {
          this.props.onCancel()
        })
        break
    }
  }

  render () {
    return (
      <View>
        <Modal
          visible={this.state.showModal}
          animationType='slide'
          transparent={false}
        >
          <WebView
            javaScriptEnabled
            javaScriptEnabledAndroid
            originWhitelist={['*']}
            ref={webView => (this.MyWebView = webView)}
            source={this.Paystack}
            onMessage={e => {
              this.messageRecived(e.nativeEvent.data)
            }}
            onLoadStart={() => this.setState({ isLoading: true })}
            onLoadEnd={() => this.setState({ isLoading: false })}
          />
          {/* Start of Loading modal */}
          {this.state.isLoading && (
            <View>
              <ActivityIndicator
                size='large'
                color={this.props.ActivityIndicatorColor}
              />
            </View>
          )}
        </Modal>
        <TouchableOpacity
          style={this.props.btnStyles}
          onPress={() => this.setState({ showModal: true })}
        >
          <Text style={this.props.textStyles}>{this.props.buttonText}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

Paystack.defaultProps = {
  buttonText: 'Pay Now',
  amount: 10,
  ActivityIndicatorColor: 'green'
}
