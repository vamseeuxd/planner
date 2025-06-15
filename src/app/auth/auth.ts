import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, user, createUserWithEmailAndPassword, sendPasswordResetEmail, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

  async signUp(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      throw new Error(this.handleError(error.code));
    }
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      throw new Error(this.handleError(error.code));
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
    } catch (error: any) {
      throw new Error(this.handleError(error.code));
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      throw new Error(this.handleError(error.code));
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  private handleError(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials or sign up.';
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in or use a different email.';
      case 'auth/weak-password':
        return 'Password is too weak. It must be at least 6 characters long.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'Google login was cancelled.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
