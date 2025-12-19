import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your computer's IP address for mobile device access
// Change this to your computer's IP if it's different
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.152:3000';
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const EMPLOYEE_KEY = 'employee';

export interface Employee {
  id: string;
  badgeId: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  employee: Employee;
}

export class AuthService {
  async login(badgeId: string): Promise<AuthResponse> {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badgeId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();

      // Store tokens and employee info
      await AsyncStorage.setItem(TOKEN_KEY, data.accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      await AsyncStorage.setItem(EMPLOYEE_KEY, JSON.stringify(data.employee));

      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message?.includes('Network request failed') || error.message?.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to server at ${API_BASE_URL}. Make sure your device is on the same network and the API is running.`);
      }
      throw error;
    }
  }

  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  }

  async getEmployee(): Promise<Employee | null> {
    const employeeStr = await AsyncStorage.getItem(EMPLOYEE_KEY);
    return employeeStr ? JSON.parse(employeeStr) : null;
  }

  async refreshToken(): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Refresh failed, clear tokens
      await this.logout();
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    await AsyncStorage.setItem(TOKEN_KEY, data.accessToken);
    if (data.refreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, EMPLOYEE_KEY]);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null;
  }
}

export const authService = new AuthService();

