'use client';

import { useState, useEffect } from 'react';
import styles from './QueueScreen.module.css';
import { AdaptRecord, AdaptQueue } from '@/lib/api';

interface QueueScreenProps {
  token: string;
  onNavigate: (screen: string) => void;
}

export default function QueueScreen({ token, onNavigate }: QueueScreenProps) {
  const [queue, setQueue] = useState<AdaptQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AdaptRecord | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'override' | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [token]);

  const loadQueue = async () => {
    try {
      const response = await fetch('/api/adapt-queue', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load ADAPT queue');
      }

      const data = await response.json();
      setQueue(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (record: AdaptRecord) => {
    setSelectedRecord(record);
    setActionType('approve');
    setNote('');
  };

  const handleOverride = async (record: AdaptRecord) => {
    setSelectedRecord(record);
    setActionType('override');
    setNote('');
  };

  const handleSubmit = async () => {
    if (!selectedRecord || !actionType) return;

    if (actionType === 'override' && !note.trim()) {
      alert('Please provide an exemption reason');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint =
        actionType === 'approve'
          ? `/api/adapt/${selectedRecord.id}/approve`
          : `/api/adapt/${selectedRecord.id}/override`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          actionType === 'approve' ? { managerNote: note } : { exemptionReason: note },
        ),
      });

      if (!response.ok) {
        throw new Error('Failed to update AdaptRecord');
      }

      // Reload queue
      await loadQueue();
      setSelectedRecord(null);
      setActionType(null);
      setNote('');
    } catch (err: any) {
      alert(err.message || 'Failed to update record');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !queue) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading ADAPT queue...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ADAPT Queue</h1>
        <div className={styles.actions}>
          <button className={styles.navButton} onClick={() => onNavigate('map')}>
            Live Map
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>Error: {error}</div>}

      {queue && queue.items.length === 0 ? (
        <div className={styles.empty}>
          <p>No pending AdaptRecords in queue.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee Badge ID</th>
                <th>Type</th>
                <th>Metric Value</th>
                <th>Threshold</th>
                <th>Generated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue?.items.map((record) => (
                <tr key={record.id}>
                  <td>{record.employeeBadgeId || record.employeeId}</td>
                  <td>{record.type}</td>
                  <td>{record.metricValue}</td>
                  <td>{record.metricThreshold}</td>
                  <td>{new Date(record.generatedAt).toLocaleString()}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.approveButton}
                        onClick={() => handleApprove(record)}
                      >
                        Approve
                      </button>
                      <button
                        className={styles.overrideButton}
                        onClick={() => handleOverride(record)}
                      >
                        Override
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRecord && actionType && (
        <div className={styles.modal} onClick={() => {
          setSelectedRecord(null);
          setActionType(null);
          setNote('');
        }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>
              {actionType === 'approve' ? 'Approve AdaptRecord' : 'Override AdaptRecord'}
            </h3>
            <p>
              <strong>Employee:</strong> {selectedRecord.employeeBadgeId || selectedRecord.employeeId}
            </p>
            <p>
              <strong>Type:</strong> {selectedRecord.type}
            </p>
            <p>
              <strong>Metric Value:</strong> {selectedRecord.metricValue} (Threshold: {selectedRecord.metricThreshold})
            </p>

            <label className={styles.label}>
              {actionType === 'approve' ? 'Manager Note (optional):' : 'Exemption Reason (required):'}
              <textarea
                className={styles.textarea}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  actionType === 'approve'
                    ? 'Add a note...'
                    : 'Explain why this should be exempted...'
                }
                rows={4}
                required={actionType === 'override'}
              />
            </label>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setSelectedRecord(null);
                  setActionType(null);
                  setNote('');
                }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={submitting || (actionType === 'override' && !note.trim())}
              >
                {submitting ? 'Submitting...' : actionType === 'approve' ? 'Approve' : 'Override'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

