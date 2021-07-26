# React-Native-Paystack-WebView

 
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request)
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)
 

The package allows you accept payment using paystack, install, add keys and use. No stress :) 

### [](https://github.com/just1and0/React-Native-Paystack-WebView#installation)Installation

Add React-Native-Paystack-WebView to your project by running;

`npm install react-native-paystack-webview`

or

`yarn add react-native-paystack-webview`

### **One more thing**

To frontload the installation work, let's also install and configure dependencies used by this project, being **react-native-webview** 

run

`yarn add react-native-webview`

for iOS: `cd iOS && pod install && cd ..`

for expo applications run;

`expo install react-native-webview`

and that's it, you're all good to go!

<img width="306" alt="Screenshot of library in action" src="https://user-images.githubusercontent.com/41248079/126550307-5f12c6d8-81af-4f26-951b-5d6514304022.png">

### [](https://github.com/just1and0/React-Native-Paystack-WebView#usage)Usage 1

```javascript
import React from 'react';
import  { Paystack }  from 'react-native-paystack-webview';
import { View } from 'react-native';

function Pay() {
  return (
    <View style={{ flex: 1 }}>
      <Paystack  
        paystackKey="your-public-key-here"
        amount={'25000.00'}
        billingEmail="paystackwebview@something.com"
        activityIndicatorColor="green"
        onCancel={(e) => {
          // handle response here
        }}
        onSuccess={(res) => {
          // handle response here
        }}
        autoStart={true}
      />
    </View>
  );
}
```

## Usage 2 - Using Refs

Make use of a `ref` to start transaction. See example below;

```javascript
import React, { useRef } from 'react';
import  { Paystack , paystackProps}  from 'react-native-paystack-webview';
import { View, TouchableOpacity,Text } from 'react-native';

function Pay(){
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(); 

  return (
    <View style={{flex: 1}}>
      <Paystack
        paystackKey="your-public-key-here"
        billingEmail="paystackwebview@something.com"
        amount={'25000.00'}
        onCancel={(e) => {
          // handle response here
        }}
        onSuccess={(res) => {
          // handle response here
        }}
        ref={paystackWebViewRef}
      />

        <TouchableOpacity onPress={()=> paystackWebViewRef.current.startTransaction()}>
          <Text>Pay Now</Text>
        <TouchableOpacity/>
      </View>
  );
}
```

## API's

#### [](https://github.com/just1and0/object-to-array-convert#all-object-to-array-convert-props)all React-Native-Paystack-WebView API

| Name                                 |                                                                                           use/description                                                                                           |                                                      extra |
| :----------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------: |
| `paystackKey`                        |                                                                   Public or Private paystack key(visit paystack.com to get yours)                                                                   |                                                     `nill` |
| `amount`                             |                                                                                          Amount to be paid                                                                                          |                                                     `nill` |
| `activityIndicatorColor`             |                                                                                           color of loader                                                                                           |                                           default: `green` |
| `billingEmail(required by paystack)` |                                                                                            Billers email                                                                                            |                                            default: `nill` |
| `billingMobile`                      |                                                                                           Billers mobile                                                                                            |                                            default: `nill` |
| `billingName`                        |                                                                                            Billers Name                                                                                             |                                            default: `nill` |
| `channels`                           | Specify payment options available to users. Available channel options are: ["card", "bank", "ussd", "qr", "mobile_money"]. Here's an example of usage: `channels={JSON.stringify(["card","ussd"])}` |                                          default: `"card"` |
| `onCancel`                           |               callback function if user cancels or payment transaction could not be verified. In a case of not being verified, transactionRef number is also returned in the callback               |                                            default: `nill` |
| `onSuccess`                          |                                    callback function if transaction was successful and verified (it will also return the transactionRef number in the callback )                                    |                                            default: `nill` |
| `autoStart`                          |                                                                               Auto start payment once page is opened                                                                                |                                           default: `false` |
| `refNumber`                          |                                                                         Reference number, if you have already generated one                                                                         | default: `''+Math.floor((Math.random() * 1000000000) + 1)` |
| `handleWebViewMessage`               |                                                                          Will be called when a WebView receives a message                                                                           |                                            default: `true` |


## [](https://github.com/just1and0/object-to-array-convert#contributions)Contributions

Want to help make this package even more awesome? [Read how to contribute](https://github.com/just1and0/React-Native-Paystack-WebView/blob/master/contribution.md) and feel free to send in your PR!

## [](https://github.com/just1and0/React-Native-Paystack-WebView#licensing)Licensing

This project is licensed under MIT license.

## Related Projects

- [React-Native-quidpay-WebView](https://github.com/react-native-nigeria/react-native-quidpay-webview)
- [React-Native-rave-WebView](https://github.com/react-native-nigeria/react-native-rave-webview)

### Video Tutorial

- [Accepting Payment With Paystack In React Native](https://www.youtube.com/watch?v=M-V4Q9zk9DE&t=19s) by [just1and0](https://twitter.com/just1and0)

### Don't forget to star, like and share :)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://linksnest.com/just1and0"><img src="https://avatars3.githubusercontent.com/u/17249207?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Oluwatobi Shokunbi </b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=just1and0" title="Code">💻</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=just1and0" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/mosoakinyemi"><img src="https://avatars2.githubusercontent.com/u/41248079?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Akinyemi Mosolasi</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=mosoakinyemi" title="Documentation">📖</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=mosoakinyemi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/okechukwu0127"><img src="https://avatars0.githubusercontent.com/u/23473673?v=4?s=100" width="100px;" alt=""/><br /><sub><b>okechukwu0127</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=okechukwu0127" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/johneyo"><img src="https://avatars2.githubusercontent.com/u/36991140?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Johney</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=johneyo" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/AjeboDeveloper"><img src="https://avatars2.githubusercontent.com/u/27306463?v=4?s=100" width="100px;" alt=""/><br /><sub><b>sammy</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=samie820" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/walexanderos"><img src="https://avatars0.githubusercontent.com/u/36700043?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jimoh Jamiu</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3Awalexanderos" title="Bug reports">🐛</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=walexanderos" title="Documentation">📖</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=walexanderos" title="Code">💻</a></td>
    <td align="center"><a href="https://medium.com/@cahakgeorge"><img src="https://avatars3.githubusercontent.com/u/8522701?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cahak George</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=cahakgeorge" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://johnayeni.xyz"><img src="https://avatars0.githubusercontent.com/u/22295092?v=4?s=100" width="100px;" alt=""/><br /><sub><b>John Ayeni</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=johnayeni" title="Documentation">📖</a></td>
     <td align="center"><a href="https://github.com/majirieyowel"><img src="https://avatars.githubusercontent.com/u/30162976?v=4?s=100" width="100px;" alt=""/><br /><sub><b>majirieyowel</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=majirieyowel" title="Code">💻</a></td>
     <td align="center"><a href="https://github.com/Zeusmist"><img src="https://avatars.githubusercontent.com/u/51177741?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Erinayo Obidu</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3AZeusmist" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/surafelbm"><img src="https://avatars.githubusercontent.com/u/11531221?v=4?s=100" width="100px;" alt=""/><br /><sub><b>surafelbm</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3Asurafelbm" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/omivrex"><img src="https://avatars.githubusercontent.com/u/42608841?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rex Omiv</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3Aomivrex" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/ossyfizy1"><img src="https://avatars.githubusercontent.com/u/18512476?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Osagie Osaigbovo Charles</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3Aossyfizy1" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/Ujjalcha1"><img src="https://avatars.githubusercontent.com/u/40722840?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ujjalcha1</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3AUjjalcha1" title="Bug reports">🐛</a></td>
   </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
