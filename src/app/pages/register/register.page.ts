import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', [Validators.required]] // Valor por defecto
    }, {
      validator: this.passwordMatchValidator // Custom validator para que las contraseñas coincidan
    });
  }

  // Custom validator para asegurar que las contraseñas coincidan
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async register() {
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      if (this.registerForm.errors?.['passwordMismatch']) {
        this.errorMessage = 'Las contraseñas no coinciden.';
      } else {
        this.errorMessage = 'Por favor, completa todos los campos correctamente. La contraseña debe tener al menos 6 caracteres.';
      }
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Creando cuenta...',
      spinner: 'crescent'
    });
    await loading.present();

    const { name, email, password, role } = this.registerForm.value;

    const apiUserData = {
      name: name, // Asegúrate de obtener el nombre del formulario si lo tienes
      mail: email, // Mapea 'email' del formulario a 'mail' de la API
      password: password,
      rol: role.toUpperCase() // Mapea 'role' a 'rol' y asegúrate de que esté en mayúsculas como 'USER_ROLE' o 'ADMIN_ROLE'
    };

    this.authService.register(apiUserData).subscribe({
      next: async (response) => {
        loading.dismiss();
        this.isLoading = false;
        console.log('Register successful:', response);

        const alert = await this.alertController.create({
          header: 'Registro Exitoso',
          message: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.router.navigateByUrl('/login'); // Redirige al login después del registro
              }
            }
          ]
        });
        await alert.present();
      },
      error: async (err) => {
        loading.dismiss();
        this.isLoading = false;
        console.error('Register error:', err);

        if (err.status === 409) { // Conflict, típicamente para usuario ya existe
          this.errorMessage = 'Este correo electrónico ya está registrado. Por favor, usa otro o inicia sesión.';
        } else {
          this.errorMessage = 'Ocurrió un error al registrar la cuenta. Inténtalo de nuevo.';
        }

        const alert = await this.alertController.create({
          header: 'Error de Registro',
          message: this.errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}
