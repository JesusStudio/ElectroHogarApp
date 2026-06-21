import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonBackButton, IonButtons, IonIcon
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  trendingUpOutline, cubeOutline,
  warningOutline, pricetagOutline,
  checkmarkCircleOutline, syncOutline, printOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-centro-operaciones',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonBackButton, IonButtons, IonIcon,
  ],
  templateUrl: './centro-operaciones.page.html',
  styleUrls:  ['./centro-operaciones.page.scss'],
})
export class CentroOperacionesPage {

  submodulos = [
    {
      titulo:    'Gestión Comercial',
      subtitulo: 'Precios y estados',
      icono:     'trending-up-outline',
      ruta:      '/centro-operaciones/gestion-comercial',
      color:     '#2563EB',
      bg:        '#EFF6FF',
    },
    {
      titulo:    'Inventario',
      subtitulo: 'Stock y ubicaciones',
      icono:     'cube-outline',
      ruta:      '/centro-operaciones/inventario',
      color:     '#1E3A5F',
      bg:        '#EEF2FF',
    },
    {
      titulo:    'Incidencias',
      subtitulo: 'Registro de incidencias',
      icono:     'warning-outline',
      ruta:      '/centro-operaciones/incidencias',
      color:     '#D97706',
      bg:        '#FFFBEB',
    },
    {
      titulo:    'Etiquetado',
      subtitulo: 'Impresión de etiquetas',
      icono:     'pricetag-outline',
      ruta:      '/centro-operaciones/etiquetado',
      color:     '#DC2626',
      bg:        '#FEF2F2',
    },
  ];

  // Estado del sistema
  estadoSistema = [
    { label: 'Conexión servidor',   valor: 'Activo',              color: 'success' },
    { label: 'Sincronización',      valor: 'Actualizado · ahora', color: 'primary' },
    { label: 'Impresora etiquetas', valor: 'Lista',               color: 'success' },
  ];

  constructor() {
    addIcons({
      trendingUpOutline, cubeOutline,
      warningOutline, pricetagOutline,
      checkmarkCircleOutline, syncOutline, printOutline
    });
  }
}