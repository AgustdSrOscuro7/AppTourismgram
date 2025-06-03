import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../../interfaces/data.interface';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-city-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-card.component.html',
  styleUrls: ['./city-card.component.css']
})
export class CityCardComponent implements OnInit {
  @Input() city!: City;
  countryName: string = '';

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    if (!this.city?.country_id) {
      this.countryName = 'Desconocido';
      return;
    }

    this.apiService.getCountries().subscribe({
      next: (countries) => {
        if (!countries) {
          this.countryName = 'Desconocido';
          return;
        }

        const country = countries.find(c => c._id?.equals(this.city.country_id));
        this.countryName = country?.name || 'Desconocido';
      },
      error: () => {
        this.countryName = 'Desconocido';
      }
    });
  }

}
