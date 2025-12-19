import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { databaseService } from '../services/database.service';
import { authService } from '../services/auth.service';
import { syncService } from '../services/sync.service';
import { generateUUID } from '../utils/uuid';

interface SentimentScreenProps {
  navigation: any;
  onComplete: () => void;
}

const QUESTION_ID = 'daily_tools_question';
const QUESTION = 'Did you have the tools to succeed yesterday?';

export default function SentimentScreen({ onComplete }: SentimentScreenProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selectedScore === null) {
      Alert.alert('Required', 'Please select a score');
      return;
    }

    setSubmitting(true);
    try {
      const employee = await authService.getEmployee();
      if (!employee) {
        throw new Error('Not authenticated');
      }

      // Create sentiment payload
      const id = await generateUUID();
      const payload = {
        employeeId: employee.id,
        questionId: QUESTION_ID,
        score: selectedScore,
        respondedAt: new Date().toISOString(),
      };

      // Enqueue to SQLite
      await databaseService.enqueue(id, 'SENTIMENT', JSON.stringify(payload));

      // Trigger sync (non-blocking)
      syncService.triggerSync().catch((error) => {
        console.error('Background sync failed:', error);
      });

      // Proceed immediately (offline-first)
      onComplete();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit sentiment');
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Check-in</Text>
      <Text style={styles.question}>{QUESTION}</Text>

      <View style={styles.scoreContainer}>
        {[1, 2, 3, 4, 5].map((score) => (
          <TouchableOpacity
            key={score}
            style={[
              styles.scoreButton,
              selectedScore === score && styles.scoreButtonSelected,
            ]}
            onPress={() => setSelectedScore(score)}
            disabled={submitting}
          >
            <Text
              style={[
                styles.scoreText,
                selectedScore === score && styles.scoreTextSelected,
              ]}
            >
              {score}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.hint}>1 = Strongly Disagree, 5 = Strongly Agree</Text>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (selectedScore === null || submitting) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={selectedScore === null || submitting}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? 'Submitting...' : 'Continue'}
        </Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  question: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
    paddingHorizontal: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  scoreButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scoreButtonSelected: {
    backgroundColor: '#007AFF',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  scoreTextSelected: {
    color: '#fff',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
    maxWidth: 400,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

