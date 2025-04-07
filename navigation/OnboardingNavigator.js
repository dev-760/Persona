import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import OnboardingWelcomeScreen from '../screens/onboarding/OnboardingWelcomeScreen';
import PersonalityQuizScreen from '../screens/onboarding/PersonalityQuizScreen';
import SetupProfileScreen from '../screens/onboarding/SetupProfileScreen';

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="OnboardingWelcome"
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcomeScreen} />
      <Stack.Screen name="PersonalityQuiz" component={PersonalityQuizScreen} />
      <Stack.Screen name="SetupProfile" component={SetupProfileScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;