import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, addDoc,
  collectionData, query, orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Recepcion } from '../../../core/models/recepcion.model';
import { ProductosService } from '../../productos/services/productos.service';
import { MovimientoStock } from '../../../core/models/movimiento-stock.model';

@Injectable({
  providedIn: 'root'
})
export class RecepcionesService {
  private firestore        = inject(Firestore);
  private productosService = inject(ProductosService);

  private colRecepciones   = collection(this.firestore, 'recepciones');
  private colMovimientos   = collection(this.firestore, 'movimientosStock');

  // LISTAR recepciones procesadas
  listar(): Observable<Recepcion[]> {
    const q = query(this.colRecepciones, orderBy('fecha', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Recepcion[]>;
  }

  // PROCESAR recepción completa
  async procesar(
    recepcion: Omit<Recepcion, 'id'>,
    usuario: string
  ): Promise<void> {

    // 1. Guardar la recepción en Firestore
    const docRef = await addDoc(this.colRecepciones, {
      ...recepcion,
      usuario,
      procesado: true,
      fecha: new Date(),
    });

    // 2. Por cada item: actualizar stock y registrar movimiento
    for (const item of recepcion.items) {
      const producto = await this.productosService.buscarPorCodigo(item.codigo);
      if (!producto || !producto.id) continue;

      const nuevoStock = producto.stockActual + item.cantidad;

      // Actualizar stock del producto
      await this.productosService.actualizarStock(producto.id, nuevoStock);

      // Registrar movimiento
      const movimiento: Omit<MovimientoStock, 'id'> = {
        productoId:           producto.id,
        codigoProducto:       item.codigo,
        descripcionProducto:  item.descripcion,
        tipoMovimiento:       'Entrada',
        cantidad:             item.cantidad,
        fecha:                new Date(),
        usuario,
        referenciaDocId:      docRef.id,
      };
      await addDoc(this.colMovimientos, movimiento);
    }
  }
}