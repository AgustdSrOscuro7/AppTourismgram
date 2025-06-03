import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService, User } from '../services/auth.service';
import { Observable, Subscription } from 'rxjs'; // Importa Observable y Subscription
import { filter } from 'rxjs/operators';
import {Router} from "@angular/router"; // Importa filter
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss'],
  standalone: false,
})

export class Tab5Page implements OnInit, OnDestroy {
  currentUserData: User | null = null;
  private userSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios en la información del usuario
    this.userSubscription = this.authService.currentUser.pipe(
      filter(user => user !== undefined)
    ).subscribe(user => {
      this.currentUserData = user;
      console.log('Datos del usuario en Tab5:', this.currentUserData);
    });
  }

  goToAdminPage() {
    if (this.currentUserData?.rol === 'ADMIN_ROLE') { // Asumiendo que 'ADMIN_ROLE' es el rol del administrador
      this.router.navigateByUrl('/admin-add-site'); // Define esta ruta más adelante para la página de añadir sitios
    } else {
      this.presentAccessDeniedAlert();
    }
  }

  async presentAccessDeniedAlert() {
    const alert = await this.alertController.create({
      header: 'Acceso Denegado',
      message: 'No tienes permisos de administrador para acceder a esta función',
      buttons: ['Entendido']
    });

    await alert.present();
  }
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
  }
}
