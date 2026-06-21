import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, addDoc,
  collectionData, query, orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Incidencia } from '../../../../core/models/incidencia.model';
import { ProductosService } from '../../../productos/services/productos.service';
import { MovimientoStock } from '../../../../core/models/movimiento-stock.model';

@Injectable({ providedIn: 'root' })
export class IncidenciasService {
  private firestore        = inject(Firestore);
  private productosService = inject(ProductosService);
  private colIncidencias   = collection(this.firestore, 'incidencias');
  private colMovimientos   = collection(this.firestore, 'movimientosStock');

  listar(): Observable<Incidencia[]> {
    const q = query(this.colIncidencias, orderBy('fecha', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Incidencia[]>;
  }

  async procesar(
    incidencia: Omit<Incidencia, 'id'>,
    usuario: string
  ): Promise<void> {

    // 1. Guardar incidencia
    const docRef = await addDoc(this.colIncidencias, {
      ...incidencia, usuario, procesado: true, fecha: new Date(),
    });

    // 2. Por cada item: descontar stock y registrar movimiento
    for (const item of incidencia.items) {
      const producto = await this.productosService.buscarPorCodigo(item.codigo);
      if (!producto || !producto.id) continue;

      const nuevoStock = Math.max(0, producto.stockActual - item.cantidad);
      await this.productosService.actualizarStock(producto.id, nuevoStock);

      const movimiento: Omit<MovimientoStock, 'id'> = {
        productoId:          producto.id,
        codigoProducto:      item.codigo,
        descripcionProducto: item.producto,
        tipoMovimiento:      'Incidencia',
        cantidad:            item.cantidad,
        fecha:               new Date(),
        usuario,
        referenciaDocId:     docRef.id,
      };
      await addDoc(this.colMovimientos, movimiento);
    }
  }
}