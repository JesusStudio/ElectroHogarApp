import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonInput, IonButton,
  IonIcon, IonToggle, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { EtiquetadoService } from '../services/etiquetado.service';
import { Producto } from '../../../../core/models/producto.model';
import { ProductSearchBarComponent } from '../../../../shared/components/product-search-bar/product-search-bar.component';
import { ItemEtiqueta } from '../../../../core/models/etiqueta.model';
import { Router } from '@angular/router';

// Servicio compartido entre las dos sub-páginas
import { EtiquetadoStateService } from '../services/etiquetado-state.service';

@Component({
  selector: 'app-etiquetado-seleccionar',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonInput, IonButton, IonIcon, IonToggle,
    ProductSearchBarComponent,
  ],
  templateUrl: './etiquetado-seleccionar.page.html',
  styleUrls:  ['./etiquetado-seleccionar.page.scss'],
})
export class EtiquetadoSeleccionarPage {
  private service      = inject(EtiquetadoService);
  private stateService = inject(EtiquetadoStateService);
  private toastCtrl    = inject(ToastController);
  private router = inject(Router);

  productoEncontrado: Producto | null = null;
  promocion:          boolean = false;
  cantidadEtiquetas:  number  = 1;
  buscando:           boolean = false;

  constructor() { addIcons({ addOutline }); }

  async onBuscarProducto(codigo: string) {
    this.buscando = true;
    try {
      this.productoEncontrado = await this.service.buscarProducto(codigo);
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
    const item: ItemEtiqueta = {
      codigo:           this.productoEncontrado.codigo,
      descripcion:      this.productoEncontrado.nombre,
      cantidadEtiquetas: this.cantidadEtiquetas,
    };
    this.stateService.agregarItem(item);
    await this.mostrarToast('Agregado a la lista.', 'success');
    this.productoEncontrado = null;
    this.cantidadEtiquetas  = 1;
    this.promocion          = false;
    await this.router.navigate(['/centro-operaciones/etiquetado/listado'])
  }

  get precioPromocion(): number {
    if (!this.productoEncontrado) return 0;
    return this.productoEncontrado.precio * 0.9; // 10% descuento de ejemplo
  }

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    await t.present();
  }
}