import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BitacoraAdminCtService } from 'src/app/services/Bitacora/bitacora-adminct.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-relation-ship-bt-ct',
  templateUrl: './relation-ship-bt-ct.component.html',
  styleUrls: ['./relation-ship-bt-ct.component.scss']
})
export class RelationShipBtCtComponent {
  token: any;
  hitos: any[] = [];
  hitoSelected: any;
  categorias: any[] = [];
  categoriaSelected: any;
  evidencias: any[] = [];
  evidenciaSelected: any;
  
  constructor(
              private _fb: FormBuilder, 
              private _BitacoraAdminCtService: BitacoraAdminCtService, 
              private messageService: MessageService, 
              private confirmationService: ConfirmationService,
              public _authGuardService: authGuardService 
  ) {
    this.token = this._authGuardService.getToken();
    this.getHitoProcess()
    this.getCategories()
    this.getEvidences()
  }

  getHitoProcess(){
    this._BitacoraAdminCtService.getHitosProcess(this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1){
            this.hitos = resp.result;
        }
    });
  }

  getCategories(){
    this._BitacoraAdminCtService.getCategories(this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1){
            this.categorias = resp.result;
        }
    });
  }

  getEvidences(){
    this._BitacoraAdminCtService.getEvidences(this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1){
            this.evidencias = resp.result;
        }
    });
  }

  saveRelation(){
    if(!this.hitoSelected && !this.categoriaSelected || !this.categoriaSelected && !this.evidenciaSelected){
      return this.messageService.add({ severity: 'error', summary: 'All fields required', detail: "All fields required, please try again"});
    }

    let statusIn

    if(this.hitoSelected && this.categoriaSelected && !this.evidenciaSelected) statusIn = 1
    if(this.categoriaSelected && this.evidenciaSelected && !this.hitoSelected) statusIn = 2

    let data = {
      status: statusIn,
      IdhitoProceso: this.hitoSelected?.IdhitoProceso,
      IdCategoriaEvidencia: this.categoriaSelected?.Id_CategoriaEvidencia,
      IDTipoEvidencia: this.evidenciaSelected?.IDTipoEvidencia,
    }

    this._BitacoraAdminCtService.setCatRelationship(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
        this.hitoSelected = null;
        this.categoriaSelected = null;
        this.evidenciaSelected = null;
      }
    });
    
  }


}
