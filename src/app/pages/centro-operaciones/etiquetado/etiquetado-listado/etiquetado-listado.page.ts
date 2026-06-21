import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonButton, IonIcon,
  AlertController, ToastController, LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, printOutline, refreshOutline } from 'ionicons/icons';
import { EtiquetadoStateService } from '../services/etiquetado-state.service';
import { EtiquetadoService } from '../services/etiquetado.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ItemEtiqueta } from '../../../../core/models/etiqueta.model';

@Component({
  selector: 'app-etiquetado-listado',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonButton, IonIcon,
  ],
  templateUrl: './etiquetado-listado.page.html',
  styleUrls:  ['./etiquetado-listado.page.scss'],
})
export class EtiquetadoListadoPage {
  stateService  = inject(EtiquetadoStateService);
  private etiquetadoService = inject(EtiquetadoService);
  private authService       = inject(AuthService);
  private alertCtrl         = inject(AlertController);
  private toastCtrl         = inject(ToastController);
  private loadingCtrl       = inject(LoadingController);

  constructor() { addIcons({ trashOutline, printOutline, refreshOutline }); }

  onEliminar(item: ItemEtiqueta) {
    this.stateService.eliminarItem(item.codigo);
  }

  async onLimpiarLista() {
    const alert = await this.alertCtrl.create({
      header: 'Limpiar lista',
      message: '¿Eliminar todos los items?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Limpiar', handler: () => this.stateService.limpiar() }
      ]
    });
    await alert.present();
  }

  async onImprimir() {
    if (this.stateService.items().length === 0) {
      await this.mostrarToast('La lista está vacía.', 'warning'); return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Enviando a impresora...' });
    await loading.present();
    try {
      const usuario = this.authService.getCurrentUser()?.email ?? 'sistema';
      await this.etiquetadoService.guardarImpresion(this.stateService.items(), usuario);
      await this.mostrarToast('Etiquetas enviadas a imprimir.', 'success');
      this.stateService.limpiar();
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