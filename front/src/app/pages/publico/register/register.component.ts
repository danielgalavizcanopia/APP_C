import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EncryptionService } from 'src/app/services/helpers/crypt.service';
import { UsuarioService } from 'src/app/services/login.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
	templateUrl: './register.component.html'
})
export class RegisterComponent {

	confirmed: boolean = false;
	usuario_nombre: string = '';
	usuario_email: string = '';
	usuario_pw: string = '';
	usuario_confirm_pw: string = '';

	constructor(private usuarioservice : UsuarioService, private router: Router,private messageService: MessageService, 
		private _authGuardService: authGuardService, private _encryptService: EncryptionService) {
		
	}

	register(){
		if(!this.usuario_nombre){
			return this.messageService.add({ severity: 'error', summary: 'Login Error ', detail: 'Please write your First Name' });
		}

		if(!this.usuario_email){
			return this.messageService.add({ severity: 'error', summary: 'Login Error ', detail: 'Please write your email' });
		}

		if(!this.usuario_pw){
			return this.messageService.add({ severity: 'error', summary: 'Login Error ', detail: 'Please write your password' });
		}

		if(this.usuario_pw === this.usuario_confirm_pw){
			let data = {
				Name: this.usuario_nombre,
				Email: this.usuario_email,
				password: this.usuario_pw,
			} 

			const encryptedData = this._encryptService.encryptObject(data);
			this.usuarioservice.registrarUsuario({userData: encryptedData}).subscribe((resp: any) => {
				if(resp.message == "User created successfully!"){
					 this.messageService.add({ severity: 'success', summary: 'Complete ', detail: 'Now, you sign In Canopia System' });
					this.router.navigate([""]);
				}
			})
		} else {
			return this.messageService.add({ severity: 'error', summary: 'Login Error ', detail: 'The password not match' });
		}

	}

}
