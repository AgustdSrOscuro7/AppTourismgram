import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Place } from '../../../interfaces/data.interface';

@Component({
  selector: 'app-site-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card *ngIf="site">
      <ion-card-header>
        <ion-card-title>{{ site.name }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p>Imagen: {{ site.img}}</p>
        <p>Tipo: {{ site.type }}</p>
      </ion-card-content>
    </ion-card>
  `,
  styles: [``]
})
export class SiteCardComponent {
  @Input() site!: Place;
}
