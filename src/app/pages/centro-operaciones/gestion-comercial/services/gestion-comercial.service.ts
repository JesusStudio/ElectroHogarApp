import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ProductosService } from '../../../productos/services/productos.service';
import { Producto } from '../../../../core/models/producto.model';

@Injectable({ providedIn: 'root' })
export class GestionComercialService {
  private productosService = inject(ProductosService);

  // Solo consulta — usa el service de productos
  async buscarProducto(codigo: string): Promise<Producto | null> {
    return this.productosService.buscarPorCodigo(codigo);
  }
}