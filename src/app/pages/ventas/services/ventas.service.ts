import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, addDoc,
  collectionData, query, orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Venta } from '../../../core/models/venta.model';
import { ProductosService } from '../../productos/services/productos.service';
import { MovimientoStock } from '../../../core/models/movimiento-stock.model';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private firestore        = inject(Firestore);
  private productosService = inject(ProductosService);

  private colVentas      = collection(this.firestore, 'ventas');
  private colMovimientos = collection(this.firestore, 'movimientosStock');

  // LISTAR ventas
  listar(): Observable<Venta[]> {
    const q = query(this.colVentas, orderBy('fecha', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Venta[]>;
  }

  // PROCESAR venta completa
  async procesar(
    venta: Omit<Venta, 'id'>,
    usuario: string
  ): Promise<void> {

    // Verificar stock suficiente antes de procesar
    for (const item of venta.items) {
      const producto = await this.productosService.buscarPorCodigo(item.codigo);
      if (!producto) throw new Error(`Producto ${item.codigo} no encontrado.`);
      if (producto.stockActual < item.cantidad) {
        throw new Error(
          `Stock insuficiente para "${producto.nombre}". ` +
          `Disponible: ${producto.stockActual}, solicitado: ${item.cantidad}.`
        );
      }
    }

    // 1. Guardar la venta en Firestore
    const docRef = await addDoc(this.colVentas, {
      ...venta,
      usuario,
      procesado: true,
      fecha: new Date(),
    });

    // 2. Por cada item: descontar stock y registrar movimiento
    for (const item of venta.items) {
      const producto = await this.productosService.buscarPorCodigo(item.codigo);
      if (!producto || !producto.id) continue;

      const nuevoStock = producto.stockActual - item.cantidad;

      // Descontar stock
      await this.productosService.actualizarStock(producto.id, nuevoStock);

      // Registrar movimiento
      const movimiento: Omit<MovimientoStock, 'id'> = {
        productoId:          producto.id,
        codigoProducto:      item.codigo,
        descripcionProducto: item.producto,
        tipoMovimiento:      'Salida',
        cantidad:            item.cantidad,
        fecha:               new Date(),
        usuario,
        referenciaDocId:     docRef.id,
      };
      await addDoc(this.colMovimientos, movimiento);
    }
  }
}