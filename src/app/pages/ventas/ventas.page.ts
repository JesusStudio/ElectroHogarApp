import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonBackButton, IonButtons, IonInput,
  AlertController, ToastController, LoadingController
} from '@ionic/angular/standalone';
import { ProductosService } from '../productos/services/productos.service';
import { VentasService } from './services/ventas.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto } from '../../core/models/producto.model';
import { ItemVenta } from '../../core/models/venta.model';
import { ProductSearchBarComponent } from '../../shared/components/product-search-bar/product-search-bar.component';
import { DataTableComponent, ColumnaTabla } from '../../shared/components/data-table/data-table.component';
import { ActionBarComponent } from '../../shared/components/action-bar/action-bar.component';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonBackButton, IonButtons, IonInput,
    ProductSearchBarComponent,
    DataTableComponent,
    ActionBarComponent,
  ],
  templateUrl: './ventas.page.html',
  styleUrls:  ['./ventas.page.scss'],
})
export class VentasPage {
  private productosService = inject(ProductosService);
  private ventasService    = inject(VentasService);
  private authService      = inject(AuthService);
  private alertCtrl        = inject(AlertController);
  private toastCtrl        = inject(ToastController);
  private loadingCtrl      = inject(LoadingController);

  // ── Datos de venta ───────────────────────────────
  cliente   = '';
  documento = '';
  fecha     = new Date().toLocaleDateString('es-PE');

  // ── Búsqueda de producto ─────────────────────────
  productoEncontrado: Producto | null = null;
  cantidad  = 1;
  buscando  = false;

  // ── Lista temporal de items ──────────────────────
  items: ItemVenta[] = [];
  itemSeleccionado: ItemVenta | null = null;

  // ── Columnas de la tabla ─────────────────────────
  columnas: ColumnaTabla[] = [
    { campo: 'codigo',   cabecera: 'Código',   ancho: '80px'  },
    { campo: 'producto', cabecera: 'Producto'                  },
    { campo: 'cantidad', cabecera: 'Cant.',     ancho: '50px'  },
    { campo: 'precio',   cabecera: 'Precio',    ancho: '70px'  },
  ];

  // ── Total de la venta ────────────────────────────
  get totalVenta(): number {
    return this.items.reduce((acc, i) => acc + i.subtotal, 0);
  }

  // ── Buscar producto ──────────────────────────────
  async onBuscarProducto(codigo: string) {
    this.buscando = true;
    try {
      this.productoEncontrado = await this.productosService.buscarPorCodigo(codigo);
      if (!this.productoEncontrado) {
        await this.mostrarToast('Producto no encontrado.', 'warning');
      }
    } finally {
      this.buscando = false;
    }
  }

  // ── AGREGAR item ─────────────────────────────────
  async onAgregar() {
    if (!this.productoEncontrado) {
      await this.mostrarToast('Busca un producto primero.', 'warning');
      return;
    }
    if (this.cantidad <= 0) {
      await this.mostrarToast('La cantidad debe ser mayor a 0.', 'warning');
      return;
    }
    if (this.cantidad > this.productoEncontrado.stockActual) {
      await this.mostrarToast(
        `Stock insuficiente. Disponible: ${this.productoEncontrado.stockActual}`,
        'warning'
      );
      return;
    }

    // Si ya existe, sumar cantidad
    const existente = this.items.find(i => i.codigo === this.productoEncontrado!.codigo);
    if (existente) {
      existente.cantidad += this.cantidad;
      existente.subtotal  = existente.cantidad * existente.precio;
      this.items = [...this.items]; // forzar detección de cambios
    } else {
      const precio = this.productoEncontrado.precio;
      this.items = [...this.items, {
        codigo:   this.productoEncontrado.codigo,
        producto: this.productoEncontrado.nombre,
        cantidad: this.cantidad,
        precio,
        subtotal: precio * this.cantidad,
      }];
    }

    this.productoEncontrado = null;
    this.cantidad = 1;
  }

  // ── ELIMINAR item ────────────────────────────────
  onEliminarItem(item: ItemVenta) {
    this.items = this.items.filter(i => i !== item);
  }

  onEliminar() {
    if (!this.itemSeleccionado) {
      this.mostrarToast('Selecciona un item de la tabla.', 'warning');
      return;
    }
    this.onEliminarItem(this.itemSeleccionado);
    this.itemSeleccionado = null;
  }

  onListar() {
    const tabla = document.querySelector('app-data-table');
    tabla?.scrollIntoView({ behavior: 'smooth' });
  }

  // ── PROCESAR venta ───────────────────────────────
  async onProcesar() {
    if (!this.validarCabecera()) return;
    if (this.items.length === 0) {
      await this.mostrarToast('Agrega al menos un producto.', 'warning');
      return;
    }

    const alert = await this.alertCtrl.create({
      header:  'Confirmar venta',
      message: `¿Procesar venta por S/ ${this.totalVenta.toFixed(2)}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Procesar', handler: () => this.ejecutarProcesar() }
      ]
    });
    await alert.present();
  }

  private async ejecutarProcesar() {
    const loading = await this.loadingCtrl.create({ message: 'Procesando venta...' });
    await loading.present();

    try {
      const usuario = this.authService.getCurrentUser()?.email ?? 'sistema';
      await this.ventasService.procesar({
        cliente:    this.cliente,
        documento:  this.documento,
        fecha:      new Date(),
        items:      this.items,
        totalVenta: this.totalVenta,
        procesado:  true,
        usuario,
      }, usuario);

      await this.mostrarToast('Venta procesada correctamente.', 'success');
      this.limpiarFormulario();
    } catch (error: any) {
      await this.mostrarToast(error.message, 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private validarCabecera(): boolean {
    if (!this.cliente || !this.documento) {
      this.mostrarToast('Completa Cliente y Documento.', 'warning');
      return false;
    }
    return true;
  }

  private limpiarFormulario() {
    this.cliente            = '';
    this.documento          = '';
    this.items              = [];
    this.productoEncontrado = null;
    this.cantidad           = 1;
    this.itemSeleccionado   = null;
    this.fecha = new Date().toLocaleDateString('es-PE');
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje, duration: 2500,
      color, position: 'bottom'
    });
    await toast.present();
  }
}