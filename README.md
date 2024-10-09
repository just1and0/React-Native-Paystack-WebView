<div>
<center>
<h1>React Native Paystack WebView</h1>
This package lets you accept payments with Paystack in a snap! Just install, add your keys, and you’re good to go—no headaches here! Plus, it’s officially [endorsed](https://paystack.com/docs/libraries-and-plugins/libraries/#react-native) by [Paystack](https://paystack.com), so you know you’re in good hands. Payment processing has never been this easy!
 
[![All Contributors](https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square)](#contributors-) 
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request)

</center>
</div>
<div>
<center>
    <img width="306" alt="Screenshot of library in action" src="https://user-images.githubusercontent.com/41248079/126550307-5f12c6d8-81af-4f26-951b-5d6514304022.png">
</center>
</div>
 

### [](https://github.com/just1and0/React-Native-Paystack-WebView#installation)Installation

Add `react-native-paystack-webview` to your project by running;

```bash 
npm install react-native-paystack-webview

or

yarn add react-native-paystack-webview
```
### **Additional Setup**

To ensure everything works smoothly, install and configure the required dependency, `react-native-webview`:

 
```bash 
yarn add react-native-webview
```
for iOS: 
```bash 
cd iOS && pod install && cd ..
```
for expo applications run;
```bash 
npx expo install react-native-webview
```
That’s it! You’re all set.

### [](https://github.com/just1and0/React-Native-Paystack-WebView#usage)Usage
##### Basic Example

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

##### Using Refs

You can also use a `ref` to start a transaction. Here’s how:

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
        </TouchableOpacity>
      </View>
  );
}
```

### [](https://github.com/just1and0/object-to-array-convert#all-object-to-array-convert-props) API Reference

| Name                                 |                                                                                   use/description                                                                                   |                                                      extra |
| :----------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------: |
| `paystackKey`                        |                                                           Public or Private paystack key(visit paystack.com to get yours)                                                           |                                                     `nill` |
| `amount`                             |                                                                                  Amount to be paid                                                                                  |                                                     `nill` |
| `activityIndicatorColor`             |                                                                                   color of loader                                                                                   |                                           default: `green` |
| `billingEmail(required by paystack)` |                                                                                    Billers email                                                                                    |                                            default: `nill` |
| `billingMobile`                      |                                                                                   Billers mobile                                                                                    |                                            default: `nill` |
| `billingName`                        |                                                                                    Billers Name                                                                                     |                                            default: `nill` |
| `subaccount`                         |    Specify subaccount code generated from the Paystack Dashboard or API to enable Split Payment on the transaction. Here's an example of usage: `subaccount: "SUB_ACCOUNTCODE"`     |                                            default: `nill` |
| `split_code`                        |                                                                                           Specify _split_code_ generated from the Paystack Dashboard under _Transaction Splits menu_ or API to enable Multi-Split Payment on the transaction. According to Paystack's documentation available [here](https://paystack.com/docs/payments/multi-split-payments/), Multi-split enables merchants to split the settlement for a transaction across their payout account, and one or more subaccounts. Here's an example of usage: `split_code: "SPL_xxxxxxx"`                                                                                              |                                            default: `nill` |
| `split`                        |                                                                                           Specify _split_ object to enable Dynamic Multi-Split Payment on the transaction. According to Paystack's documentation available [here](https://paystack.com/docs/payments/multi-split-payments/#dynamic-splits), Sometimes, you can't determine a split configuration until later in the purchase flow. With dynamic splits, you can create splits on the fly. The Structure is defined [in the Dynamic Multi-Split Structure below](#dynamic-multi-split-payment-object-structure)                                                                                              |                                            default: `nill` |
| `channels`                           | Specify payment options available to users. Available channel options are: ["card", "bank", "ussd", "qr", "mobile_money"]. Here's an example of usage: `channels={["card","ussd"]}` |                                        default: `["card"]` |
| `onCancel`                           |       callback function if user cancels or payment transaction could not be verified. In a case of not being verified, transactionRef number is also returned in the callback       |                                            default: `nill` |
| `onSuccess`                          |                            callback function if transaction was successful and verified (it will also return the transactionRef number in the callback )                            |                                            default: `nill` |
| `autoStart`                          |                                                                       Auto start payment once page is opened                                                                        |                                           default: `false` |
| `refNumber`                          |                                                                 Reference number, if you have already generated one                                                                 | default: `''+Math.floor((Math.random() * 1000000000) + 1)` |
| `handleWebViewMessage`               |                                                                  Will be called when a WebView receives a message                                                                   |                                            default: `true` |



#### Dynamic Multi-Split Payment Object structure

| Name                                 |                                                                                           use/description                                                                                           |                                                      required? |
| :----------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------: |
| `type`                        |                                                                   Dynamic Multi-Split type. Value can be `flat` or `percentage`                                                                   |                                                     `YES` |
| `bearer_type`                             |                                                                                          Defines who bears the charges. Value can be `all`, `all-proportional`, `account` or `subaccount`                                                                                          |                                                     `YES` |
| `subaccounts`                             |                                                                                          An array of subaccount object as defined [below](#dynamic-multi-split-payment-sub-account-object-structure). e.g. {"subaccount": 'ACCT_xxxxxx', "share": 60}                                                                                          |                                                     `YES` |
| `bearer_subaccount`                             |                                                                                          Subaccount code of the bearerof the transaction. It should be specified if _bearer_type_ is `subaccount`                                                                                          |                                                     `NO` |
| `reference`                             |                                                                                          Unique reference of the split. Can be defined by the user                                                                                         |                                                     `NO` |


#### Dynamic Multi-Split Payment Sub-Account Object structure

| Name                                 |                                                                                           use/description                                                                                           |                                                      required? |
| :----------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------: |
| `subaccount`                        |                                                                                           Specify subaccount code generated from the Paystack Dashboard or API to enable Split Payment on the transaction. Here's an example of usage: `subaccount: "SUB_ACCOUNTCODE"`                                                                                              |                                            `YES` |
| `share`                             |                                                                                          Defines the amount in `percentage (integer)` or `value (decimal allowed)` depending on the type of multi-split defined                                                                                          |                                                     `YES` |


## [](https://github.com/just1and0/object-to-array-convert#contributions)Contributions

Want to help improve this package? [Read how to contribute](https://github.com/just1and0/React-Native-Paystack-WebView/blob/main/CONTRIBUTING.md) and feel free to submit your PR!

## [](https://github.com/just1and0/React-Native-Paystack-WebView#licensing)Licensing

This project is licensed under the MIT License.

## Related Projects

- [React-Native-quidpay-WebView](https://github.com/react-native-nigeria/react-native-quidpay-webview)
- [React-Native-rave-WebView](https://github.com/react-native-nigeria/react-native-rave-webview)

### Video Tutorial

- [Accepting Payment With Paystack In React Native](https://www.youtube.com/watch?v=M-V4Q9zk9DE&t=19s) by [just1and0](https://twitter.com/just1and0) 

## Sponsorship
- Star the project on Github
- [Buy me a coffee](https://buymeacoffee.com/6pL0Q8YkW)

## Thanks to Our Superheroes ✨
A huge shoutout to our amazing contributors! Your efforts make this project better every day. Check out the ([emoji key](https://allcontributors.org/docs/en/emoji-key)) for what each contribution means:

 

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://linksnest.com/just1and0"><img src="https://avatars3.githubusercontent.com/u/17249207?v=4?s=100" width="100px;" alt="Oluwatobi Shokunbi "/><br /><sub><b>Oluwatobi Shokunbi </b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=just1and0" title="Code">💻</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=just1and0" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mosoakinyemi"><img src="https://avatars2.githubusercontent.com/u/41248079?v=4?s=100" width="100px;" alt="Akinyemi Mosolasi"/><br /><sub><b>Akinyemi Mosolasi</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=mosoakinyemi" title="Documentation">📖</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=mosoakinyemi" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/okechukwu0127"><img src="https://avatars0.githubusercontent.com/u/23473673?v=4?s=100" width="100px;" alt="okechukwu0127"/><br /><sub><b>okechukwu0127</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=okechukwu0127" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/johneyo"><img src="https://avatars2.githubusercontent.com/u/36991140?v=4?s=100" width="100px;" alt="Johney"/><br /><sub><b>Johney</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=johneyo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://twitter.com/AjeboDeveloper"><img src="https://avatars2.githubusercontent.com/u/27306463?v=4?s=100" width="100px;" alt="sammy"/><br /><sub><b>sammy</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=samie820" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/walexanderos"><img src="https://avatars0.githubusercontent.com/u/36700043?v=4?s=100" width="100px;" alt="Jimoh Jamiu"/><br /><sub><b>Jimoh Jamiu</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3Awalexanderos" title="Bug reports">🐛</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=walexanderos" title="Documentation">📖</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=walexanderos" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://medium.com/@cahakgeorge"><img src="https://avatars3.githubusercontent.com/u/8522701?v=4?s=100" width="100px;" alt="Cahak George"/><br /><sub><b>Cahak George</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=cahakgeorge" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://johnayeni.xyz"><img src="https://avatars0.githubusercontent.com/u/22295092?v=4?s=100" width="100px;" alt="John Ayeni"/><br /><sub><b>John Ayeni</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=johnayeni" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/majirieyowel"><img src="https://avatars.githubusercontent.com/u/30162976?v=4?s=100" width="100px;" alt="majirieyowel"/><br /><sub><b>majirieyowel</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=majirieyowel" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Zeusmist"><img src="https://avatars.githubusercontent.com/u/51177741?v=4?s=100" width="100px;" alt="David Erinayo Obidu"/><br /><sub><b>David Erinayo Obidu</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3AZeusmist" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/surafelbm"><img src="https://avatars.githubusercontent.com/u/11531221?v=4?s=100" width="100px;" alt="surafelbm"/><br /><sub><b>surafelbm</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3Asurafelbm" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/omivrex"><img src="https://avatars.githubusercontent.com/u/42608841?v=4?s=100" width="100px;" alt="Rex Omiv"/><br /><sub><b>Rex Omiv</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3Aomivrex" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ossyfizy1"><img src="https://avatars.githubusercontent.com/u/18512476?v=4?s=100" width="100px;" alt="Osagie Osaigbovo Charles"/><br /><sub><b>Osagie Osaigbovo Charles</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3Aossyfizy1" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Ujjalcha1"><img src="https://avatars.githubusercontent.com/u/40722840?v=4?s=100" width="100px;" alt="Ujjalcha1"/><br /><sub><b>Ujjalcha1</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3AUjjalcha1" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://codexplorer.me"><img src="https://avatars.githubusercontent.com/u/23406970?v=4?s=100" width="100px;" alt="Oyefeso Oluwatunmise"/><br /><sub><b>Oyefeso Oluwatunmise</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3ABlac-Panda" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://fuadolatunji.me"><img src="https://avatars.githubusercontent.com/u/65264054?v=4?s=100" width="100px;" alt="Fuad Olatunji"/><br /><sub><b>Fuad Olatunji</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=fuadop" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://erasmuswill.dev"><img src="https://avatars.githubusercontent.com/u/15966713?v=4?s=100" width="100px;" alt="Wilhelm Erasmus"/><br /><sub><b>Wilhelm Erasmus</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=erasmuswill" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/opmat"><img src="https://avatars.githubusercontent.com/u/2133903?v=4?s=100" width="100px;" alt="Matiluko Opeyemi Emmanuel"/><br /><sub><b>Matiluko Opeyemi Emmanuel</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=opmat" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://mureyfolio.com.ng/"><img src="https://avatars.githubusercontent.com/u/47125673?v=4?s=100" width="100px;" alt="Oluwamurewa Alao"/><br /><sub><b>Oluwamurewa Alao</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=mureyvenom" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!