import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';
import { useAuth } from '../../store/AuthContext';

const { width } = Dimensions.get('window');

// Quiz questions
const questions = [
  {
    id: '1',
    question: 'How do you recharge?',
    choices: [
      { id: 'a', text: 'Being around friends and people energizes me', trait: 'extroversion', value: 1 },
      { id: 'b', text: 'A mix of social time and alone time', trait: 'extroversion', value: 0.5 },
      { id: 'c', text: 'I need quiet time alone to recharge', trait: 'extroversion', value: 0 }
    ]
  },
  {
    id: '2',
    question: 'How do you make decisions?',
    choices: [
      { id: 'a', text: 'I trust my gut feelings and consider how decisions affect others', trait: 'feeling', value: 1 },
      { id: 'b', text: 'I balance logic with emotional considerations', trait: 'feeling', value: 0.5 },
      { id: 'c', text: 'I prefer logical analysis and objective criteria', trait: 'feeling', value: 0 }
    ]
  },
  {
    id: '3',
    question: 'How do you approach planning?',
    choices: [
      { id: 'a', text: 'I like structure, schedules, and clear plans', trait: 'judging', value: 1 },
      { id: 'b', text: 'I have some plans but stay flexible', trait: 'judging', value: 0.5 },
      { id: 'c', text: 'I prefer to go with the flow and keep options open', trait: 'judging', value: 0 }
    ]
  },
  {
    id: '4',
    question: 'How do you process information?',
    choices: [
      { id: 'a', text: 'I focus on concrete details and practical applications', trait: 'sensing', value: 1 },
      { id: 'b', text: 'I notice details but also think about future possibilities', trait: 'sensing', value: 0.5 },
      { id: 'c', text: 'I think about concepts, patterns, and future possibilities', trait: 'sensing', value: 0 }
    ]
  },
  {
    id: '5',
    question: 'How do you approach conflict?',
    choices: [
      { id: 'a', text: 'I try to find compromise and maintain harmony', trait: 'agreeableness', value: 1 },
      { id: 'b', text: 'It depends on the situation', trait: 'agreeableness', value: 0.5 },
      { id: 'c', text: 'I address issues directly and stand my ground', trait: 'agreeableness', value: 0 }
    ]
  },
  {
    id: '6',
    question: 'How organized are you?',
    choices: [
      { id: 'a', text: 'Very organized with systems for everything', trait: 'conscientiousness', value: 1 },
      { id: 'b', text: 'Somewhat organized in important areas', trait: 'conscientiousness', value: 0.5 },
      { id: 'c', text: 'I prefer a more spontaneous approach to life', trait: 'conscientiousness', value: 0 }
    ]
  },
  {
    id: '7',
    question: 'How do you view change?',
    choices: [
      { id: 'a', text: 'I embrace new experiences and change', trait: 'openness', value: 1 },
      { id: 'b', text: 'I like some novelty but also value tradition', trait: 'openness', value: 0.5 },
      { id: 'c', text: 'I prefer familiar routines and traditions', trait: 'openness', value: 0 }
    ]
  },
  {
    id: '8',
    question: 'How do you handle stress?',
    choices: [
      { id: 'a', text: 'I stay calm and adapt to challenges', trait: 'neuroticism', value: 0 },
      { id: 'b', text: 'I feel some stress but manage it', trait: 'neuroticism', value: 0.5 },
      { id: 'c', text: 'I can get worried or anxious under pressure', trait: 'neuroticism', value: 1 }
    ]
  },
];

const PersonalityQuizScreen = ({ navigation }) => {
  const theme = useTheme();
  const { completeOnboarding } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const handleAnswerSelect = (choice) => {
    const question = questions[currentQuestionIndex];
    
    // Save the answer
    setAnswers({
      ...answers,
      [question.id]: {
        trait: choice.trait,
        value: choice.value,
      }
    });
    
    // Move to next question or finish quiz
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: currentQuestionIndex + 1, animated: true });
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    } else {
      // Process results
      finishQuiz();
    }
  };

  const calculatePersonalityTraits = () => {
    // Initialize traits
    const traits = {
      extroversion: 0,
      feeling: 0,
      judging: 0,
      sensing: 0,
      agreeableness: 0,
      conscientiousness: 0,
      openness: 0,
      neuroticism: 0
    };
    
    // Calculate average scores for each trait
    Object.values(answers).forEach(answer => {
      traits[answer.trait] += answer.value;
    });
    
    // Scale to percentages and generate personality tags
    const personalityTags = [];
    
    if (traits.extroversion >= 0.6) personalityTags.push('Extroverted');
    else if (traits.extroversion <= 0.4) personalityTags.push('Introverted');
    else personalityTags.push('Ambivert');
    
    if (traits.feeling >= 0.6) personalityTags.push('Feeling');
    else if (traits.feeling <= 0.4) personalityTags.push('Thinking');
    else personalityTags.push('Balanced');
    
    if (traits.judging >= 0.6) personalityTags.push('Structured');
    else if (traits.judging <= 0.4) personalityTags.push('Flexible');
    else personalityTags.push('Adaptable');
    
    if (traits.sensing >= 0.6) personalityTags.push('Practical');
    else if (traits.sensing <= 0.4) personalityTags.push('Intuitive');
    else personalityTags.push('Perceptive');
    
    if (traits.agreeableness >= 0.6) personalityTags.push('Agreeable');
    else if (traits.agreeableness <= 0.4) personalityTags.push('Direct');
    else personalityTags.push('Diplomatic');
    
    if (traits.conscientiousness >= 0.6) personalityTags.push('Organized');
    else if (traits.conscientiousness <= 0.4) personalityTags.push('Spontaneous');
    else personalityTags.push('Balanced');
    
    if (traits.openness >= 0.6) personalityTags.push('Adventurous');
    else if (traits.openness <= 0.4) personalityTags.push('Traditional');
    else personalityTags.push('Moderate');
    
    if (traits.neuroticism <= 0.4) personalityTags.push('Calm');
    else if (traits.neuroticism >= 0.6) personalityTags.push('Sensitive');
    else personalityTags.push('Resilient');
    
    return {
      traits,
      personalityTags
    };
  };

  const finishQuiz = async () => {
    setLoading(true);
    
    try {
      const personalityResults = calculatePersonalityTraits();
      
      // Save results to user profile
      await completeOnboarding(personalityResults);
      
      // Navigate to profile setup
      navigation.navigate('SetupProfile', { personalityResults });
    } catch (error) {
      Alert.alert('Error', 'Failed to save your personality profile. Please try again.');
      setLoading(false);
    }
  };

  const renderQuestion = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width
    ];
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp'
    });
    
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, 50],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View 
        style={[
          styles.questionContainer, 
          { width, opacity, transform: [{ translateY }] }
        ]}
      >
        <Text style={[styles.questionNumber, { color: theme.colors.primary }]}>
          Question {index + 1} of {questions.length}
        </Text>
        
        <Text style={[styles.questionText, { color: theme.colors.text }]}>
          {item.question}
        </Text>
        
        <View style={styles.choicesContainer}>
          {item.choices.map((choice) => (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.choiceButton,
                { backgroundColor: theme.colors.white }
              ]}
              onPress={() => handleAnswerSelect(choice)}
            >
              <Text style={[styles.choiceText, { color: theme.colors.text }]}>
                {choice.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (currentQuestionIndex > 0) {
              flatListRef.current.scrollToIndex({ 
                index: currentQuestionIndex - 1, 
                animated: true 
              });
              setCurrentQuestionIndex(currentQuestionIndex - 1);
            } else {
              navigation.goBack();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Personality Quiz
        </Text>
        
        <View style={styles.placeholder} />
      </View>
      
      <ProgressBar 
        progress={(currentQuestionIndex + 1) / questions.length}
        color={theme.colors.primary}
        style={styles.progressBar}
      />
      
      <FlatList
        ref={flatListRef}
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        style={styles.questionList}
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Creating your personality profile...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  progressBar: {
    marginHorizontal: 20,
  },
  questionList: {
    flex: 1,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  questionNumber: {
    fontSize: 14,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  choicesContainer: {
    width: '100%',
  },
  choiceButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  choiceText: {
    fontSize: 16,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default PersonalityQuizScreen;