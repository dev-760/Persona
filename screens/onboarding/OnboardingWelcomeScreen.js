import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';

const OnboardingWelcomeScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../../assets/onboarding.png')}
          style={styles.image}
          resizeMode="contain"
        />
        
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome to Persona
          </Text>
          
          <Text style={[styles.description, { color: theme.colors.subtext }]}>
            Persona is a dating app that focuses on meaningful connections based on personality rather than appearance.
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={[styles.featureItem, { backgroundColor: theme.colors.white }]}>
              <Image
                source={require('../../assets/feature-personality.png')}
                style={styles.featureIcon}
                resizeMode="contain"
              />
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                Personality First
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.subtext }]}>
                Match with people who share your values and interests
              </Text>
            </View>
            
            <View style={[styles.featureItem, { backgroundColor: theme.colors.white }]}>
              <Image
                source={require('../../assets/feature-reveal.png')}
                style={styles.featureIcon}
                resizeMode="contain"
              />
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                Gradual Reveal
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.subtext }]}>
                Photos unlock after meaningful conversation
              </Text>
            </View>
            
            <View style={[styles.featureItem, { backgroundColor: theme.colors.white }]}>
              <Image
                source={require('../../assets/feature-authentic.png')}
                style={styles.featureIcon}
                resizeMode="contain"
              />
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                Authentic Connections
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.subtext }]}>
                Build relationships based on what truly matters
              </Text>
            </View>
          </View>
          
          <Button
            title="Let's Get Started"
            onPress={() => navigation.navigate('PersonalityQuiz')}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14, 
    lineHeight: 20,
  },
  button: {
    marginTop: 10,
  },
});

export default OnboardingWelcomeScreen;