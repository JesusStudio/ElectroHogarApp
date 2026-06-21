import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  downloadOutline, cartOutline, cubeOutline,
  clipboardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-module-card',
  standalone: true,
  imports: [CommonModule, RouterModule, IonIcon],
  templateUrl: './module-card.component.html',
  styleUrls: ['./module-card.component.scss'],
})
export class ModuleCardComponent {
  @Input() titulo:      string = '';
  @Input() subtitulo:   string = '';
  @Input() icono:       string = '';
  @Input() ruta:        string = '';

  constructor() {
    addIcons({ downloadOutline, cartOutline, cubeOutline, clipboardOutline });
  }
}