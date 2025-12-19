import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator } from 'react-native';
import { databaseService } from './src/services/database.service';
import { syncService } from './src/services/sync.service';
import { authService } from './src/services/auth.service';
import LoginScreen from './src/screens/LoginScreen';
import SentimentScreen from './src/screens/SentimentScreen';
import ScanScreen from './src/screens/ScanScreen';
import StatsScreen from './src/screens/StatsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedSentiment, setHasCompletedSentiment] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        // Initialize database
        await databaseService.initialize();

        // Start sync service
        await syncService.start();

        // Check authentication
        const authenticated = await authService.isAuthenticated();
        setIsAuthenticated(authenticated);

        // TODO: Check if sentiment completed today
        // For now, assume not completed
        setHasCompletedSentiment(false);

        setIsReady(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsReady(true);
      }
    }

    initialize();

    return () => {
      syncService.stop();
    };
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLoginSuccess={() => {
                  setIsAuthenticated(true);
                  // Reset sentiment check on new login
                  setHasCompletedSentiment(false);
                }}
              />
            )}
          </Stack.Screen>
        ) : !hasCompletedSentiment ? (
          <Stack.Screen name="Sentiment">
            {(props) => (
              <SentimentScreen
                {...props}
                onComplete={() => setHasCompletedSentiment(true)}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Scan" component={ScanScreen} />
            <Stack.Screen name="Stats" component={StatsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

