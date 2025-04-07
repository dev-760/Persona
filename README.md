# Persona - Personality-First Dating App

Persona is a dating app that focuses on matching people based on personality compatibility rather than appearance. Profile photos are hidden until users exchange a meaningful number of messages.

## Features

- Personality quiz for matching compatibility
- Photo-free discovery to focus on personality
- Photos revealed only after meaningful conversation
- Real-time chat functionality
- Firebase backend integration (auth, storage, database)

## Tech Stack

- React Native with Expo
- Firebase (Authentication, Firestore, Storage)
- React Navigation for routing
- Expo Vector Icons
- AsyncStorage for local storage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/persona-dating-app.git
```

2. Install dependencies
```
cd persona-dating-app
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```
API_KEY=your_firebase_api_key
AUTH_DOMAIN=your_firebase_auth_domain
PROJECT_ID=your_firebase_project_id
STORAGE_BUCKET=your_firebase_storage_bucket
MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
APP_ID=your_firebase_app_id
```

4. Start the development server
```
npx expo start
```

5. Use the Expo Go app on your mobile device to scan the QR code and test the application

## Project Structure

```
/
├── assets/               # Images and other static assets
├── components/           # Reusable UI components
├── constants/            # App constants, theme configuration
├── navigation/           # Navigation configuration
├── screens/              # App screens
├── services/             # Firebase and other external services
├── store/                # State management
├── utils/                # Helper functions
├── App.js                # App entry point
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## Setting up Firebase

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google Sign-In)
3. Create a Firestore database
4. Set up Firebase Storage for profile images
5. Add your Firebase configuration to the `.env` file

## Running Tests

```
npm run test
```
