import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonFooter, IonToolbar, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  listOutline, addOutline, trashOutline, checkmarkCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [CommonModule, IonFooter, IonToolbar, IonButton, IonIcon],
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent {
  // Controla qué botones mostrar
  @Input() mostrarListar:   boolean = true;
  @Input() mostrarAgregar:  boolean = true;
  @Input() mostrarEliminar: boolean = true;
  @Input() mostrarProcesar: boolean = true;

  @Input() deshabilitarProcesar: boolean = false;

  @Output() listar   = new EventEmitter<void>();
  @Output() agregar  = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<void>();
  @Output() procesar = new EventEmitter<void>();

  constructor() {
    addIcons({ listOutline, addOutline, trashOutline, checkmarkCircleOutline });
  }
}