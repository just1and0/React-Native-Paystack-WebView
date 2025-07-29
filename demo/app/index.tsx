import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePaystack } from '../../development/usePaystack';

export default function HomeScreen() {
  const { popup } = usePaystack();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const { top } = useSafeAreaInsets();

  const handlePayment = async () => {
    if (!email || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // This is a basic email validation and you would want to improve it for production use
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const numAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Use the actual Paystack library
    popup.checkout({
      email,
      amount: numAmount,
      reference: `TXN_${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: 'Demo Payment',
            variable_name: 'demo_payment',
            value: 'true',
          },
        ],
      },
      onSuccess: (res: any) => {
        Alert.alert(
          'Payment Successful! 🎉',
          `Your payment of ₦${amount} has been processed successfully.\n\nReference: ${res.reference}`,
          [{ text: 'OK' }],
        );
        console.log('Payment Success:', res);
        setAmount('');
        setEmail('');
      },
      onCancel: () => {
        Alert.alert('Payment Cancelled', 'The payment was cancelled by user.', [{ text: 'OK' }]);
        console.log('Payment Cancelled');
      },
      onLoad: (res: any) => {
        console.log('Payment Modal Loaded:', res);
      },
      onError: (err: any) => {
        Alert.alert('Payment Error', `An error occurred: ${err.message || 'Unknown error'}`, [{ text: 'OK' }]);
        console.log('Payment Error:', err);
      },
    });
  };

  const formatAmount = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    if (numValue) {
      return parseInt(numValue).toLocaleString();
    }
    return '';
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    setAmount(formatted);
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View
            style={{
              backgroundColor: '#667eea',
              paddingTop: top + 16,
              paddingBottom: 40,
              paddingHorizontal: 20,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 15,
                }}
              >
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>💳</Text>
              </View>
              <View>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Paystack Checkout</Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 16 }}>Secure payment processing</Text>
              </View>
            </View>

            {/* Amount Display */}
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 20,
                padding: 20,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, marginBottom: 5 }}>Total Amount</Text>
              <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>₦{amount || '0'}</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={{ flex: 1, padding: 20 }}>
            {/* Payment Form */}
            <View style={{ marginBottom: 30 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#1a202c' }}>
                Payment Details
              </Text>

              {/* Email Input */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#4a5568' }}>
                  Email Address
                </Text>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: email ? '#667eea' : '#e2e8f0',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 20, marginRight: 12 }}>📧</Text>
                  <TextInput
                    autoCorrect={false}
                    autoCapitalize="none"
                    style={{ flex: 1, fontSize: 16, color: '#1a202c' }}
                    placeholder="Enter your email"
                    placeholderTextColor="#a0aec0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Amount Input */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#4a5568' }}>Amount (₦)</Text>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: amount ? '#667eea' : '#e2e8f0',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 20, marginRight: 12 }}>💰</Text>
                  <TextInput
                    style={{ flex: 1, fontSize: 16, color: '#1a202c' }}
                    placeholder="Enter amount"
                    placeholderTextColor="#a0aec0"
                    value={amount}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Payment Button */}
            <View style={{ marginBottom: 20 }}>
              <TouchableOpacity
                onPress={handlePayment}
                disabled={!email || !amount}
                style={{
                  backgroundColor: !email || !amount ? '#cbd5e0' : '#667eea',
                  borderRadius: 16,
                  paddingVertical: 18,
                  alignItems: 'center',
                  shadowColor: '#667eea',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 20, marginRight: 8 }}>🔒</Text>
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Pay ₦{amount || '0'}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Demo Notice */}
            <View
              style={{
                backgroundColor: '#fff5f5',
                borderRadius: 12,
                padding: 16,
                marginTop: 20,
                borderLeftWidth: 4,
                borderLeftColor: '#f56565',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, marginRight: 8 }}>ℹ️</Text>
                <Text style={{ fontSize: 14, color: '#c53030', fontWeight: '500' }}>
                  This is a demo. No real payments will be processed.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
