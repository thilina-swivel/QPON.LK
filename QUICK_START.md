## Quick Start Guide - QPON.lK

Your React Native project is ready! Here's how to get it running:

### 1. Start Development Server

```bash
npx expo start
```

### 2. View on Your Device/Emulator

**Option A: Expo Go (Easiest - Fastest)**

- Install "Expo Go" app from App Store or Google Play
- Scan the QR code shown in terminal
- App loads in 10-30 seconds

**Option B: Web Browser**

- Press `w` in terminal after running `npx expo start`
- Opens in http://localhost:19006

**Option C: iOS Simulator** (Mac only)

- Press `i` in terminal
- Requires Xcode

**Option D: Android Emulator**

- Press `a` in terminal
- Requires Android Studio

### 3. Project Navigation

**Screens Created:**

- 🎨 **Splash Screen** (`/index`) - Animated QPON logo
- 📱 **Welcome Screen** (`/welcome`) - Onboarding with features
- 🛒 **Deals Screen** (`/deals`) - Placeholder
- 👤 **Register Screen** (`/register`) - Placeholder
- 🔐 **Sign In Screen** (`/signin`) - Placeholder

### 4. Design Features

✓ Dark navy blue theme (#1a1a3e)
✓ Orange accent buttons (#FF6B35)
✓ Animated splash screen logo
✓ Fully responsive layout
✓ TypeScript support
✓ File-based routing with Expo Router

### 5. Make Changes

Edit files in the `app/` directory and save - hot reload is automatic!

Key files to customize:

- `app/welcome.tsx` - Welcome screen content
- `app/index.tsx` - Splash screen animation
- `app.json` - App metadata and configuration

### 6. Next Steps

- Add real images in `assets/images/`
- Implement navigation between screens
- Add authentication logic
- Connect to backend API
- Customize colors and branding

### 📚 Documentation

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Router Guide](https://docs.expo.dev/router/introduction)

### 🔧 Troubleshooting

**App won't load?**

- Clear cache: `npx expo start -c`
- Check Node version: `node --version` (should be v16+)

**Colors not showing?**

- Dark mode is set in app.json
- Change userInterfaceStyle to "light" if needed

**Images not loading?**

- Add actual images to `assets/images/` directory
- Update import paths in screen files

---

**Your app is ready to develop! Happy coding! 🚀**
