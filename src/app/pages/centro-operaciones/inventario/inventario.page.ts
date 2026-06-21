import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonBackButton, IonButtons, IonInput,
  IonButton, IonIcon, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, refreshOutline, timeOutline } from 'ionicons/icons';
import { InventarioService } from './services/inventario.service';
import { Producto } from '../../../core/models/producto.model';
import { MovimientoStock } from '../../../core/models/movimiento-stock.model';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonBackButton, IonButtons, IonInput,
    IonButton, IonIcon, IonSpinner,
  ],
  templateUrl: './inventario.page.html',
  styleUrls:  ['./inventario.page.scss'],
})
export class InventarioPage {
  private service   = inject(InventarioService);
  private toastCtrl = inject(ToastController);

  codigo:       string              = '';
  producto:     Producto | null     = null;
  movimientos:  MovimientoStock[]   = [];
  buscando:     boolean             = false;
  verHistorial: boolean             = false;

  constructor() { addIcons({ searchOutline, refreshOutline, timeOutline }); }

  async onBuscar() {
    if (!this.codigo.trim()) return;
    this.buscando     = true;
    this.verHistorial = false;
    this.movimientos  = [];

    try {
      this.producto = await this.service.buscarProducto(this.codigo.trim().toUpperCase());
      if (!this.producto) {
        await this.mostrarToast('Producto no encontrado.', 'warning');
      }
    } finally {
      this.buscando = false;
    }
  }

  onHistorial() {
    if (!this.producto) return;
    this.verHistorial = true;
    this.service.obtenerHistorial(this.producto.codigo)
      .subscribe(data => this.movimientos = data);
  }

  onLimpiar() {
    this.codigo       = '';
    this.producto     = null;
    this.movimientos  = [];
    this.verHistorial = false;
  }

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    await t.present();
  }

  formatFecha(fecha: any): string {
    if (!fecha) return '—';
    const d = fecha.toDate ? fecha.toDate() : new Date(fecha);
    return d.toLocaleDateString('es-PE');
  }
}