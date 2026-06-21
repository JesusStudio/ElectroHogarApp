import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonBackButton,
  IonButtons, IonTabs, IonTabBar, IonTabButton, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle,
    IonBackButton, IonButtons,
    IonTabs, IonTabBar, IonTabButton, IonLabel,
  ],
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage {}