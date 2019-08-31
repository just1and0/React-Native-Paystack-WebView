 # React-Native-Paystack-WebView

 ![package in action](https://picasaweb.google.com/101819388491824070414/6731100653835510225#6731100658334156434)

The package allows you accept payment using paystack and guess what , it doesn't require any form of linking, just install and begin to use .

### [](https://github.com/just1and0/React-Native-Paystack-WebView#installation)Installation

Add React-Native-Paystack-WebView to your project by running;

`npm install React-Native-Paystack-WebView`

or

`yarn add React-Native-Paystack-WebView`

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


### Don't forget to star, like and share :)
