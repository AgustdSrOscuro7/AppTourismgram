import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CelebrityCardComponent } from '../celebrity-card/celebrity-card.component';
import { ApiService } from '../../../services/api.service';
import { Celebrity } from '../../../interfaces/celebrity.interface';
import { IonGrid, IonRow, IonCol, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-celebrity-list',
  standalone: true,
  imports: [
    CommonModule,
    CelebrityCardComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner
  ],
  templateUrl: './celebrity-list.component.html',
  styleUrls: ['./celebrity-list.component.scss']
})
export class CelebrityListComponent {
  celebrities: Celebrity[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {
    this.loadCelebrities();
  }

  loadCelebrities(): void {
    this.apiService.getCelebrities().subscribe({
      next: (data) => {
        this.celebrities = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las celebridades';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
