export interface ItemRecepcion {
  codigo: string;
  descripcion: string;
  cantidad: number;
}

export interface Recepcion {
  id?: string;
  fecha: Date;
  numeroDocumento: string;
  proveedor: string;
  items: ItemRecepcion[];
  usuario: string;
  procesado: boolean;
}