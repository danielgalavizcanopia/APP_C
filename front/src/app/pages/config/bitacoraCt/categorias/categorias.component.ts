import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BitacoraAdminCtService } from 'src/app/services/Bitacora/bitacora-adminct.service';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { regex } from 'src/app/util/regex';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent {
  visible!: boolean;
  categoriaForm!: FormGroup;
  token: any;
  categorias: any[] = [];
  categoriaSelected: any;
  showDialog() {
      this.visible = true;
  }

  hideDialog(){
    this.categoriaSelected = null;
    this.visible = false;
    this.categoriaForm.reset();
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
        this.getCategories();
    }

    initFormulario(){
        this.categoriaForm = this._fb.group({
            Id_CategoriaEvidencia: [''],
            ShortDescription: ['', [Validators.required, Validators.pattern(regex.OnlyText)]],
            LargeDescription: ['', [Validators.required, Validators.pattern(regex.OnlyText)]],
            status: [''],
        });
    }

    getCategories(){
        this._BitacoraAdminCtService.getCategories(this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.categorias = resp.result;
            }
        });
    }

    onRowSelected(hito: any){
        this.categoriaSelected = hito;
        this.categoriaForm.patchValue({
            Id_CategoriaEvidencia: this.categoriaSelected.Id_CategoriaEvidencia,
            ShortDescription: this.categoriaSelected.ShortDescription,
            LargeDescription: this.categoriaSelected.LargeDescription,
        });
        this.visible = true;
    }

    saveCategoria(){
        if(!this.categoriaForm.valid){
            return this.messageService.add({ severity: 'error', summary: 'All fields required', detail: "All fields required, please try again"});
        }

        let data = {
            Id_CategoriaEvidencia: this.categoriaSelected?.Id_CategoriaEvidencia ? this.categoriaSelected?.Id_CategoriaEvidencia : 0,
            ShortDescription: this.categoriaForm.value.ShortDescription,
            LargeDescription: this.categoriaForm.value.LargeDescription,
            status: 1,
        }

        this._BitacoraAdminCtService.setCategories(data, this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
                this.categorias = resp.result;
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
                this.deleteCategoria()
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                this.hideDialog();
            }
        });
    }

    deleteCategoria(){
        let data = {
            Id_CategoriaEvidencia: this.categoriaSelected?.Id_CategoriaEvidencia,
            ShortDescription: this.categoriaSelected?.ShortDescription,
            LargeDescription: this.categoriaSelected?.LargeDescription,
            status: 0,
        }

        this._BitacoraAdminCtService.setCategories(data, this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
                this.categorias = resp.result;
                this.hideDialog();
            } else {
                this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
            }
        });
    }
}
