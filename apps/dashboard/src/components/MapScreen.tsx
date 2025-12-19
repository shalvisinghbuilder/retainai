'use client';

import { useState, useEffect } from 'react';
import styles from './MapScreen.module.css';
import { WorkerPosition, FloorState } from '@/lib/api';

interface MapScreenProps {
  token: string;
  onNavigate: (screen: string) => void;
}

const GRID_SIZE = 100;
const CELL_SIZE = 8; // pixels

export default function MapScreen({ token, onNavigate }: MapScreenProps) {
  const [floorState, setFloorState] = useState<FloorState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<WorkerPosition | null>(null);

  useEffect(() => {
    loadFloorState();
    const interval = setInterval(loadFloorState, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [token]);

  const loadFloorState = async () => {
    try {
      const response = await fetch('/api/floor-state', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load floor state');
      }

      const data = await response.json();
      setFloorState(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4caf50'; // green
      case 'idle':
        return '#ff9800'; // orange
      case 'offline':
        return '#999'; // gray
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'idle':
        return 'Idle';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  if (loading && !floorState) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading floor state...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Live Floor Map</h1>
        <div className={styles.actions}>
          <button
            className={styles.navButton}
            onClick={() => onNavigate('queue')}
          >
            ADAPT Queue
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>Error: {error}</div>}

      <div className={styles.mapContainer}>
        <div className={styles.map}>
          {floorState?.workers.map((worker) => (
            <div
              key={worker.employeeId}
              className={styles.workerDot}
              style={{
                left: `${(worker.x / GRID_SIZE) * 100}%`,
                top: `${(worker.y / GRID_SIZE) * 100}%`,
                backgroundColor: getStatusColor(worker.status),
              }}
              onClick={() => setSelectedWorker(worker)}
              title={`Employee: ${worker.employeeId}\nStatus: ${getStatusLabel(worker.status)}\nLast Scan: ${new Date(worker.lastScan).toLocaleString()}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ backgroundColor: '#4caf50' }} />
          <span>Active (&lt; 2 min)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ backgroundColor: '#ff9800' }} />
          <span>Idle (2-15 min)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ backgroundColor: '#999' }} />
          <span>Offline (&gt; 15 min)</span>
        </div>
        {floorState && (
          <div className={styles.timestamp}>
            Last updated: {new Date(floorState.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>

      {selectedWorker && (
        <div className={styles.modal} onClick={() => setSelectedWorker(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Worker Details</h3>
            <p><strong>Employee ID:</strong> {selectedWorker.employeeId}</p>
            <p><strong>Status:</strong> {getStatusLabel(selectedWorker.status)}</p>
            <p><strong>Last Scan:</strong> {new Date(selectedWorker.lastScan).toLocaleString()}</p>
            <p><strong>Position:</strong> ({selectedWorker.x}, {selectedWorker.y})</p>
            <button className={styles.closeButton} onClick={() => setSelectedWorker(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

