import React, { useEffect, useRef } from 'react'
import ReactNativePaystackWebviewModule, { Paystack , paystackProps} from 'react-native-paystack-webview'
import { TouchableOpacity, Text, View } from 'react-native'


const App = () => {
  useEffect(() => {
    console.log(ReactNativePaystackWebviewModule)
  })

  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(); 

  return (
    <View style={{justifyContent:'center', backgroundColor:'red', flex:1}}>
      <Paystack
        paystackKey={'pk_test_13194038d04aaba4e52e0e901ec1457bf33df2f9'}
        onCancel={() => { }}
        onSuccess={() => { }}
        billingEmail={'ayoshokz@gmail.com'}
        billingName={'Shokunbi David'}
        amount={'700.90'}
        ref={paystackWebViewRef}
        autoStart={true}
      />

      <TouchableOpacity onPress={() => paystackWebViewRef.current?.startTransaction()}>
        <Text>Pay Now</Text>
      </TouchableOpacity>
    </View>
  )
}

export default App
