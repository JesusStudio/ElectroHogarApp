import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonSearchbar, IonIcon,
  IonSpinner, AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { ProductosService } from '../services/productos.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-productos-listado',
  standalone: true,
  imports: [
    CommonModule, IonContent,
    IonSearchbar, IonIcon, IonSpinner,
  ],
  templateUrl: './productos-listado.page.html',
  styleUrls: ['./productos-listado.page.scss'],
})
export class ProductosListadoPage implements OnInit {
  private productosService = inject(ProductosService);
  private alertCtrl        = inject(AlertController);
  private toastCtrl        = inject(ToastController);

  productos:         Producto[] = [];
  productosFiltrados: Producto[] = [];
  isLoading = true;

  constructor() {
    addIcons({ createOutline, trashOutline });
  }

  ngOnInit() {
    this.productosService.listar().subscribe(data => {
      this.productos          = data;
      this.productosFiltrados = data;
      this.isLoading          = false;
    });
  }

  onFiltrar(event: any) {
    const texto = event.detail.value?.toLowerCase() ?? '';
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.codigo.toLowerCase().includes(texto) ||
      p.marca.toLowerCase().includes(texto)
    );
  }

  async onDesactivar(producto: Producto) {
    const alert = await this.alertCtrl.create({
      header:  'Eliminar producto',
      message: `¿Desactivar "${producto.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar', role: 'destructive',
          handler: async () => {
            await this.productosService.desactivar(producto.id!);
            await this.mostrarToast('Producto desactivado.', 'success');
          }
        }
      ]
    });
    await alert.present();
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje, duration: 2000,
      color, position: 'bottom'
    });
    await toast.present();
  }
}