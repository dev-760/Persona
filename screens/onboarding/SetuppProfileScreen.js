import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Button from '../../components/Button';

const SetupProfileScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { currentUser, updateUserProfile } = useAuth();
  const { personalityResults } = route.params;
  
  const [image, setImage] = useState(null);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      Alert.alert('Missing Information', 'Please enter your name');
      return;
    }
    
    setLoading(true);
    
    try {
      let profileData = {
        displayName,
        age: age ? parseInt(age) : null,
        location,
        bio,
        personalityTraits: personalityResults.traits,
        personalityTags: personalityResults.personalityTags,
      };
      
      // Upload profile image if selected
      if (image) {
        const storage = getStorage();
        const filename = `profiles/${currentUser.uid}/${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);
        
        // Convert image URI to blob
        const response = await fetch(image);
        const blob = await response.blob();
        
        // Upload image to Firebase Storage
        await uploadBytes(storageRef, blob);
        
        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        profileData.photoURL = downloadURL;
      }
      
      // Update user
      await updateUserProfile(profileData);
      
      setLoading(false);
      navigation.replace('Main'); // Navigate to main app screen
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.card }]}>
                <Ionicons name="camera" size={40} color={theme.colors.text} />
                <Text style={[styles.addPhotoText, { color: theme.colors.text }]}>
                  Add Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.card }]}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.text}
              value={displayName}
              onChangeText={setDisplayName}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.card }]}
              placeholder="Age"
              placeholderTextColor={theme.colors.text}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.card }]}
              placeholder="Location"
              placeholderTextColor={theme.colors.text}
              value={location}
              onChangeText={setLocation}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.card }]}
              placeholder="Bio"
              placeholderTextColor={theme.colors.text}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
            />
          </View>

          <Button
            title={loading ? 'Creating Profile...' : 'Complete Setup'}
            onPress={handleSubmit}
            disabled={loading}
          />
          {loading && <ActivityIndicator style={styles.loader} color={theme.colors.primary} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    marginVertical: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 16,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  loader: {
    marginTop: 10,
  },
});

export default SetupProfileScreen;