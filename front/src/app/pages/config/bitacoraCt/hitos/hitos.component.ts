import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BitacoraAdminCtService } from 'src/app/services/Bitacora/bitacora-adminct.service';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { regex } from 'src/app/util/regex';

@Component({
  selector: 'app-hitos',
  templateUrl: './hitos.component.html',
  styleUrls: ['./hitos.component.scss']
})
export class HitosComponent {
  visible!: boolean;
  hitosForm!: FormGroup;
  token: any;
  hitos: any[] = [];
  hitoSelected: any;
  showDialog() {
      this.visible = true;
  }

  hideDialog(){
    this.hitoSelected = null;
    this.visible = false;
    this.hitosForm.reset();
  }
  constructor(private productService: ProductService, 
              private _fb: FormBuilder, 
              private _BitacoraAdminCtService: BitacoraAdminCtService, 
              private messageService: MessageService, 
              private confirmationService: ConfirmationService,
              public _authGuardService: authGuardService        
    ) {
        this.token = this._authGuardService.getToken();
        this.initFormulario();
        this.getHitoProcess();
    }

    initFormulario(){
        this.hitosForm = this._fb.group({
            IdhitoProceso: [''],
            ShortDescription: ['', [Validators.required, Validators.pattern(regex.OnlyText)]],
            LargeDescription: ['', [Validators.required, Validators.pattern(regex.OnlyText)]],
            status: [''],
        });
    }

    getHitoProcess(){
        this._BitacoraAdminCtService.getHitosProcess(this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.hitos = resp.result;
            }
        });
    }

    onRowSelected(hito: any){
        this.hitoSelected = hito;
        this.hitosForm.patchValue({
            IdhitoProceso: this.hitoSelected.IdhitoProceso,
            ShortDescription: this.hitoSelected.ShortDescription,
            LargeDescription: this.hitoSelected.LargeDescription,
        });
        this.visible = true;
    }

    saveHito(){
        if(!this.hitosForm.valid){
            return this.messageService.add({ severity: 'error', summary: 'All fields required', detail: "All fields required, please try again"});
        }

        let data = {
            IdhitoProceso: this.hitoSelected?.IdhitoProceso ? this.hitoSelected?.IdhitoProceso : 0,
            ShortDescription: this.hitosForm.value.ShortDescription,
            LargeDescription: this.hitosForm.value.LargeDescription,
            status: 1,
        }

        this._BitacoraAdminCtService.setHitosProcess(data, this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
                this.hitos = resp.result;
                this.hideDialog();
            } else {
                this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
            }
        });
    }

    confirm(event: any) {
        this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteHito()
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                this.hideDialog();
            }
        });
    }

    deleteHito(){
        let data = {
            IdhitoProceso: this.hitoSelected?.IdhitoProceso,
            ShortDescription: this.hitoSelected?.ShortDescription,
            LargeDescription: this.hitoSelected?.LargeDescription,
            status: 0,
        }

        this._BitacoraAdminCtService.setHitosProcess(data, this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
                this.hitos = resp.result;
                this.hideDialog();
            } else {
                this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
            }
        });
    }

}
