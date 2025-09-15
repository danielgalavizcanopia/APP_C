import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OpexAccount } from 'src/app/interfaces/CapexOpex/OpexAccount.interface';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { CapexOpexAccountsService } from 'src/app/services/Tools/CapexOpexAccounts.service';

@Component({
  selector: 'app-opex-accounts',
  templateUrl: './opex-accounts.component.html',
  styleUrls: ['./opex-accounts.component.scss']
})
export class OpexAccountsComponent {
  visible!: boolean;
  token: any;
  opexAccountSelected!: OpexAccount | null;
  opexAccounts: OpexAccount[] = [];


  opexForm!: FormGroup;
  showDialog() {
      this.visible = true;
  }

  hideDialog(){
    this.opexAccountSelected = null;
    this.opexForm.reset();
    this.visible = false;
  }

  constructor(private productService: ProductService, private capexAccountService: CapexOpexAccountsService, public _authGuardService: authGuardService, 
    private _fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService,) {
      this.token = this._authGuardService.getToken();
      this.initFormulario();
      this.getOpexAccounts();
    }

  initFormulario(){
    this.opexForm = this._fb.group({
        idopexaccounts: ['',[]],
        cuentacompaq: ['',[Validators.required]],
        concepto: ['',[Validators.required]],
        status: ['',[]],
    });
  }

  getOpexAccounts(){
    this.capexAccountService.getOpexAccounts(this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1) {
            this.opexAccounts = resp.result;
        }
    });
  }

  onRowSelected(opexAccount: OpexAccount){
    this.opexAccountSelected = opexAccount
    this.opexForm.patchValue({
        cuentacompaq: this.opexAccountSelected?.cuentacompaq,
        concepto: this.opexAccountSelected?.concepto,
    });
    this.visible = true;
  }

  saveOpexAccount(){
    if(!this.opexForm.valid){
        return this.messageService.add({ severity: 'error', summary: 'All fields required', detail: "All fields required, please try again"});
    }

    let data = {
        idopexaccounts: this.opexAccountSelected?.idopexaccounts ? this.opexAccountSelected?.idopexaccounts : 0,
        cuentacompaq: this.opexForm.value.cuentacompaq,
        concepto: this.opexForm.value.concepto,
        status: 1,
    }

    this.capexAccountService.setOpexAccounts(data, this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1){
            this.opexAccounts = resp.result
            this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
            this.hideDialog();
        } else {
            this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please try again"});
        }
    })
  }

  confirm(event: any) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteOpexAccount()
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            this.hideDialog();
        }
    });
}

deleteOpexAccount(){
    let data = {
        idopexaccounts: this.opexAccountSelected?.idopexaccounts,
        cuentacompaq: this.opexForm.value.cuentacompaq,
        concepto: this.opexForm.value.concepto,
        status: 0,
    }

    this.capexAccountService.setOpexAccounts(data, this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1){
            this.opexAccounts = resp.result
            this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
            this.hideDialog();
        } else {
            this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please try again"});
        }
    })
}

}
