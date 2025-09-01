# React Native Paystack WebView Demo

This is a clean, interactive demo showcasing the React Native Paystack WebView library in action. The demo provides a streamlined payment interface that demonstrates the library's core functionality.

## 🚀 Features

- **Clean UI/UX**: Modern, minimalist design with smooth interactions
- **Real Paystack Integration**: Uses the actual Paystack WebView library
- **Form Validation**: Email and amount validation with real-time feedback
- **Payment Processing**: Simulates the complete payment flow
- **Mobile Optimized**: Touch-friendly interface with proper keyboard handling
- **Status Bar Integration**: Proper status bar styling for iOS/Android

## 🎯 Demo Features

### Interactive Payment Flow

- Enter email and amount
- Real-time form validation
- Process payment through Paystack WebView
- Success/error handling with user feedback
- Clean, intuitive interface

### UI Components

- **Header**: Gradient background with payment info and amount display
- **Form Inputs**: Email and amount with validation and proper keyboard handling
- **Payment Button**: Dynamic state with loading indicator
- **Demo Notice**: Clear indication this is a demo environment
- **Status Bar**: Light status bar for better visual integration

## 🛠️ Technical Details

### Integration

- Uses `PaystackProvider` from the development library
- Implements `usePaystack` hook for payment processing
- Proper TypeScript types and error handling
- Safe area handling for different device types

### Styling

- Modern color scheme with Paystack branding
- Smooth animations and transitions
- Responsive design for different screen sizes
- Proper spacing and typography
- Status bar integration

### Validation

- Email format validation
- Amount validation (positive numbers only)
- Required field validation
- Real-time feedback

## 🚀 Running the Demo

1. **Start the development server**:

   ```bash
   yarn start
   # or
   npm start
   ```

2. **Open on your device**:

   - Scan the QR code with Expo Go app
   - Or press 'i' for iOS simulator
   - Or press 'a' for Android emulator

3. **Test the payment flow**:
   - Enter a valid email (e.g., `test@example.com`)
   - Enter an amount (e.g., `5000`)
   - Tap "Pay" to initiate payment
   - Experience the WebView integration

## 📱 Demo Screenshots

🎥 [Watch the demo video on Imgur](https://imgur.com/a/E3pH8Hu)

## 🔧 Configuration

### Paystack Setup

The demo uses a test public key. To use your own:

1. Replace the public key in `app/_layout.tsx`:

   ```typescript
   publicKey = 'pk_test_YOUR_TEST_KEY_HERE';
   ```

2. For production, use your live key:
   ```typescript
   publicKey = 'pk_live_YOUR_LIVE_KEY_HERE';
   ```

### Customization

- Modify colors in the component styles
- Update validation rules
- Customize success/error messages
- Adjust status bar styling

## 🎨 Design System

### Colors

- Primary: `#667eea` (Paystack Blue)
- Background: `#f8fafc` (Light Gray)
- Text: `#1a202c` (Dark Gray)
- Input Border: `#e2e8f0` (Light Gray)
- Success: `#48bb78` (Green)
- Error: `#f56565` (Red)

### Typography

- Headers: Bold, 24px
- Body: Regular, 16px
- Labels: Semi-bold, 16px
- Amount Display: Bold, 32px

### Spacing

- Consistent 8px grid system
- Proper padding and margins
- Touch-friendly button sizes
- Safe area handling

## 🔒 Security

- SSL encryption notice
- Secure payment processing
- No sensitive data stored
- Demo environment only

## 📄 License

This demo is part of the React Native Paystack WebView project and follows the same MIT license.

## 🤝 Contributing

[Contributing guide](https://github.com/just1and0/React-Native-Paystack-WebView/blob/main/CONTRIBUTING.md)

## 🔗 Links

- [Main Library Repository](https://github.com/just1and0/React-Native-Paystack-WebView)
- [Paystack Documentation](https://paystack.com/docs)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview)

---

**Enjoy testing the React Native Paystack WebView library! 🎉**
