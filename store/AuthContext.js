import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register with email and password
  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName,
        createdAt: new Date().toISOString(),
        hasCompletedOnboarding: false,
        personalityTraits: {},
        profileHidden: true,
      });
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Google Sign-In
  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date().toISOString(),
          hasCompletedOnboarding: false,
          personalityTraits: {},
          profileHidden: true,
        });
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('hasCompletedOnboarding');
    } catch (error) {
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data) => {
    try {
      if (currentUser) {
        // Update displayName in Firebase Auth if provided
        if (data.displayName) {
          await updateProfile(currentUser, { displayName: data.displayName });
        }
        
        // Update user data in Firestore
        await setDoc(doc(db, 'users', currentUser.uid), data, { merge: true });
      }
    } catch (error) {
      throw error;
    }
  };

  // Complete onboarding
  const completeOnboarding = async (personalityData) => {
    try {
      if (currentUser) {
        await setDoc(doc(db, 'users', currentUser.uid), {
          hasCompletedOnboarding: true,
          personalityTraits: personalityData,
        }, { merge: true });
        
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    register,
    login,
    googleSignIn,
    logout,
    resetPassword,
    updateUserProfile,
    completeOnboarding,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};