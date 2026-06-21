import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  // Observable del usuario actual (null si no hay sesión)
  currentUser$ = user(this.auth);

  // Login con email y contraseña
  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      throw this.handleError(error.code);
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  // Obtener usuario actual en un momento puntual
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Traducir errores de Firebase al español
  private handleError(code: string): string {
    const errores: Record<string, string> = {
      'auth/user-not-found':    'Usuario no encontrado.',
      'auth/wrong-password':    'Contraseña incorrecta.',
      'auth/invalid-email':     'Correo inválido.',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
      'auth/invalid-credential':'Credenciales incorrectas.',
    };
    return errores[code] ?? 'Error al iniciar sesión.';
  }
}