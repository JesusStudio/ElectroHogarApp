import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle,
  IonBackButton, IonButtons,
  IonTabs, IonTabBar, IonTabButton, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-etiquetado',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle,
    IonBackButton, IonButtons,
    IonTabs, IonTabBar, IonTabButton, IonLabel,
  ],
  templateUrl: './etiquetado.page.html',
  styleUrls:  ['./etiquetado.page.scss'],
})
export class EtiquetadoPage {}