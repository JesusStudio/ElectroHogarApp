import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonBackButton, IonButtons, IonInput,
  IonSelect, IonSelectOption,
  AlertController, ToastController, LoadingController
} from '@ionic/angular/standalone';
import { ProductosService } from '../../productos/services/productos.service';
import { IncidenciasService } from './services/incidencias.service';
import { AuthService } from '../../../core/services/auth.service';
import { Producto } from '../../../core/models/producto.model';
import { ItemIncidencia, MotivoIncidencia } from '../../../core/models/incidencia.model';
import { ProductSearchBarComponent } from '../../../shared/components/product-search-bar/product-search-bar.component';
import { DataTableComponent, ColumnaTabla } from '../../../shared/components/data-table/data-table.component';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonBackButton, IonButtons, IonInput,
    IonSelect, IonSelectOption,
    ProductSearchBarComponent,
    DataTableComponent,
    ActionBarComponent,
  ],
  templateUrl: './incidencias.page.html',
  styleUrls:  ['./incidencias.page.scss'],
})
export class IncidenciasPage {
  private productosService  = inject(ProductosService);
  private incidenciasService = inject(IncidenciasService);
  private authService       = inject(AuthService);
  private alertCtrl         = inject(AlertController);
  private toastCtrl         = inject(ToastController);
  private loadingCtrl       = inject(LoadingController);

  fecha    = new Date().toLocaleDateString('es-PE');
  buscando = false;

  productoEncontrado: Producto | null = null;
  motivo:     MotivoIncidencia = 'Producto Dañado';
  unidad:     string           = 'Unidad';
  cantidad:   number           = 1;
  observacion: string          = '';

  motivos: MotivoIncidencia[] = [
    'Producto Dañado', 'Garantía', 'Devolución', 'Pérdida'
  ];
  unidades = ['Unidad', 'Par', 'Caja', 'Paquete'];

  items: ItemIncidencia[]         = [];
  itemSeleccionado: ItemIncidencia | null = null;

  columnas: ColumnaTabla[] = [
    { campo: 'codigo',   cabecera: 'Código',  ancho: '80px' },
    { campo: 'producto', cabecera: 'Producto'               },
    { campo: 'motivo',   cabecera: 'Motivo',  ancho: '90px' },
    { campo: 'cantidad', cabecera: 'Cant.',   ancho: '50px' },
  ];

  async onBuscarProducto(codigo: string) {
    this.buscando = true;
    try {
      this.productoEncontrado = await this.productosService.buscarPorCodigo(codigo);
      if (!this.productoEncontrado)
        await this.mostrarToast('Producto no encontrado.', 'warning');
    } finally {
      this.buscando = false;
    }
  }

  async onAgregar() {
    if (!this.productoEncontrado) {
      await this.mostrarToast('Busca un producto primero.', 'warning'); return;
    }
    if (this.cantidad <= 0) {
      await this.mostrarToast('Cantidad debe ser mayor a 0.', 'warning'); return;
    }
    this.items = [...this.items, {
      codigo:   this.productoEncontrado.codigo,
      producto: this.productoEncontrado.nombre,
      motivo:   this.motivo,
      cantidad: this.cantidad,
    }];
    this.productoEncontrado = null;
    this.cantidad = 1;
    this.observacion = '';
  }

  onEliminarItem(item: ItemIncidencia) {
    this.items = this.items.filter(i => i !== item);
  }

  onEliminar() {
    if (!this.itemSeleccionado) {
      this.mostrarToast('Selecciona un item.', 'warning'); return;
    }
    this.onEliminarItem(this.itemSeleccionado);
    this.itemSeleccionado = null;
  }

  onListar() {
    document.querySelector('app-data-table')?.scrollIntoView({ behavior: 'smooth' });
  }

  async onProcesar() {
    if (this.items.length === 0) {
      await this.mostrarToast('Agrega al menos un item.', 'warning'); return;
    }
    const alert = await this.alertCtrl.create({
      header:  'Confirmar incidencia',
      message: `¿Registrar ${this.items.length} incidencia(s)?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Procesar', handler: () => this.ejecutarProcesar() }
      ]
    });
    await alert.present();
  }

  private async ejecutarProcesar() {
    const loading = await this.loadingCtrl.create({ message: 'Procesando...' });
    await loading.present();
    try {
      const usuario = this.authService.getCurrentUser()?.email ?? 'sistema';
      await this.incidenciasService.procesar({
        fecha: new Date(), items: this.items,
        procesado: true, usuario,
      }, usuario);
      await this.mostrarToast('Incidencia registrada correctamente.', 'success');
      this.items = []; this.itemSeleccionado = null;
    } catch (e: any) {
      await this.mostrarToast(e.message, 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2500, color });
    await t.present();
  }
}