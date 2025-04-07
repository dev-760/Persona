import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useTheme } from '../store/ThemeContext';
import { useAuth } from '../store/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();
  const { register, googleSignIn } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      // Navigation handled by App.js based on auth state
    } catch (error) {
      let errorMessage = 'Failed to create account. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      Alert.alert('Error', errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      // Navigation handled by App.js based on auth state
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.container, 
          { backgroundColor: theme.colors.background }
        ]}
      >
        <StatusBar style="dark" />
        
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.colors.subtext }]}>
            Join Persona and start connecting
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <Input
            icon="person-outline"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          
          <Input
            icon="mail-outline"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <Input
            icon="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            rightIcon={
              <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                <Ionicons 
                  name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color={theme.colors.subtext} 
                />
              </TouchableOpacity>
            }
          />
          
          <Input
            icon="lock-closed-outline"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureConfirmTextEntry}
            rightIcon={
              <TouchableOpacity onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}>
                <Ionicons 
                  name={secureConfirmTextEntry ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color={theme.colors.subtext} 
                />
              </TouchableOpacity>
            }
          />
          
          <Button 
            title="Sign Up" 
            onPress={handleRegister} 
            loading={loading}
            disabled={loading}
          />
          
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.colors.gray }]} />
            <Text style={[styles.dividerText, { color: theme.colors.subtext }]}>OR</Text>
            <View style={[styles.divider, { backgroundColor: theme.colors.gray }]} />
          </View>
          
          <Button 
            title="Continue with Google" 
            onPress={handleGoogleSignIn}
            icon="logo-google"
            variant="outline"
            disabled={loading}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.subtext }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginText, { color: theme.colors.primary }]}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    marginRight: 5,
  },
  loginText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;