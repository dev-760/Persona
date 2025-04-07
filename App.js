import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigation
import AuthNavigator from './navigation/AuthNavigator';
import MainNavigator from './navigation/MainNavigator';
import OnboardingNavigator from './navigation/OnboardingNavigator';

// State Management
import { AuthContextProvider } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext';
import LoadingScreen from './screens/LoadingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem('hasCompletedOnboarding');
        if (onboardingStatus === 'true') {
          setHasCompletedOnboarding(true);
        }
      } catch (error) {
        console.log('Error checking onboarding status:', error);
      }
    };

    // Check authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserToken(user.uid);
      } else {
        setUserToken(null);
      }
      checkOnboardingStatus();
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthContextProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            {userToken ? (
              hasCompletedOnboarding ? (
                <MainNavigator />
              ) : (
                <OnboardingNavigator />
              )
            ) : (
              <AuthNavigator />
            )}
          </NavigationContainer>
        </AuthContextProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}