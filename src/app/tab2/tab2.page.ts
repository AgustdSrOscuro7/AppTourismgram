import {Component, OnInit} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { VisitPlace } from "../interfaces/visits.interface";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit{

  visits: VisitPlace[] = [];
  tags: VisitPlace[] = [];
  loadingVisits: boolean = false;
  loadingTags: boolean = false;
  selectedCategory: 'visitPlaces' | 'tagFamous' = 'visitPlaces';

  //private loggedInUserId: string = '683e6ddc0b19c2d24999ee6c';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
  }


  /*loadUserVisits() {
    if (!this.loggedInUserId) {
      console.warn('No hay un usuario logueado para cargar visitas.');
      return;
    }
    this.loadingVisits = true;
    this.apiService.getVisitsByUser(this.loggedInUserId).subscribe({
      next: (resp) => {
        if (resp.Ok) {
          this.visits = resp.resp;
          console.log('Visitas cargadas:', this.visits);
        } else {
          console.error('Error al cargar visitas:', resp.resp);
        }
        this.loadingVisits = false;
      },
      error: (err) => {
        console.error('Error en la solicitud de visitas:', err);
        this.loadingVisits = false;
        // Manejo de errores: Mostrar un toast, mensaje, etc.
      }
    });
  }*/

  onSegmentChanged(event: any) {
    this.selectedCategory = event.detail.value;
  }

  logout() {
    this.authService.logout();
  }

}
