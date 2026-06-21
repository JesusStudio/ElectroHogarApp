import { Injectable, signal } from '@angular/core';
import { ItemEtiqueta } from '../../../../core/models/etiqueta.model';

@Injectable({ providedIn: 'root' })
export class EtiquetadoStateService {
  // Signal reactivo compartido entre las dos tabs
  private _items = signal<ItemEtiqueta[]>([]);
  items = this._items.asReadonly();

  agregarItem(item: ItemEtiqueta) {
    const existente = this._items().find(i => i.codigo === item.codigo);
    if (existente) {
      this._items.update(list =>
        list.map(i => i.codigo === item.codigo
          ? { ...i, cantidadEtiquetas: i.cantidadEtiquetas + item.cantidadEtiquetas }
          : i
        )
      );
    } else {
      this._items.update(list => [...list, item]);
    }
  }

  eliminarItem(codigo: string) {
    this._items.update(list => list.filter(i => i.codigo !== codigo));
  }

  limpiar() { this._items.set([]); }
}