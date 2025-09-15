import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Sop } from 'src/app/interfaces/SOP/SOP.interface';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { SOPCatalogService } from 'src/app/services/Tools/SOPCatalogs.service';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-sop',
  templateUrl: './sop.component.html',
  styleUrls: ['./sop.component.scss']
})
export class SOPComponent {

  products!: any[];

  token: any;
  sops!: Sop[];
  sopForm!: FormGroup;
  sopSelected!: Sop;
  formValidate!: boolean;

  cities!: City[];
  selectedProducts!: any[];

  visible: boolean = false;

  showVisible(){
    this.visible = true;
  }

  hideVisible(){
    this.formValidate = false;
    this.sopForm.reset();
    this.visible = false;
  }

  onUpload(event: Event) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  } 
  constructor(private sopService: SOPCatalogService, private _fb: FormBuilder, private messageService: MessageService,
      private confirmationService: ConfirmationService, public _authGuardService: authGuardService) {
    this.token = this._authGuardService.getToken();

    this.initFormulario();
    this.getSop();
  }

  initFormulario(){
    this.sopForm = this._fb.group({
      p_ShortDescriptionSOP: ['',[Validators.required]],
      p_LargeDescriptionSOP: ['',[Validators.required]],
      p_StatusSOP: ['']
    });

    this.sopForm.reset();
  }

  getSop(){
    this.sopService.getSOP(this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.sops = resp.result;
      }
    })
  }

  onRowSelected(sopSelected: Sop){
    this.sopSelected = sopSelected;

    this.sopForm.patchValue({
      p_ShortDescriptionSOP: this.sopSelected.ShortDescriptionSOP,
      p_LargeDescriptionSOP: this.sopSelected.LargeDescriptionSOP,
      p_StatusSOP: this.sopSelected.StatusSOP,
    });

    this.visible = true;
  }

  save(){
    if(!this.sopForm.valid){
      this.formValidate = true;
      return this.messageService.add({ severity: 'error', summary: 'Fields Required', detail: 'All fields is required'});
    }

    let data = {
      p_Idsop: this.sopSelected ? this.sopSelected.Idsop : 0,
      p_ShortDescriptionSOP: this.sopForm.value.p_ShortDescriptionSOP,
      p_LargeDescriptionSOP: this.sopForm.value.p_LargeDescriptionSOP,
      p_StatusSOP: 1,
    }

    this.sopService.setSOP(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.getSop();
        this.hideVisible();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SOP save successfully!'});
      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    });
  }

  confirm(event: any, sopSelected: Sop, instruction: number) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.disableSop(sopSelected, instruction)
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
  }
  
  disableSop(sopSelected: Sop, instruction: number){
    let data = {
      p_Idsop: sopSelected.Idsop,
      p_ShortDescriptionSOP: sopSelected.ShortDescriptionSOP,
      p_LargeDescriptionSOP: sopSelected.LargeDescriptionSOP,
      p_StatusSOP: instruction,
    }

    this.sopService.setSOP(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.getSop();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SOP disabled successfully!'});
      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    });
  }
}
