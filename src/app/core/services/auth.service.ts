import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<string | null>(this.getStoredUsername());

  readonly currentUser = this._currentUser.asReadonly();

  private getStoredUsers(): Record<string, string> {
    return JSON.parse(localStorage.getItem('users') || '{}');
  }

  private setStoredUsers(users: Record<string, string>): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  private getStoredUsername(): string | null {
    return localStorage.getItem('currentUser');
  }

  private setStoredUsername(username: string | null): void {
    if (username) {
      localStorage.setItem('currentUser', username);
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  signup(username: string, password: string): boolean {
    const users = this.getStoredUsers();
    if (users[username]) {
      return false; // user already exists
    }
    users[username] = password;
    this.setStoredUsers(users);
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.getStoredUsers();
    if (users[username] === password) {
      this._currentUser.set(username);
      this.setStoredUsername(username);
      return true;
    }
    return false;
  }

  logout(): void {
    this._currentUser.set(null);
    this.setStoredUsername(null);
  }

  isLoggedIn(): boolean {
    return this._currentUser() !== null;
  }
}