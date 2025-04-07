import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

// Firebase configuration
const firebaseConfig = {
  apiKey: Constants.manifest.extra?.apiKey || process.env.API_KEY,
  authDomain: Constants.manifest.extra?.authDomain || process.env.AUTH_DOMAIN,
  projectId: Constants.manifest.extra?.projectId || process.env.PROJECT_ID,
  storageBucket: Constants.manifest.extra?.storageBucket || process.env.STORAGE_BUCKET,
  messagingSenderId: Constants.manifest.extra?.messagingSenderId || process.env.MESSAGING_SENDER_ID,
  appId: Constants.manifest.extra?.appId || process.env.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export { app, auth, googleProvider, db, storage };