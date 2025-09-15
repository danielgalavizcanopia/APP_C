import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CapexAccount } from 'src/app/interfaces/CapexOpex/CapexAccount.interface';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { CapexOpexAccountsService } from 'src/app/services/Tools/CapexOpexAccounts.service';

@Component({
  selector: 'app-capex-accounts',
  templateUrl: './capex-accounts.component.html',
  styleUrls: ['./capex-accounts.component.scss']
})
export class CapexAccountsComponent {
    visible!: boolean;
    token: any;
    capexAccountSelected!: CapexAccount | null;
    capexAccounts: CapexAccount[] = [];

    capexForm!: FormGroup;
    showDialog() {
        this.visible = true;
    }

    hideDialog(){
      this.capexForm.reset();
      this.capexAccountSelected = null;
      this.visible = false;
    }

    constructor(private productService: ProductService, private capexAccountService: CapexOpexAccountsService, public _authGuardService: authGuardService, 
                private _fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService,) {
        this.token = this._authGuardService.getToken();
        this.initFormulario()
        this.getCapexAccounts()
    }

    initFormulario(){
        this.capexForm = this._fb.group({
            idcapexaccounts: ['',[]],
            cuentacompaq: ['',[Validators.required]],
            concepto: ['',[Validators.required]],
            status: ['',[]],
        });
    }

    getCapexAccounts(){
        this.capexAccountService.getCapexAccounts(this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1) {
                this.capexAccounts = resp.result
            }
        });
    }

    onRowSelected(capexAccount: CapexAccount){
        this.capexAccountSelected = capexAccount
        this.capexForm.patchValue({
            cuentacompaq: this.capexAccountSelected?.cuentacompaq,
            concepto: this.capexAccountSelected?.concepto,
        });
        this.visible = true;
    }

    saveCapexAccount(){
        if(!this.capexForm.valid){
            return this.messageService.add({ severity: 'error', summary: 'All fields required', detail: "All fields required, please try again"});
        }

        let data = {
            idcapexaccounts: this.capexAccountSelected?.idcapexaccounts ? this.capexAccountSelected?.idcapexaccounts : 0,
            cuentacompaq: this.capexForm.value.cuentacompaq,
            concepto: this.capexForm.value.concepto,
            status: 1,
        }

        this.capexAccountService.setCapexAccounts(data, this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.capexAccounts = resp.result
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
                this.deleteCapexAccount()
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                this.hideDialog();
            }
        });
    }

    deleteCapexAccount(){
        let data = {
            idcapexaccounts: this.capexAccountSelected?.idcapexaccounts,
            cuentacompaq: this.capexForm.value.cuentacompaq,
            concepto: this.capexForm.value.concepto,
            status: 0,
        }

        this.capexAccountService.setCapexAccounts(data, this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.capexAccounts = resp.result
                this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
                this.hideDialog();
            } else {
                this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please try again"});
            }
        })
    }

}
