# React Native Firebase Authentication App

A complete authentication flow using Firebase Auth in React Native with Expo Router.

## Features

✅ **Complete Authentication Flow**
- Sign Up with email and password
- Sign In with email and password  
- Forgot Password (password reset via email)
- Sign Out functionality

✅ **Form Validation**
- Email format validation
- Password strength requirements
- Confirm password matching
- Real-time error messages

✅ **UI/UX**
- Dark/Light mode support
- Responsive design
- Loading states
- Error handling with user-friendly messages

✅ **Navigation**
- Expo Router file-based navigation
- Authentication state management
- Protected routes

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
4. Add your app platforms:
   - **Android**: Download `google-services.json` and place in `android/app/`
   - **iOS**: Download `GoogleService-Info.plist` and place in `ios/`

### 2. Configure Firebase

1. Update `src/config/firebase.ts` with your Firebase project configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the App

```bash
# Start Metro bundler
npx expo start

# Run on Android
npx expo run:android

# Run on iOS  
npx expo run:ios
```

## Project Structure

```
app/
├── _layout.tsx           # Root layout with AuthProvider
├── (auth)/               # Authentication screens group
│   ├── _layout.tsx       # Auth navigation layout
│   ├── index.tsx         # Redirect to signin
│   ├── signin.tsx        # Sign in screen
│   ├── signup.tsx        # Sign up screen
│   └── forgot-password.tsx # Password reset screen
├── (tabs)/               # Main app screens (protected)
│   ├── _layout.tsx       # Tab navigation layout
│   ├── index.tsx         # Home screen with sign out
│   └── explore.tsx       # Explore/demo screen
└── +not-found.tsx        # 404 error screen

src/
├── contexts/
│   └── AuthContext.tsx   # Authentication state management
└── config/
    └── firebase.ts       # Firebase configuration
```

## Authentication Flow

1. **Unauthenticated**: Users see sign in/up screens
2. **Sign Up**: Create account with email/password validation
3. **Sign In**: Login with email/password
4. **Forgot Password**: Reset password via email
5. **Authenticated**: Access to main app with sign out option

## Error Handling

The app includes comprehensive error handling for:
- Invalid email formats
- Weak passwords
- Email already in use
- User not found
- Wrong password
- Network errors
- Too many requests

## Password Requirements

- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number

## Theming

The app supports both light and dark modes:
- Uses `useThemeColor` hook for dynamic colors
- `ThemedText` and `ThemedView` components
- Automatic status bar styling

## Technologies Used

- **React Native** with Expo
- **Expo Router** for navigation
- **Firebase Authentication** for auth
- **React Hook Form** for form management
- **TypeScript** for type safety

## Troubleshooting

### Firebase Setup Issues
- Ensure config files are in correct directories
- Verify Firebase project has Authentication enabled
- Check API keys match your project

### Navigation Issues  
- Clear Metro cache: `npx expo start --clear`
- Ensure all routes are properly defined

### Build Issues
- Clean install: `rm -rf node_modules && npm install`
- Check React Native Firebase installation guide

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test authentication flow
5. Submit pull request

## License

MIT License - see LICENSE file for details
