import { router } from 'expo-router';
import { Alert } from 'react-native';

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  Alert.alert(
    type === 'error' ? '⚠️ Error' : type === 'success' ? '✅ Success' : 'ℹ️ Info',
    message,
    [{ text: 'OK', style: 'default' }]
  );
};

export const showLoginRequired = () => {
  Alert.alert(
    '🔐 Login Required',
    'Please sign in to add items to your favorites. Would you like to sign in now?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign In', 
        style: 'default',
        onPress: () => router.push('/(auth)/signin')
      }
    ]
  );
};