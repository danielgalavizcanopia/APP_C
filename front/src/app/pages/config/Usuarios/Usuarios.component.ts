import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Positions, Users } from 'src/app/interfaces/Users/User.interface';
import { EncryptionService } from 'src/app/services/helpers/crypt.service';
import { UsuarioService } from 'src/app/services/login.service';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { regex } from 'src/app/util/regex';

@Component({
    selector: 'app-usuarios',
    templateUrl: './Usuarios.component.html',
    styleUrls: ['./Usuarios.component.css'],
})

export class UsuariosComponent {
    token: any;
    cities!: any[];
    visible: boolean = false;
    formValidate!: boolean;
    Users: Users[] = [];
    Positions!: Positions[];
    loading: boolean = true;

    usuarioForm!: FormGroup;
    usuarioSelected!: Users;
    showVisible(){
      this.visible = true;
    }
    hideVisible(){
      this.usuarioForm.reset();
      this.formValidate = false;
      this.visible = false;
    }

    constructor( private _fb: FormBuilder,private productService: ProductService, private usuarioservice : UsuarioService,
         public _authGuardService: authGuardService,private messageService: MessageService, private _encryptService: EncryptionService,
         private confirmationService: ConfirmationService) {
        this.token = this._authGuardService.getToken();
        this.getCtPositions()
        this.getUsers();
        this.initFormulario();
    }

    initFormulario(){
        this.usuarioForm = this._fb.group({
            userName: ['',[Validators.required, Validators.pattern(regex.firstNameAndLastnamePattern)]],
            Email: ['',[Validators.required]], // RESOLVER PATTERN
            Password: [''],
            ConfirmPassword: [''],
            idPosition: ['',[Validators.required]],
        });
    }

    getUsers(){
        this.usuarioservice.getUsers(this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.loading = false;
              this.Users = resp.result;
            }
        });
    }

    getCtPositions(){
        this.usuarioservice.getCtPositions(this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
              this.Positions = resp.result;
            }
        });
    }

    onRowSelected(user: Users){
        this.usuarioSelected = user;

        this.usuarioForm.patchValue({
            userName: this.usuarioSelected.Name,
            Email: this.usuarioSelected.Email,
            idPosition: this.usuarioSelected.id_positions,
        });

        this.visible = true;
    }

    save(){
        if(!this.usuarioForm.valid){
            this.formValidate = true;
            return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please write all required fields' });
        }

        if(this.usuarioForm.value.ConfirmPassword && this.usuarioForm.value.Password != this.usuarioForm.value.ConfirmPassword) {
            return this.messageService.add({ severity: 'error', summary: 'Error', detail: "The password don't match" });
        }

        this.formValidate = false;
        let data = {
            userId: this.usuarioSelected ? this.usuarioSelected.IDUser : 0, 
            userName: this.usuarioForm.value.userName,
            Email:  this.usuarioForm.value.Email,
            Password: this.usuarioForm.value.ConfirmPassword ? this.usuarioForm.value.ConfirmPassword : this.usuarioSelected.Password,
            idPosition: this.usuarioForm.value.idPosition,
        }

        const encryptedData = this._encryptService.encryptObject(data);
        this.usuarioservice.setUsers({userData: encryptedData}, this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.messageService.add({ severity: 'success', summary: 'Success!', detail: 'User save succesfully'});
                this.getUsers();
                this.hideVisible();
            }
        })
    }

    confirm(event: any, userSelected: Users, instruction: number) {
        this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.disableUser(userSelected, instruction)
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }
    
    disableUser(userSelected: Users, instruction: number){
        let data = {
            userId: userSelected.IDUser,
            userName: userSelected.Name,
            Email: userSelected.Email,
            Password: userSelected.Password,
            idPosition: userSelected.id_positions,
        }

        const encryptedData = this._encryptService.encryptObject(data);
        this.usuarioservice.setUsers({userData: encryptedData}, this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.messageService.add({ severity: 'success', summary: 'Success!', detail: 'User save succesfully'});
                this.getUsers();
                this.hideVisible();
            }
        })
    }
}
