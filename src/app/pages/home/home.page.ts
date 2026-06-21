import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  downloadOutline, cartOutline, cubeOutline,
  clipboardOutline, logOutOutline, ellipseSharp
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ProductosService } from '../productos/services/productos.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ModuleCardComponent } from '../../shared/components/module-card/module-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon,
    StatCardComponent,
    ModuleCardComponent,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private authService     = inject(AuthService);
  private productosService = inject(ProductosService);
  private router          = inject(Router);

  totalProductos  = 0;
  ventasHoy       = 0;       // más adelante lo conectas a Firestore
  stockBajo       = 0;       // productos con stock < 5
  fechaSync       = '';

  // Tarjetas de módulos
  modulos = [
    {
      titulo:    'Recepciones',
      subtitulo: 'Registro de ingreso de mercadería',
      icono:     'download-outline',
      ruta:      '/recepciones'
    },
    {
      titulo:    'Ventas',
      subtitulo: 'Emisión y registro de ventas',
      icono:     'cart-outline',
      ruta:      '/ventas'
    },
    {
      titulo:    'Maestro de Productos',
      subtitulo: 'Gestión del catálogo de productos',
      icono:     'cube-outline',
      ruta:      '/productos'
    },
    {
      titulo:    'Centro de Operaciones',
      subtitulo: 'Gestión comercial e inventario',
      icono:     'clipboard-outline',
      ruta:      '/centro-operaciones'
    },
  ];

  constructor() {
    addIcons({
      downloadOutline, cartOutline, cubeOutline,
      clipboardOutline, logOutOutline, ellipseSharp
    });
  }

  ngOnInit() {
    this.cargarStats();
    this.fechaSync = new Date().toLocaleTimeString('es-PE', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  cargarStats() {
    this.productosService.listar().subscribe(productos => {
      this.totalProductos = productos.length;
      this.stockBajo      = productos.filter(p => p.stockActual < 5).length;
    });
  }

  async onLogout() {
    await this.authService.logout();
  }

  get nombreUsuario(): string {
    const user = this.authService.getCurrentUser();
    return user?.email?.split('@')[0] ?? 'Usuario';
  }
}