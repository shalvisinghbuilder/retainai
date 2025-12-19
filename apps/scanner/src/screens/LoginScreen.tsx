import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { authService } from '../services/auth.service';
import NetInfo from '@react-native-community/netinfo';

interface LoginScreenProps {
  navigation: any;
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [badgeId, setBadgeId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!badgeId.trim()) {
      Alert.alert('Error', 'Please enter your badge ID');
      return;
    }

    // Check connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Alert.alert(
        'No Connectivity',
        'Please connect to the internet to log in. Offline login is not available in MVP.',
      );
      return;
    }

    setLoading(true);
    try {
      await authService.login(badgeId.trim());
      onLoginSuccess();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RetainAI Scanner</Text>
      <Text style={styles.subtitle}>Enter your badge ID to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Badge ID"
        value={badgeId}
        onChangeText={setBadgeId}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

