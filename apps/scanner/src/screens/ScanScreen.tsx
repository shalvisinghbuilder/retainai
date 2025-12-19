import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
  TextInput,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { scanService } from '../services/scan.service';
import { databaseService } from '../services/database.service';
import { authService } from '../services/auth.service';

interface ScanScreenProps {
  navigation: any;
}

export default function ScanScreen({ navigation }: ScanScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [location, setLocation] = useState('A1-B2'); // Default location
  const [manualBarcode, setManualBarcode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
    // Load today's scan count
    loadScanCount();
  }, [permission]);

  const loadScanCount = async () => {
    // TODO: Count scans from queue for today
    // For now, use a simple counter
    const stats = await databaseService.getQueueStats();
    setScanCount(stats.pending + stats.synced);
  };

  const handleBarCodeScanned = async ({ data }: { data: string; type: string }) => {
    if (scanned) return;

    setScanned(true);
    await recordScan(data, 'PICK', 15); // Default action: PICK, 15s expected

    // Reset after 1 second
    setTimeout(() => {
      setScanned(false);
    }, 1000);
  };

  const recordScan = async (
    barcode: string,
    actionType: 'PICK' | 'STOW' | 'COUNT' | 'ERRORLOG',
    expectedSeconds: number,
  ) => {
    try {
      await scanService.recordScan(
        barcode,
        location,
        actionType,
        expectedSeconds,
      );

      // Success feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Vibration.vibrate(100); // Short vibration

      // Update scan count
      setScanCount((prev) => prev + 1);

      // Visual feedback (green flash)
      // This would typically be done with an overlay component
    } catch (error: any) {
      // Error feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Vibration.vibrate(500); // Long vibration

      Alert.alert('Scan Error', error.message || 'Failed to record scan');
    }
  };

  const handleManualSubmit = () => {
    if (!manualBarcode.trim()) {
      Alert.alert('Error', 'Please enter a barcode');
      return;
    }

    recordScan(manualBarcode.trim(), 'PICK', 15);
    setManualBarcode('');
    setShowManualInput(false);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission is required</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowManualInput(true)}
        >
          <Text style={styles.buttonText}>Enter Barcode Manually</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scanner</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>UPH</Text>
          <Text style={styles.statValue}>{scanCount}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Location</Text>
          <Text style={styles.statValue}>{location}</Text>
        </View>
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => navigation.navigate('Stats')}
        >
          <Text style={styles.statsButtonText}>Stats</Text>
        </TouchableOpacity>
      </View>

      {/* Manual Input Modal */}
      {showManualInput && (
        <View style={styles.manualInputOverlay}>
          <View style={styles.manualInputContainer}>
            <Text style={styles.manualInputTitle}>Enter Barcode</Text>
            <TextInput
              style={styles.manualInput}
              placeholder="Barcode"
              value={manualBarcode}
              onChangeText={setManualBarcode}
              autoFocus
              onSubmitEditing={handleManualSubmit}
            />
            <View style={styles.manualInputButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowManualInput(false);
                  setManualBarcode('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleManualSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Scanner */}
      <View style={styles.scannerContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39'],
          }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerFrame} />
          <Text style={styles.scannerHint}>
            Point camera at barcode to scan
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPrimary]}
          onPress={() => setShowManualInput(true)}
        >
          <Text style={styles.actionButtonText}>Manual Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutText: {
    color: '#007AFF',
    fontSize: 16,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statsButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  statsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
  scannerHint: {
    position: 'absolute',
    bottom: 100,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  actionButtons: {
    padding: 20,
    backgroundColor: '#fff',
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  manualInputOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  manualInputContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  manualInputTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  manualInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  manualInputButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#007AFF',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

