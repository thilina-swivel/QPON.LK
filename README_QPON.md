# QPON.lK - Local Travel Guide App

A React Native mobile application for discovering deals and experiences in Sri Lanka.

## Project Structure

- **app/index.tsx** - Splash screen with animated QPON logo
- **app/welcome.tsx** - Welcome/onboarding screen with app description
- **app/deals.tsx** - Deals exploration screen
- **app/register.tsx** - Registration screen
- **app/signin.tsx** - Sign-in screen
- **app/(tabs)/** - Main app navigation structure

## Features

### Splash Screen

- Animated gradient QPON logo
- Auto-transition to welcome screen after 2.5 seconds
- Dark theme design matching the brand

### Welcome Screen

- Beautiful onboarding experience
- Local attraction images/placeholders
- Discount badges showing potential savings
- Three action buttons:
  - **Explore Deals** - Orange call-to-action button
  - **Register** - Outlined white button
  - **Sign In** - Outlined white button
- Smooth animations and gradient background

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for quick testing on mobile)

### Installation

```bash
# Install dependencies (already done)
npm install

# Or if using yarn
yarn install
```

### Running the App

#### Web

```bash
npm run web
```

This will start the web version in your browser.

#### iOS

```bash
npm run ios
```

Requires Xcode and macOS.

#### Android

```bash
npm run android
```

Requires Android Studio and Android SDK.

#### Using Expo Go

```bash
npx expo start
```

Scan the QR code with:

- **iOS**: Camera app or Expo Go app
- **Android**: Expo Go app

## Design Details

### Color Scheme

- **Primary Dark**: `#1a1a3e` (Deep navy blue background)
- **Primary Orange**: `#FF6B35` (Call-to-action buttons)
- **Accent Cyan**: `#00B4D8` (Accents and highlights)
- **Accent Green**: `#00FF99` (Image borders)
- **Text Light**: `#ffffff` (Primary text)
- **Text Muted**: `#b0b0b0` (Secondary text)

### Typography

- **Titles**: 36px, Bold (700)
- **Buttons**: 18px, Bold (700)
- **Body**: 16px, Regular

### Animations

- Logo scale and fade animation on splash screen
- Button press feedback with opacity changes
- Smooth transitions between screens

## Navigation Flow

1. **Splash Screen** (`/index`) → Auto-transitions after 2.5s
2. **Welcome Screen** (`/welcome`) → User chooses action
   - Explore Deals → `/deals`
   - Register → `/register`
   - Sign In → `/signin`
3. **Tabs Navigation** (`/(tabs)`) → Main app interface

## Customization

### To modify splash screen animation:

Edit the timing values in `app/index.tsx`:

- Change `duration` in `Animated.timing()` for animation speed
- Adjust the `setTimeout` delay (currently 2500ms) to change when transition occurs

### To change colors:

Update the hex color values in the respective screen files' `StyleSheet.create()` sections.

### To add real images:

Replace the placeholder view components in `app/welcome.tsx` with actual Image components pointing to your image assets.

## Building for Production

```bash
# Create a production build
eas build --platform ios
eas build --platform android

# Or for web
npm run build
```

## Project Dependencies

- **react-native** - Core framework
- **expo** - Development platform and runtime
- **expo-router** - File-based routing for React Native
- **react-navigation** - Navigation library
- **typescript** - Type safety

## Support

For issues or questions, refer to:

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Router Guide](https://docs.expo.dev/router/introduction)
