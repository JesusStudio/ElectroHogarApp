import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonInput, IonButton, IonText,
  IonSpinner, IonIcon, IonInputPasswordToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, flashOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonText,
    IonSpinner,
    IonIcon,
    IonInputPasswordToggle,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private authService = inject(AuthService);

  email:      string  = '';
  password:   string  = '';
  errorMsg:   string  = '';
  isLoading:  boolean = false;

  constructor() {
    addIcons({ personOutline, lockClosedOutline, flashOutline });
  }

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMsg  = '';

    try {
      await this.authService.login(this.email, this.password);
    } catch (error: any) {
      this.errorMsg = error;
    } finally {
      this.isLoading = false;
    }
  }
}