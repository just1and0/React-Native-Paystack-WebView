# React-Native-Paystack-WebView

The package allows you accept payment using paystack and guess what , it doesn't require any form of linking, just install and begin to use .

### Compatibility

Our release cycle is independent of `react-native`. We follow semver and here is the compatibility table:

| `@react-native-paystack-webview` | react-native |
| :------------------------------- | ------------ |
| ^2.0                             | ^0.59        |
| ^3                               | ^0.60        |

### [](https://github.com/just1and0/React-Native-Paystack-WebView#installation)Installation

Add React-Native-Paystack-WebView to your project by running;

`npm install react-native-paystack-webview`

or

`yarn add react-native-paystack-webview`



### **One more thing**

To frontload the installation work, let's also install and configure dependencies used by this project, being **react-native-webview**

run 

``` yarn add react-native-webview ```

for IOS: ```cd iOS && pod install && cd .. ```

for expo applications run;

``` expo install react-native-webview```

and that's it, you're all good to go!



### [](https://github.com/just1and0/React-Native-Paystack-WebView#usage)Usage

```javascript
import PaystackWebView from 'react-native-paystack-webview';
import React, {Component} from 'react';
import {View} from 'react-native';

class MyApp extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <PaystackWebView
          buttonText="Pay Now"
          showPayButton={false}
          paystackKey="your-key-here"
          amount={120000}
          billingEmail="paystackwebview@something.com"
          billingMobile="09787377462"
          billingName="Oluwatobi Shokunbi"
          ActivityIndicatorColor="green"
          SafeAreaViewContainer={{marginTop: 5}}
          SafeAreaViewContainerModal={{marginTop: 5}}
          onCancel={() => {
            alert('cancelled');
          }}
          onSuccess={() => {
            alert('success');
          }}
          autoStart={false}
        />
      </View>
    );
  }
}
```



## Use ref's

make use of ref's to start transaction. See example below;

```javascript import PaystackWebView from 'react-native-paystack-webview';
import React, {useRef} from 'react';
import {View, TouchableOpacity,Text} from 'react-native';
function Pay(){
   const childRef = useRef();

  return(
    <View style={{flex: 1}}>
        <PaystackWebView
          showPayButton={false}
          paystackKey="your-key-here"
          amount={120000}
          billingEmail="paystackwebview@something.com"
          billingMobile="09787377462"
          billingName="Oluwatobi Shokunbi"
          ActivityIndicatorColor="green"
          SafeAreaViewContainer={{marginTop: 5}}
          SafeAreaViewContainerModal={{marginTop: 5}}
          onCancel={() => {  alert('cancelled'); }}
          onSuccess={() => {  alert('success'); }}
           ref={childRef}
        />

            <TouchableOpacity onPress={()=> childRef.current.StartTransaction()}>
             <Text>pay now</Text>
						<TouchableOpacity/>
      </View>
)
}
```



## Note:

You can also make use of the new props `autoStart` to initiate payment once the screen mounts. Just see `autoStart={true}`. This is set to `false` by default.

## API's

#### [](https://github.com/just1and0/object-to-array-convert#all-object-to-array-convert-props)all React-Native-Paystack-WebView API

| Name                         |                       use/description                        |              extra |
| :--------------------------- | :----------------------------------------------------------: | -----------------: |
| `buttonText`                 |                  Defines text on the button                  | default: `Pay Now` |
| `textStyles`                 |              Defines styles for text in button               |             `nill` |
| `btnStyles`                  |                   Defines style for button                   |             `nill` |
| `paystackKey`                | Public or Private paystack key(visit paystack.com to get yours) |             `nill` |
| `amount`                     |                      Amount to be paid                       |             `nill` |
| `ActivityIndicatorColor`     |                       color of loader                        |   default: `green` |
| `billingEmail`               |                        Billers email                         |    default: `nill` |
| `billingMobile`              |                        Billers mobile                        |    default: `nill` |
| `billingName`                |                         Billers Name                         |    default: `nill` |
| `onCancel`                   |              callback function if user cancels               |    default: `nill` |
| `onSuccess`                  | callback function if transaction was successful (it will also return the transactionRef number in the callback ) |    default: `nill` |
| `autoStart`                  |            Auto start payment once page is opened            |   default: `false` |
| `SafeAreaViewContainer`      |              style for SafeAreaView containter               |    default: `nill` |
| `SafeAreaViewContainerModal` |               style for SafeAreaView for modal               |    default: `nill` |
| `showPayButton`              |            Control the Pay Now button visibility             |    default: `true` |

## [](https://github.com/just1and0/object-to-array-convert#contributions)Contributions

What to help make this package even more awesome? [Read how to contribute](https://github.com/just1and0/React-Native-Paystack-WebView/blob/master/contribution.md)

## [](https://github.com/just1and0/React-Native-Paystack-WebView#licensing)Licensing

This project is licensed under MIT license.

## Related Projects

- [React-Native-quidpay-WebView](https://github.com/react-native-nigeria/react-native-quidpay-webview)
- [React-Native-rave-WebView](https://github.com/react-native-nigeria/react-native-rave-webview)

### Don't forget to star, like and share :)

