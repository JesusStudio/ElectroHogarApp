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
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';

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
  stateService          = inject(EtiquetadoStateService);
  private etiquetadoService = inject(EtiquetadoService);
  private authService       = inject(AuthService);
  private alertCtrl         = inject(AlertController);
  private toastCtrl         = inject(ToastController);
  private loadingCtrl       = inject(LoadingController);

  constructor() {
    addIcons({ trashOutline, printOutline, refreshOutline });
  }

  onEliminar(item: ItemEtiqueta) {
    this.stateService.eliminarItem(item.codigo);
  }

  async onLimpiarLista() {
    const alert = await this.alertCtrl.create({
      header:  'Limpiar lista',
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
      await this.mostrarToast('La lista está vacía.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Generando PDF...' });
    await loading.present();

    try {
      // 1. Guardar en Firestore
      const usuario = this.authService.getCurrentUser()?.email ?? 'sistema';
      await this.etiquetadoService.guardarImpresion(
        this.stateService.items(), usuario
      );

      // 2. Generar y descargar PDF
      await this.generarPDF();

      await this.mostrarToast('PDF generado correctamente.', 'success');
      this.stateService.limpiar();
    } catch (e: any) {
      await this.mostrarToast(e.message, 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private async generarPDF() {
    const doc      = new jsPDF('p', 'mm', 'a4');
    const items    = this.stateService.items();
    const pageW    = doc.internal.pageSize.getWidth();

    // ── Configuración de etiqueta ──────────────────
    const etW      = 90;   // ancho etiqueta mm
    const etH      = 40;   // alto etiqueta mm
    const marginX  = 10;
    const marginY  = 15;
    const colGap   = 5;
    const rowGap   = 5;
    const cols     = 2;

    let col = 0;
    let row = 0;

    for (const item of items) {
      for (let i = 0; i < item.cantidadEtiquetas; i++) {

        const x = marginX + col * (etW + colGap);
        const y = marginY + row * (etH + rowGap);

        // ── Borde de la etiqueta ───────────────────
        doc.setDrawColor(200, 200, 200);
        doc.roundedRect(x, y, etW, etH, 2, 2);

        // ── Nombre de la tienda ────────────────────
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text('ElectroHogar', x + etW / 2, y + 5, { align: 'center' });

        // ── Descripción del producto ───────────────
        doc.setFontSize(9);
        doc.setTextColor(30, 58, 95);
        doc.setFont('helvetica', 'bold');
        const nombre = doc.splitTextToSize(item.descripcion, etW - 6);
        doc.text(nombre[0], x + etW / 2, y + 11, { align: 'center' });

        // ── Código de barras ───────────────────────
        const canvas  = document.createElement('canvas');
        JsBarcode(canvas, item.codigo, {
          format:      'CODE128',
          width:       1.5,
          height:      30,
          displayValue: false,
          margin:      0,
        });
        const barcodeImg = canvas.toDataURL('image/png');
        const barcodeW   = 60;
        const barcodeH   = 14;
        doc.addImage(
          barcodeImg, 'PNG',
          x + (etW - barcodeW) / 2,
          y + 14,
          barcodeW, barcodeH
        );

        // ── Código textual bajo el barcode ─────────
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(item.codigo, x + etW / 2, y + 30, { align: 'center' });

        // ── Precio ─────────────────────────────────
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 95);
        doc.text(`S/ ${item.cantidadEtiquetas}`, x + etW / 2, y + 38, { align: 'center' });

        // ── Siguiente posición ─────────────────────
        col++;
        if (col >= cols) {
          col = 0;
          row++;
          // Nueva página si se llena
          const maxRows = Math.floor(
            (doc.internal.pageSize.getHeight() - marginY * 2) / (etH + rowGap)
          );
          if (row >= maxRows) {
            doc.addPage();
            row = 0;
          }
        }
      }
    }

    // ── Descargar el PDF ───────────────────────────
    const fecha = new Date().toLocaleDateString('es-PE').replace(/\//g, '-');
    doc.save(`etiquetas-electrohogar-${fecha}.pdf`);
  }

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({
      message: msg, duration: 2500, color, position: 'bottom'
    });
    await t.present();
  }
}