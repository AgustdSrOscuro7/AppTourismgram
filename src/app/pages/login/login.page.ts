import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular'; // Para mostrar alertas o un spinner de carga

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup; // Usamos ! para indicar que se inicializará en ngOnInit
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController, // Inyecta AlertController
    private loadingController: LoadingController // Inyecta LoadingController
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]] // Ajusta minLength según tu API
    });
  }

  async login() {
    this.errorMessage = null; // Limpiar mensaje de error previo

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, introduce un email válido y una contraseña de al menos 6 caracteres.';
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        loading.dismiss();
        this.isLoading = false;
        // La redirección se maneja dentro del AuthService para simplicidad en este caso
        // pero podrías manejarla aquí si lo prefieres.
        console.log('Login successful:', response);
        // Si no hay redirección en el servicio, iría aquí:
        // this.router.navigateByUrl('/tabs/tab1');
      },
      error: async (err) => {
        loading.dismiss();
        this.isLoading = false;
        console.error('Login error:', err);

        // Mensajes de error más amigables
        if (err.status === 401) { // Unauthorized, típicamente para credenciales inválidas
          this.errorMessage = 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
        } else if (err.status === 404) { // Not Found, si el endpoint no existe o el usuario no fue encontrado
          this.errorMessage = 'Usuario no encontrado o error en el servicio.';
        } else {
          this.errorMessage = 'Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo.';
        }

        const alert = await this.alertController.create({
          header: 'Error de autenticación',
          message: this.errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}
