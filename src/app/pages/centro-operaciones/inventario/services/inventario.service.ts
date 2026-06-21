import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData,
  query, where, orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProductosService } from '../../../productos/services/productos.service';
import { MovimientoStock } from '../../../../core/models/movimiento-stock.model';
import { Producto } from '../../../../core/models/producto.model';

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private firestore        = inject(Firestore);
  private productosService = inject(ProductosService);
  private colMovimientos   = collection(this.firestore, 'movimientosStock');

  async buscarProducto(codigo: string): Promise<Producto | null> {
    return this.productosService.buscarPorCodigo(codigo);
  }

  // Historial de movimientos de un producto
  obtenerHistorial(codigoProducto: string): Observable<MovimientoStock[]> {
    const q = query(
      this.colMovimientos,
      where('codigoProducto', '==', codigoProducto),
      orderBy('fecha', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<MovimientoStock[]>;
  }
}