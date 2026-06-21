export interface ItemVenta {
  codigo: string;
  producto: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface Venta {
  id?: string;
  cliente: string;
  documento: string;       // DNI o RUC
  fecha: Date;
  items: ItemVenta[];
  totalVenta: number;
  usuario: string;
  procesado: boolean;
}