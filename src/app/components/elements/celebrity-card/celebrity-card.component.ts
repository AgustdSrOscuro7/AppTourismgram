import { Component, Input } from '@angular/core';
import { Celebrity } from '../../../interfaces/celebrity.interface';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonImg,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, location, star } from 'ionicons/icons';

@Component({
  selector: 'app-celebrity-card',
  templateUrl: './celebrity-card.component.html',
  styleUrls: ['./celebrity-card.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonImg,
    IonButton,
    IonIcon
  ]
})
export class CelebrityCardComponent {
  @Input() celebrity!: Celebrity;

  constructor() {
    // Registrar los íconos que necesitamos
    addIcons({ person, location, star });
  }
}
