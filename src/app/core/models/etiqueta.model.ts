export interface ItemEtiqueta {
  codigo: string;
  descripcion: string;
  cantidadEtiquetas: number;
}

export interface Etiqueta {
  id?: string;
  fecha: Date;
  items: ItemEtiqueta[];
  usuario: string;
}