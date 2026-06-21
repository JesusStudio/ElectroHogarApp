import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonInput, IonSelect, IonSelectOption,
  IonButton, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, refreshOutline } from 'ionicons/icons';
import { ProductosService } from '../services/productos.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-productos-registro',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonInput, IonSelect, IonSelectOption,
    IonButton, IonIcon,
  ],
  templateUrl: './productos-registro.page.html',
  styleUrls: ['./productos-registro.page.scss'],
})
export class ProductosRegistroPage {
  private productosService = inject(ProductosService);
  private toastCtrl        = inject(ToastController);

  isLoading = false;

  categorias = [
    'Televisores', 'Refrigeradoras', 'Lavadoras',
    'Microondas', 'Aire Acondicionado', 'Computadoras',
    'Celulares', 'Audio', 'Otros'
  ];

  // Modelo del formulario
  producto: Producto = this.productoVacio();

  constructor() {
    addIcons({ addOutline, refreshOutline });
  }

  async onAgregar() {
    if (!this.validar()) return;

    this.isLoading = true;
    try {
      await this.productosService.agregar(this.producto);
      await this.mostrarToast('Producto registrado correctamente.', 'success');
      this.onLimpiar();
    } catch (error: any) {
      await this.mostrarToast(error.message, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  onLimpiar() {
    this.producto = this.productoVacio();
  }

  private validar(): boolean {
    const { codigo, nombre, marca, modelo, categoria, precio } = this.producto;
    if (!codigo || !nombre || !marca || !modelo || !categoria || !precio) {
      this.mostrarToast('Completa todos los campos.', 'warning');
      return false;
    }
    return true;
  }

  private productoVacio(): Producto {
    return {
      codigo: '', nombre: '', marca: '', modelo: '',
      categoria: '', precio: 0,
      stockActual: 0, stockDisponible: 0,
      ubicacion: '', estado: 'Activo'
    };
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje, duration: 2500,
      color, position: 'bottom'
    });
    await toast.present();
  }
}