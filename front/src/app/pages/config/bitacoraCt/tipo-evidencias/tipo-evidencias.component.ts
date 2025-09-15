import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BitacoraAdminCtService } from 'src/app/services/Bitacora/bitacora-adminct.service';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { regex } from 'src/app/util/regex';

@Component({
  selector: 'app-tipo-evidencias',
  templateUrl: './tipo-evidencias.component.html',
  styleUrls: ['./tipo-evidencias.component.scss']
})
export class TipoEvidenciasComponent {
  visible!: boolean;
  tipoEvidenciaForm!: FormGroup;
  token: any;
  evidencias: any[] = [];
  evidenciaSelected: any;
  showDialog() {
      this.visible = true;
  }

  hideDialog(){
    this.evidenciaSelected = null;
    this.visible = false;
    this.tipoEvidenciaForm.reset();
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
        this.getEvidences();
    }

    initFormulario(){
        this.tipoEvidenciaForm = this._fb.group({
            IDTipoEvidencia: [''],
            ShortDescription: ['', [Validators.required, Validators.pattern(regex.OnlyText)]],
            LargeDescription: ['', [Validators.required, Validators.pattern(regex.OnlyText)]],
            status: [''],
        });
    }

    getEvidences(){
        this._BitacoraAdminCtService.getEvidences(this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.evidencias = resp.result;
            }
        });
    }

    onRowSelected(tipoevidencia: any){
        this.evidenciaSelected = tipoevidencia;
        this.tipoEvidenciaForm.patchValue({
            IDTipoEvidencia: this.evidenciaSelected.IDTipoEvidencia,
            ShortDescription: this.evidenciaSelected.ShortDescription,
            LargeDescription: this.evidenciaSelected.LargeDescription,
        });
        this.visible = true;
    }

    saveevidencia(){
        if(!this.tipoEvidenciaForm.valid){
            return this.messageService.add({ severity: 'error', summary: 'All fields required', detail: "All fields required, please try again"});
        }

        let data = {
            IDTipoEvidencia: this.evidenciaSelected?.IDTipoEvidencia ? this.evidenciaSelected?.IDTipoEvidencia : 0,
            ShortDescription: this.tipoEvidenciaForm.value.ShortDescription,
            LargeDescription: this.tipoEvidenciaForm.value.LargeDescription,
            status: 1,
        }

        this._BitacoraAdminCtService.setEvidences(data, this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
                this.evidencias = resp.result;
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
                this.deleteEvidencia()
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                this.hideDialog();
            }
        });
    }

    deleteEvidencia(){
        let data = {
            IDTipoEvidencia: this.evidenciaSelected?.IDTipoEvidencia,
            ShortDescription: this.evidenciaSelected?.ShortDescription,
            LargeDescription: this.evidenciaSelected?.LargeDescription,
            status: 0,
        }

        this._BitacoraAdminCtService.setEvidences(data, this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
                this.evidencias = resp.result;
                this.hideDialog();
            } else {
                this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
            }
        });
    }
}
