import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonBackButton, IonButtons, IonInput,
  AlertController, ToastController, LoadingController
} from '@ionic/angular/standalone';
import { ProductosService } from '../productos/services/productos.service';
import { RecepcionesService } from './services/recepciones.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto } from '../../core/models/producto.model';
import { ItemRecepcion } from '../../core/models/recepcion.model';
import { ProductSearchBarComponent } from '../../shared/components/product-search-bar/product-search-bar.component';
import { DataTableComponent, ColumnaTabla } from '../../shared/components/data-table/data-table.component';
import { ActionBarComponent } from '../../shared/components/action-bar/action-bar.component';

@Component({
  selector: 'app-recepciones',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonBackButton, IonButtons, IonInput,
    ProductSearchBarComponent,
    DataTableComponent,
    ActionBarComponent,
  ],
  templateUrl: './recepciones.page.html',
  styleUrls:  ['./recepciones.page.scss'],
})
export class RecepcionesPage {
  private productosService   = inject(ProductosService);
  private recepcionesService = inject(RecepcionesService);
  private authService        = inject(AuthService);
  private alertCtrl          = inject(AlertController);
  private toastCtrl          = inject(ToastController);
  private loadingCtrl        = inject(LoadingController);

  // ── Datos generales ──────────────────────────────
  fecha           = new Date().toLocaleDateString('es-PE');
  numeroDocumento = '';
  proveedor       = '';

  // ── Búsqueda de producto ─────────────────────────
  productoEncontrado: Producto | null = null;
  cantidadRecibida    = 1;
  buscando            = false;

  // ── Lista temporal de items ──────────────────────
  items: ItemRecepcion[] = [];
  itemSeleccionado: ItemRecepcion | null = null;

  // ── Columnas de la tabla ─────────────────────────
  columnas: ColumnaTabla[] = [
    { campo: 'codigo',      cabecera: 'Código',      ancho: '90px' },
    { campo: 'descripcion', cabecera: 'Descripción'               },
    { campo: 'cantidad',    cabecera: 'Cant.',        ancho: '55px' },
  ];

  // ── Buscar producto por código ───────────────────
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

  // ── AGREGAR item a la lista temporal ────────────
  async onAgregar() {
    if (!this.productoEncontrado) {
      await this.mostrarToast('Busca un producto primero.', 'warning');
      return;
    }
    if (this.cantidadRecibida <= 0) {
      await this.mostrarToast('La cantidad debe ser mayor a 0.', 'warning');
      return;
    }

    // Si ya existe el producto en la lista, sumar cantidad
    const existente = this.items.find(i => i.codigo === this.productoEncontrado!.codigo);
    if (existente) {
      existente.cantidad += this.cantidadRecibida;
    } else {
      this.items = [...this.items, {
        codigo:      this.productoEncontrado.codigo,
        descripcion: this.productoEncontrado.nombre,
        cantidad:    this.cantidadRecibida,
      }];
    }

    // Limpiar selección
    this.productoEncontrado = null;
    this.cantidadRecibida   = 1;
  }

  // ── ELIMINAR item seleccionado ───────────────────
  onEliminarItem(item: ItemRecepcion) {
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

  // ── LISTAR (scroll a la tabla) ───────────────────
  onListar() {
    const tabla = document.querySelector('app-data-table');
    tabla?.scrollIntoView({ behavior: 'smooth' });
  }

  // ── PROCESAR recepción ───────────────────────────
  async onProcesar() {
    if (!this.validarCabecera()) return;
    if (this.items.length === 0) {
      await this.mostrarToast('Agrega al menos un producto.', 'warning');
      return;
    }

    const alert = await this.alertCtrl.create({
      header:  'Confirmar recepción',
      message: `¿Procesar recepción con ${this.items.length} producto(s)?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Procesar',
          handler: () => this.ejecutarProcesar()
        }
      ]
    });
    await alert.present();
  }

  private async ejecutarProcesar() {
    const loading = await this.loadingCtrl.create({ message: 'Procesando...' });
    await loading.present();

    try {
      const usuario = this.authService.getCurrentUser()?.email ?? 'sistema';
      await this.recepcionesService.procesar({
        fecha:           new Date(),
        numeroDocumento: this.numeroDocumento,
        proveedor:       this.proveedor,
        items:           this.items,
        procesado:       true,
        usuario,
      }, usuario);

      await this.mostrarToast('Recepción procesada correctamente.', 'success');
      this.limpiarFormulario();
    } catch (error: any) {
      await this.mostrarToast('Error al procesar: ' + error.message, 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private validarCabecera(): boolean {
    if (!this.numeroDocumento || !this.proveedor) {
      this.mostrarToast('Completa N° Documento y Proveedor.', 'warning');
      return false;
    }
    return true;
  }

  private limpiarFormulario() {
    this.numeroDocumento    = '';
    this.proveedor          = '';
    this.items              = [];
    this.productoEncontrado = null;
    this.cantidadRecibida   = 1;
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