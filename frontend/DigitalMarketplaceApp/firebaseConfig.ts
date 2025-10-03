import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5_Ycwamq07K1q99piJ2m02JbrF6f3kDs",
  authDomain: "digital-marketplace-app.firebaseapp.com",
  projectId: "digital-marketplace-app",
  storageBucket: "digital-marketplace-app.firebasestorage.app",
  messagingSenderId: "569331507545",
  appId: "1:569331507545:web:ea8117f62d4b33df49ac48",
  measurementId: "G-CW3QPZNPNG"
};

// Initialize Firebase only if no app exists
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication with React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const googleProvider = new GoogleAuthProvider();

// Google OAuth configuration for Expo
export const googleAuthConfig = {
  iosClientId: '569331507545-jlj0dp6spihrt5g0lck5ostkid3f0v8g.apps.googleusercontent.com',
  androidClientId: '569331507545-u8n6ahq4vqtuvvooqr789kuoqlkl26an.apps.googleusercontent.com',
  webClientId: '569331507545-79htok2jftmot86af9nq36vu53ne8a3a.apps.googleusercontent.com',
};

export default app;