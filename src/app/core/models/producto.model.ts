export interface Producto {
  id?: string;           // lo asigna Firestore automáticamente
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string;
  categoria: string;
  precio: number;
  stockActual: number;
  stockDisponible: number;
  ubicacion: string;
  estado: 'Activo' | 'Inactivo';
}