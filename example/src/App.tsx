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
        paystackKey={'your-paystack-key-here'}
        onCancel={() => { }}
        onSuccess={() => { }}
        billingEmail={'your-email-here'}
        billingName={'your-name-here'}
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
