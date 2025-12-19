import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { databaseService } from '../services/database.service';

interface StatsScreenProps {
  navigation: any;
}

export default function StatsScreen({ navigation }: StatsScreenProps) {
  const [stats, setStats] = useState({
    pending: 0,
    synced: 0,
    poison: 0,
    total: 0,
  });
  const [lastSync, setLastSync] = useState<string>('Never');

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    const queueStats = await databaseService.getQueueStats();
    setStats(queueStats);

    // TODO: Get last sync time from sync service
    // For now, show current time
    setLastSync(new Date().toLocaleTimeString());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Statistics</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Scans Today</Text>
          <Text style={styles.statValue}>{stats.synced + stats.pending}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pending Sync</Text>
          <Text style={styles.statValue}>{stats.pending}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Synced</Text>
          <Text style={styles.statValue}>{stats.synced}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Last Sync</Text>
          <Text style={styles.statValue}>{lastSync}</Text>
        </View>

        {stats.poison > 0 && (
          <View style={[styles.statCard, styles.errorCard]}>
            <Text style={styles.statLabel}>Failed (Poison)</Text>
            <Text style={styles.statValue}>{stats.poison}</Text>
            <Text style={styles.errorText}>
              These items failed to sync after multiple retries
            </Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Queue Status</Text>
          <Text style={styles.infoText}>
            Total items in queue: {stats.total}
          </Text>
          <Text style={styles.infoText}>
            Max queue size: 2000 items
          </Text>
          <Text style={styles.infoText}>
            Batch size: 50 items per sync
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  content: {
    padding: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  errorCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff0000',
  },
  errorText: {
    fontSize: 12,
    color: '#ff0000',
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

