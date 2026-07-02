import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonBackButton, IonButtons, IonInput,
  IonButton, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, refreshOutline, warningOutline } from 'ionicons/icons';
import { GestionComercialService } from './services/gestion-comercial.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-gestion-comercial',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonBackButton, IonButtons, IonInput,
    IonButton, IonIcon,
  ],
  templateUrl: './gestion-comercial.page.html',
  styleUrls:  ['./gestion-comercial.page.scss'],
})
export class GestionComercialPage {
  private service   = inject(GestionComercialService);
  private toastCtrl = inject(ToastController);

  codigo:   string           = '';
  producto: Producto | null  = null;
  buscando: boolean          = false;

  constructor() { addIcons({ searchOutline, refreshOutline, warningOutline }); }

  async onBuscar() {
    if (!this.codigo.trim()) return;
    this.buscando = true;
    try {
      this.producto = await this.service.buscarProducto(this.codigo.trim().toUpperCase());
      if (!this.producto) {
        await this.mostrarToast('Producto no encontrado.', 'warning');
      }
    } finally {
      this.buscando = false;
    }
  }

  onLimpiar() {
    this.codigo   = '';
    this.producto = null;
  }

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    await t.present();
  }
}