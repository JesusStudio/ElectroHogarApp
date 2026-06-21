import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

// Definición de columna
export interface ColumnaTabla {
  campo:    string;   // nombre del campo en el objeto
  cabecera: string;   // texto que se muestra en el header
  ancho?:   string;   // ej: '60px', 'auto'
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent {
  @Input()  columnas:        ColumnaTabla[] = [];
  @Input()  datos:           any[]          = [];
  @Input()  filaSeleccionada: any           = null;
  @Input()  titulo:          string         = '';

  @Output() seleccionar = new EventEmitter<any>();
  @Output() eliminar    = new EventEmitter<any>();

  constructor() {
    addIcons({ trashOutline });
  }

  onSeleccionar(fila: any) {
    this.filaSeleccionada = fila;
    this.seleccionar.emit(fila);
  }
}