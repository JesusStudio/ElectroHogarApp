export interface MovimientoStock {
  id?: string;
  productoId: string;
  codigoProducto: string;
  descripcionProducto: string;
  tipoMovimiento: 'Entrada' | 'Salida' | 'Ajuste' | 'Incidencia';
  cantidad: number;
  fecha: Date;
  usuario: string;
  referenciaDocId?: string;  // ID del documento que generó el movimiento
}