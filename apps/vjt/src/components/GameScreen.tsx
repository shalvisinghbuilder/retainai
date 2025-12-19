'use client';

import { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './GameScreen.module.css';
import { GameItem } from '@/types';

interface GameScreenProps {
  onComplete: (score: number) => void;
}

const GAME_DURATION = 60; // seconds
const INITIAL_ITEMS: GameItem[] = [
  { id: '1', name: 'Box A', category: 'correct' },
  { id: '2', name: 'Box B', category: 'correct' },
  { id: '3', name: 'Box C', category: 'incorrect' },
  { id: '4', name: 'Box D', category: 'correct' },
  { id: '5', name: 'Box E', category: 'incorrect' },
  { id: '6', name: 'Box F', category: 'correct' },
  { id: '7', name: 'Box G', category: 'incorrect' },
  { id: '8', name: 'Box H', category: 'correct' },
  { id: '9', name: 'Box I', category: 'incorrect' },
  { id: '10', name: 'Box J', category: 'correct' },
];

function DraggableItem({ item }: { item: GameItem }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'item',
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`${styles.item} ${isDragging ? styles.itemDragging : ''}`}
    >
      {item.name}
    </div>
  );
}

function DropBin({
  category,
  items,
  onDrop,
}: {
  category: 'correct' | 'incorrect';
  items: GameItem[];
  onDrop: (item: GameItem) => void;
}) {
  const [{ isOver }, drop] = useDrop({
    accept: 'item',
    drop: (item: GameItem) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`${styles.bin} ${styles[category]} ${isOver ? styles.binOver : ''}`}
    >
      <h3 className={styles.binTitle}>
        {category === 'correct' ? '✓ Correct' : '✗ Incorrect'}
      </h3>
      <div className={styles.binItems}>
        {items.map((item) => (
          <div key={item.id} className={styles.binItem}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function GameContent({ onComplete }: GameScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<GameItem[]>(INITIAL_ITEMS);
  const [correctBin, setCorrectBin] = useState<GameItem[]>([]);
  const [incorrectBin, setIncorrectBin] = useState<GameItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          onComplete(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, score, onComplete]);

  const handleDrop = useCallback(
    (item: GameItem, category: 'correct' | 'incorrect') => {
      if (!isPlaying) return;

      // Remove from items
      setItems((prev) => prev.filter((i) => i.id !== item.id));

      // Add to appropriate bin
      if (category === 'correct') {
        setCorrectBin((prev) => [...prev, item]);
        // Correct placement: +100 points
        if (item.category === 'correct') {
          setScore((prev) => Math.min(1000, prev + 100));
        } else {
          // Wrong bin: -50 points
          setScore((prev) => Math.max(0, prev - 50));
        }
      } else {
        setIncorrectBin((prev) => [...prev, item]);
        // Correct placement: +100 points
        if (item.category === 'incorrect') {
          setScore((prev) => Math.min(1000, prev + 100));
        } else {
          // Wrong bin: -50 points
          setScore((prev) => Math.max(0, prev - 50));
        }
      }
    },
    [isPlaying]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allItemsPlaced = items.length === 0;
  const canFinishEarly = allItemsPlaced && isPlaying;

  const handleFinishEarly = () => {
    if (canFinishEarly) {
      setIsPlaying(false);
      onComplete(score);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          <span className={styles.timerLabel}>Time:</span>
          <span className={styles.timerValue}>{formatTime(timeRemaining)}</span>
        </div>
        <div className={styles.score}>
          <span className={styles.scoreLabel}>Score:</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>
      </div>

      <div className={styles.instructions}>
        <p className={styles.instructionText}>
          <strong>Task:</strong> Sort the items into the correct bins. Place items that belong in the "Correct" bin on the left, and items that belong in the "Incorrect" bin on the right. You'll earn points for correct placements!
        </p>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.itemsArea}>
          <h3 className={styles.itemsTitle}>Drag items to bins:</h3>
          {items.length > 0 ? (
            <div className={styles.items}>
              {items.map((item) => (
                <DraggableItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className={styles.allItemsPlaced}>
              <p>All items have been placed!</p>
              {isPlaying && (
                <button
                  className={styles.finishButton}
                  onClick={handleFinishEarly}
                >
                  Finish Assessment
                </button>
              )}
            </div>
          )}
        </div>

        <div className={styles.binsArea}>
          <DropBin
            category="correct"
            items={correctBin}
            onDrop={(item) => handleDrop(item, 'correct')}
          />
          <DropBin
            category="incorrect"
            items={incorrectBin}
            onDrop={(item) => handleDrop(item, 'incorrect')}
          />
        </div>
      </div>
    </div>
  );
}

export default function GameScreen({ onComplete }: GameScreenProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <GameContent onComplete={onComplete} />
    </DndProvider>
  );
}

