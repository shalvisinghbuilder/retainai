export interface GameItem {
  id: string;
  name: string;
  category: 'correct' | 'incorrect';
  image?: string;
}

export interface GameState {
  score: number;
  timeRemaining: number;
  items: GameItem[];
  correctBin: GameItem[];
  incorrectBin: GameItem[];
  isPlaying: boolean;
  isComplete: boolean;
}

