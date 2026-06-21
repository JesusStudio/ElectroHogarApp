import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'recepciones',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/recepciones/recepciones.page').then(m => m.RecepcionesPage),
  },
  {
    path: 'ventas',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/ventas/ventas.page').then(m => m.VentasPage),
  },

  // ─── Productos: contenedor con tabs internas ───────────────────────────────
  {
    path: 'productos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/productos/productos.page').then(m => m.ProductosPage),
    children: [
      {
        path: 'registro',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/productos/productos-registro/productos-registro.page').then(m => m.ProductosRegistroPage),
      },
      {
        path: 'listado',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/productos/productos-listado/productos-listado.page').then(m => m.ProductosListadoPage),
      },
      {
        path: '',
        redirectTo: 'registro',  // tab por defecto al entrar a Productos
        pathMatch: 'full',
      },
    ],
  },

  // ─── Centro de Operaciones: contenedor con 4 sub-módulos ──────────────────
  {
    path: 'centro-operaciones',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/centro-operaciones/centro-operaciones.page').then(m => m.CentroOperacionesPage),
  },
  {
    path: 'centro-operaciones/gestion-comercial',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/centro-operaciones/gestion-comercial/gestion-comercial.page').then(m => m.GestionComercialPage),
  },
  {
    path: 'centro-operaciones/inventario',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/centro-operaciones/inventario/inventario.page').then(m => m.InventarioPage),
  },
  {
    path: 'centro-operaciones/incidencias',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/centro-operaciones/incidencias/incidencias.page').then(m => m.IncidenciasPage),
  },

  // ─── Etiquetado: contenedor con tabs internas ─────────────────────────────
  {
    path: 'centro-operaciones/etiquetado',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/centro-operaciones/etiquetado/etiquetado.page').then(m => m.EtiquetadoPage),
    children: [
      {
        path: 'seleccionar',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/centro-operaciones/etiquetado/etiquetado-seleccionar/etiquetado-seleccionar.page').then(m => m.EtiquetadoSeleccionarPage),
      },
      {
        path: 'listado',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/centro-operaciones/etiquetado/etiquetado-listado/etiquetado-listado.page').then(m => m.EtiquetadoListadoPage),
      },
      {
        path: '',
        redirectTo: 'seleccionar', // tab por defecto al entrar a Etiquetado
        pathMatch: 'full',
      },
    ],
  },
];