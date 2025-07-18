import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// TODO: Replace with your actual Firebase project configuration
// Get this from your Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyA90libwkBIdq9EPTrUb17RNblqVH-xnXw",
  authDomain: "e-commerence-f496a.firebaseapp.com",
  projectId: "e-commerence-f496a",
  storageBucket: "e-commerence-f496a.firebasestorage.app",
  messagingSenderId: "613753278993",
  appId: "1:613753278993:web:d06b861fcb4b08740797b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };
export default app;


/*
FIREBASE SETUP INSTRUCTIONS:

1. Go to https://console.firebase.google.com/
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
4. Get your web app configuration:
   - Go to Project Settings > General > Your apps
   - Add a web app (Firebase JS SDK works with Expo)
   - Copy the firebaseConfig object
5. Replace the demo config above with your actual config
6. For production, consider using environment variables

Note: This uses Firebase JS SDK which is compatible with Expo.
For bare React Native projects, you would use @react-native-firebase.
*/
