import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonInput, IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-product-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, IonInput, IonButton, IonIcon, IonSpinner],
  templateUrl: './product-search-bar.component.html',
  styleUrls: ['./product-search-bar.component.scss'],
})
export class ProductSearchBarComponent {
  @Input()  descripcion: string  = '';
  @Input()  isLoading:   boolean = false;
  @Output() buscar = new EventEmitter<string>();  // emite el código ingresado

  codigo: string = '';

  constructor() {
    addIcons({ searchOutline });
  }

  onBuscar() {
    if (this.codigo.trim()) {
      this.buscar.emit(this.codigo.trim().toUpperCase());
    }
  }

  limpiar() {
    this.codigo      = '';
    this.descripcion = '';
  }
}