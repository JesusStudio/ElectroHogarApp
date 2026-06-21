export type MotivoIncidencia = 'Producto Dañado' | 'Garantía' | 'Devolución' | 'Pérdida';

export interface ItemIncidencia {
  codigo: string;
  producto: string;
  motivo: MotivoIncidencia;
  cantidad: number;
}

export interface Incidencia {
  id?: string;
  fecha: Date;
  items: ItemIncidencia[];
  usuario: string;
  procesado: boolean;
}