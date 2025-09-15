import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { LayoutService } from 'src/app/services/app.layout.service';
import { UsuarioService } from 'src/app/services/login.service';
import { AlertaComponent } from 'src/app/util/alerta.component';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { EncryptionService } from 'src/app/services/helpers/crypt.service';

@Component({
	selector: 'login-page',
	templateUrl: './login.component.html',
	providers: [
		MessageService, // Agrega MessageService como un proveedor aquí
	  ],
})
export class LoginComponent {

	constructor(private usuarioservice : UsuarioService, private router: Router,private messageService: MessageService, 
    private _authGuardService: authGuardService, private _encryptService: EncryptionService){
      console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  mensajeAlerta!: AlertaComponent
  usuario_email: string = '';
  usuario_pw: string = '';
  errorMessage: string = '';

  submitted: boolean = false;
  loginError: boolean = false;
  ngOnInit(){
      sessionStorage.getItem('access') ? this.router.navigate(["/home"]) : this.router.navigate(["/"]) ;
  }
  iniciarSesion(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      let data = {
        Email: this.usuario_email, 
        password: this.usuario_pw
      }

      const encryptedData = this._encryptService.encryptObject(data);
      this.usuarioservice.iniciarSesion({userData: encryptedData})
        .subscribe(
          response => {
            if (response && response.valido == 1) {
              const decryptData = this._encryptService.decryptObject(response.resp)
              // La respuesta fue exitosa (estado 2xx)
              sessionStorage.setItem('token',JSON.stringify(decryptData));
              this._authGuardService.sendToken(decryptData.access_token)
              this._authGuardService.setPermissions(decryptData.permissions);
              this.router.navigate(["/home"]);
              // Mostrar mensaje de éxito con MatSnackBar
              // this.messageService.add({ severity: 'error', summary: 'No es posible ingresar', detail: 'Porfavor verifique todos los campos' });
              // Limpiar mensaje de error
              this.loginError = false;
              this.errorMessage = '';
            } else {
              // La respuesta no es válida (por ejemplo, credenciales incorrectas)
              this.loginError = true;
              this.errorMessage = 'Incorrect email or password.';
              // this.errorMessage = 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
            }
            // Reiniciar el formulario y otras variables necesarias
            form.resetForm();
            this.submitted = false;
          },
          error => {
            // Manejar errores, por ejemplo, mostrar un mensaje de error
            console.error(error);
            this.loginError = true;
            let mensaje = <any>error;
            this.messageService.add({ severity: 'error', summary: 'Login Error ', detail: error?.error.error });

            // this.mensajeAlerta.alerta("AVISO", "", mensaje.message, "");
          }
          
        );
      
    } else {
      this.messageService.add({ severity: 'error', summary: 'Login error', detail: 'Incorrect credentials' });
    }

  }
}
