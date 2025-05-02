 
<center>
 
<h1>React Native Paystack WebView (v5)</h1>

<p>
Modern, hook-based, Paystack-powered payments in React Native apps using WebViews — now streamlined with Provider architecture & fully customizable.
</p>

<a href="https://paystack.com/docs/libraries-and-plugins/libraries/#react-native">Endorsed</a> by <a href="https://paystack.com">Paystack</a>, so you know you’re in good hands. Payment processing has never been this easy!
   <a href="#contributors-">
    <img src="https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square" alt="All Contributors" />
  </a>
  
</center>
 
<div align="center">
  <img width="306" alt="Screenshot of library in action" src="https://user-images.githubusercontent.com/41248079/126550307-5f12c6d8-81af-4f26-951b-5d6514304022.png">
</div>
 
---
 

## 🚀 Installation

```bash
npm install react-native-paystack-webview
# or
yarn add react-native-paystack-webview
```

### 📦 Peer Dependency

```bash
yarn add react-native-webview

# iOS
cd ios && pod install

# Expo
npx expo install react-native-webview
```

---

## ⚡ Quick Start

### Wrap your app with the Provider

```tsx
import { PaystackProvider } from 'react-native-paystack-webview';

<PaystackProvider publicKey="pk_test_XXXXXX">
  <App />
</PaystackProvider>
```

### Use in a component

```tsx
import React from 'react';
import { Button } from 'react-native';
import { usePaystack } from 'react-native-paystack-webview';

const Checkout = () => {
  const { popup } = usePaystack();

  const payNow = () => {
    popup.checkout({
      email: 'jane.doe@example.com',
      amount: 5000,
      reference: 'TXN_123456',
      plan: 'PLN_example123',
      invoice_limit: 3,
      subaccount: 'SUB_abc123',
      split_code: 'SPL_def456',
      split: {
        type: 'percentage',
        bearer_type: 'account',
        subaccounts: [
          { subaccount: 'ACCT_abc', share: 60 },
          { subaccount: 'ACCT_xyz', share: 40 }
        ]
      },
      metadata: {
        custom_fields: [
          {
            display_name: 'Order ID',
            variable_name: 'order_id',
            value: 'OID1234'
          }
        ]
      },
      onSuccess: (res) => console.log('Success:', res),
      onCancel: () => console.log('User cancelled'),
      onLoad: (res) => console.log('WebView Loaded:', res),
      onError: (err) => console.log('WebView Error:', err)
    });
  };

  return <Button title="Pay Now" onPress={payNow} />;
};
```

---

## 🧠 Features

- ✅ Simple `checkout()` or `newTransaction()` calls
- ✅ Global callbacks with `onGlobalSuccess` or `onGlobalCancel`
- ✅ Debug logging with `debug` prop
- ✅ Fully typed params for transactions
- ✅ Works seamlessly with Expo & bare React Native
- ✅ Full test coverage

---

## 📘 API Reference

### `PaystackProvider`

| Prop              | Type      | Default | Description                              |
|-------------------|-----------|---------|------------------------------------------|
| `publicKey`       | `string`  | —       | Your Paystack public key                 |
| `currency`        | `string`  | `NGN`   | NGN / GHS / USD                          |
| `defaultChannels` | `string[]`| `['card']`| Payment channels                        |
| `debug`           | `boolean` | `false` | Show debug logs                          |
| `onGlobalSuccess` | `func`    | —       | Called on all successful transactions    |
| `onGlobalCancel`  | `func`    | —       | Called on all cancelled transactions     |

### `popup.checkout()` / `popup.newTransaction()`

| Param         | Type                | Required | Description                               |
|---------------|---------------------|----------|-------------------------------------------|
| `email`       | `string`            | ✅       | Customer email                            |
| `amount`      | `number`            | ✅       | Amount in Naira (not kobo)                |
| `reference`   | `string`            | —        | Custom reference (optional)               |
| `metadata`    | `object`            | —        | Custom fields / additional info           |
| `plan`        | `string`            | —        | Paystack plan code (for subscriptions)    |
| `invoice_limit` | `number`          | —        | Max charges during subscription           |
| `subaccount`  | `string`            | —        | Subaccount code for split payment         |
| `split_code`  | `string`            | —        | Multi-split identifier                    |
| `split`       | `object`            | —        | Dynamic split object                      |
| `onSuccess`   | `(res) => void`     | ✅       | Called on successful payment              |
| `onCancel`    | `() => void`        | ✅       | Called on cancellation                    |
| `onLoad`      | `(res) => void`     | —        | Triggered when transaction view loads     |
| `onError`     | `(err) => void`     | —        | Triggered on WebView or script error      |

---

#### Meta Props
 
 
| Name                | Description                                                                                                                                                                      | Required? | Default Value                                                                                                                                                                 |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cart_id`           | A unique identifier for the cart. Can be either a string or a number.                                                                                                            | `NO`      | `undefined`                                                                                                                                                                 |
| `custom_fields`     | An array of custom fields for adding additional metadata to the transaction. If not passed, a default custom field is created using the `firstName`, `lastName`, and `billingName`. | `NO`      | `[{ display_name: '${firstName + ' ' + lastName}', variable_name: '${billingName}', value: '' }]`                                                                           |
| `cancel_action`     | A string specifying the action to take if a transaction is canceled.                                                                                                            | `NO`      | `undefined`                                                                                                                                                                 |
| `custom_filters`    | Custom filters to restrict or specify transaction options, such as:                                                                                                              | `NO`      | `undefined`                                                                                                                                                                 |
|                     | - **`recurring`**: A boolean to indicate if the transaction is recurring.                                                                                                       |           |                                                                                                                                                                             |
|                     | - **`banks`**: An array of bank codes for supported banks.                                                                                                                     |           |                                                                                                                                                                             |
|                     | - **`card_brands`**: Supported card brands, e.g., `'verve'`, `'visa'`, `'mastercard'`.                                                                                         |           |                                                                                                                                                                             |
|                     | - **`supported_mobile_money_providers`**: Supported mobile money providers, e.g., `'mtn'`, `'atl'`, `'vod'`.                                                                   |           |                                                                                                                                                                             |

 
---
 
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

---

## 🧪 Debugging

Enable `debug={true}` on the `PaystackProvider` to get logs like:
- Transaction modal status
- Incoming postMessage data
- Success, cancel, error logs

 ---


## [](https://github.com/just1and0/object-to-array-convert#contributions)Contributions


Want to help improve this package? [Read how to contribute](https://github.com/just1and0/React-Native-Paystack-WebView/blob/main/CONTRIBUTING.md) and feel free to submit your PR!

---

## [](https://github.com/just1and0/React-Native-Paystack-WebView#licensing)Licensing

This project is licensed under the MIT License.

---


## Related Projects

- [React-Native-quidpay-WebView](https://github.com/react-native-nigeria/react-native-quidpay-webview)
- [React-Native-rave-WebView](https://github.com/react-native-nigeria/react-native-rave-webview)

---

### Video Tutorial

- [Accepting Payment With Paystack In React Native](https://www.youtube.com/watch?v=M-V4Q9zk9DE&t=19s) by [just1and0](https://twitter.com/just1and0) 

---

## Sponsorship
- Star the project on Github
- [Buy me a coffee](https://buymeacoffee.com/6pL0Q8YkW)
-  [Like, Share and subscribe on Youtube](https://www.youtube.com/watch?v=M-V4Q9zk9DE&t=19s) 

---

## Thanks to Our Superheroes ✨
A huge shoutout to our amazing contributors! Your efforts make this project better every day. Check out the ([emoji key](https://allcontributors.org/docs/en/emoji-key)) for what each contribution means:

 

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/just1and0"><img src="https://avatars3.githubusercontent.com/u/17249207?v=4?s=100" width="100px;" alt="Oluwatobi Shokunbi "/><br /><sub><b>Oluwatobi Shokunbi </b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=just1and0" title="Code">💻</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=just1and0" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mosoakinyemi"><img src="https://avatars2.githubusercontent.com/u/41248079?v=4?s=100" width="100px;" alt="Akinyemi Mosolasi"/><br /><sub><b>Akinyemi Mosolasi</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=mosoakinyemi" title="Documentation">📖</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=mosoakinyemi" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/okechukwu0127"><img src="https://avatars0.githubusercontent.com/u/23473673?v=4?s=100" width="100px;" alt="okechukwu0127"/><br /><sub><b>okechukwu0127</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=okechukwu0127" title="Code">💻</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/issues?q=author%3Aokechukwu0127" title="Bug reports">🐛</a></td>
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
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/opmat"><img src="https://avatars.githubusercontent.com/u/2133903?v=4?s=100" width="100px;" alt="Matiluko Opeyemi Emmanuel"/><br /><sub><b>Matiluko Opeyemi Emmanuel</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=opmat" title="Code">💻</a> <a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=opmat" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://mureyfolio.com.ng/"><img src="https://avatars.githubusercontent.com/u/47125673?v=4?s=100" width="100px;" alt="Oluwamurewa Alao"/><br /><sub><b>Oluwamurewa Alao</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=mureyvenom" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/El-Nazy"><img src="https://avatars.githubusercontent.com/u/48170272?v=4?s=100" width="100px;" alt="Emmanuel Ngene"/><br /><sub><b>Emmanuel Ngene</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=El-Nazy" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://osen.co.ke"><img src="https://avatars.githubusercontent.com/u/14233942?v=4?s=100" width="100px;" alt="Mauko"/><br /><sub><b>Mauko</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=maukoese" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/quartusk"><img src="https://avatars.githubusercontent.com/u/39792290?v=4?s=100" width="100px;" alt="Quartus Kok"/><br /><sub><b>Quartus Kok</b></sub></a><br /><a href="https://github.com/just1and0/React-Native-Paystack-WebView/commits?author=quartusk" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!






 
