 # React-Native-Paystack-WebView

# Screenshots
![](https://i.ibb.co/bRGL24X/dove-1.png "First ScreenShot")![](https://i.ibb.co/hDrJfY8/dove2.png "Loading Screen") ![](https://i.ibb.co/QMnFBCx/dove3.png "Payment Screen")
The package allows you accept payment using paystack and guess what , it doesn't require any form of linking, just install and begin to use .

### Compatibility

Our release cycle is independent of  `react-native`. We follow semver and here is the compatibility table:

|`@react-native-community/cli` | `react-native`|
| :---         |     :---:      | 
|[^1.0.0](https://github.com/react-native-community/cli/tree/1.x)| ^0.59.0|



### [](https://github.com/just1and0/React-Native-Paystack-WebView#installation)Installation

Add React-Native-Paystack-WebView to your project by running;

`npm install react-native-paystack-webview`

or

`yarn add react-native-paystack-webview`

 and that's it, you're all good to go!

### [](https://github.com/just1and0/React-Native-Paystack-WebView#usage)Usage

```javascript
import PaystackWebView from 'React-Native-Paystack-WebView'
import React, { Component } from 'react'
import { View } from 'react-native'

class MyApp extends Component {
  render () {
    return (
      <View style={{ flex: 1 }}>
        <PaystackWebView
          buttonText='Pay Now'
          paystackKey='your key here'
          amount={120000}
          billingEmail='ayoshokz@gmail.com'
          billingMobile='08101274387'
          billingName='Oluwatobi Shokunbi'
          ActivityIndicatorColor='green'
        />
      </View>
    )
  }
}
```

## API's

#### [](https://github.com/just1and0/object-to-array-convert#all-object-to-array-convert-props)all React-Native-Paystack-WebView API  

 
| Name | use/description | extra |
| :---         |     :---:      |          ---: |
| `buttonText`  | Defines text on the button    | default: `Pay Now`    |
 | `textStyles`  | Defines styles for text in button    | `nill`    |
 | `btnStyles`  | Defines style for button    |  `nill`    |
 | `paystackKey`  | Public or Private paystack key(visit paystack.com to get yours)   |`nill`    |
 | `amount`  | Amount to be paid    | `nill`    |
 | `ActivityIndicatorColor`  | color of loader   | default: `green`    |
 | `billingEmail`  | Billers email   | default: `nill`    |
  | `billingMobile`  | Billers mobile   | default: `nill`    |
  | `billingName`  | Billers Name   | default: `nill`    |
  | `onCancel`  | callback function if user cancels   | default: `nill`    |
  | `onSuccess`  | callback function if transaction was successful (it will also return the transactionRef number in the callback )   | default: `nill`    |
  
 

 
## [](https://github.com/just1and0/object-to-array-convert#contributions)Contributions

What to help make this package even more awesome?  [Read how to contribute](https://github.com/just1and0/React-Native-Paystack-WebView/blob/master/contribution.md)

## [](https://github.com/just1and0/React-Native-Paystack-WebView#licensing)Licensing

This project is licensed under MIT license.

## Related Projects
-  [React-Native-quidpay-WebView](https://github.com/react-native-nigeria/react-native-quidpay-webview)
-  [React-Native-rave-WebView](https://github.com/react-native-nigeria/react-native-rave-webview)




### Don't forget to star, like and share :)
