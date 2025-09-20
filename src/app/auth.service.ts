import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { auth } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Login user
  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Register user baru
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Logout user
  logout() {
    return signOut(auth);
  }

  // Ambil user yang sedang aktif
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}
