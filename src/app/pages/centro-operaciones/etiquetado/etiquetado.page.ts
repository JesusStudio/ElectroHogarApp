import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle,
  IonBackButton, IonButtons,
  IonTabs, IonTabBar, IonTabButton,
  IonLabel, IonRouterOutlet
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-etiquetado',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle,
    IonBackButton, IonButtons,
    IonTabs, IonTabBar, IonTabButton,
    IonLabel,
    IonRouterOutlet,  // ← este es el que faltaba
  ],
  templateUrl: './etiquetado.page.html',
  styleUrls:  ['./etiquetado.page.scss'],
})
export class EtiquetadoPage {}