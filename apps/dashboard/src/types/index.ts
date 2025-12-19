export interface User {
  id: string;
  badgeId: string;
  role: 'ASSOCIATE' | 'MANAGER' | 'ADMIN';
}

export type Screen = 'login' | 'map' | 'queue';

