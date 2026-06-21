import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData,
  doc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Producto } from '../../../core/models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private firestore = inject(Firestore);
  private col = collection(this.firestore, 'productos');

  // LISTAR todos los productos activos
  listar(): Observable<Producto[]> {
    const q = query(
      this.col,
      where('estado', '==', 'Activo'),
      orderBy('nombre')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Producto[]>;
  }

  // BUSCAR por código exacto (lo usan todos los módulos)
  async buscarPorCodigo(codigo: string): Promise<Producto | null> {
    const q = query(this.col, where('codigo', '==', codigo));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Producto;
  }

  // AGREGAR producto nuevo
  async agregar(producto: Producto): Promise<void> {
    // Verificar que el código no exista ya
    const existente = await this.buscarPorCodigo(producto.codigo);
    if (existente) throw new Error('Ya existe un producto con ese código.');
    await addDoc(this.col, producto);
  }

  // EDITAR producto
  async editar(id: string, datos: Partial<Producto>): Promise<void> {
    const docRef = doc(this.firestore, `productos/${id}`);
    await updateDoc(docRef, datos);
  }

  // DESACTIVAR producto (no se elimina físicamente)
  async desactivar(id: string): Promise<void> {
    const docRef = doc(this.firestore, `productos/${id}`);
    await updateDoc(docRef, { estado: 'Inactivo' });
  }

  // ACTUALIZAR STOCK (lo usan Recepciones, Ventas e Incidencias)
  async actualizarStock(id: string, cantidad: number): Promise<void> {
    const docRef = doc(this.firestore, `productos/${id}`);
    await updateDoc(docRef, {
      stockActual:     cantidad,
      stockDisponible: cantidad
    });
  }
}