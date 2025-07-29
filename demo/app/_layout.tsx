import { Stack } from 'expo-router';
import { PaystackProvider } from '../../development/PaystackProvider';

export default function Layout() {
  return (
    <PaystackProvider
      publicKey="pk_test_d319f8851d3f60e748d8c67ac58af67ba0ecd72d"
      currency="NGN"
      debug={true}
      onGlobalSuccess={(res) => console.log('Global Success:', res)}
      onGlobalCancel={() => console.log('Global Cancel')}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </PaystackProvider>
  );
}
