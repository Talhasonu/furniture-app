import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Firebase configuration
// TODO: Replace with your actual Firebase project configuration
// Get this from your Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth
export { auth };
export default app;

/*
FIREBASE SETUP INSTRUCTIONS:

1. Go to https://console.firebase.google.com/
2. Create a new project or select an existing one
3. Enable Authentication -> Sign-in method -> Email/Password
4. Add your app (Android/iOS) and download the config files:
   - For Android: google-services.json (place in android/app/)
   - For iOS: GoogleService-Info.plist (place in ios/)
5. Replace the firebaseConfig above with your actual values
6. Run the app and test authentication!

Note: Make sure to add your domain to authorized domains in Firebase Console
for password reset emails to work properly.
*/
