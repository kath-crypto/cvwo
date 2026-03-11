import { AuthResponse } from '../types';

class AuthService {
  setAuthData(data: AuthResponse) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      username: data.username
    }));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): { id: number; username: string } | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();