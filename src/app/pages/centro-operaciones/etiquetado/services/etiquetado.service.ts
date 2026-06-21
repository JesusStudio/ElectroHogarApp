import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { ProductosService } from '../../../productos/services/productos.service';
import { Producto } from '../../../../core/models/producto.model';

@Injectable({ providedIn: 'root' })
export class EtiquetadoService {
  private firestore        = inject(Firestore);
  private productosService = inject(ProductosService);
  private colEtiquetas     = collection(this.firestore, 'etiquetas');

  async buscarProducto(codigo: string): Promise<Producto | null> {
    return this.productosService.buscarPorCodigo(codigo);
  }

  async guardarImpresion(items: any[], usuario: string): Promise<void> {
    await addDoc(this.colEtiquetas, {
      fecha: new Date(), items, usuario,
    });
  }
}