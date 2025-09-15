import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OpexSubAccount } from 'src/app/interfaces/CapexOpex/OpexSubAccount.interface';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { CapexOpexAccountsService } from 'src/app/services/Tools/CapexOpexAccounts.service';

@Component({
  selector: 'app-opex-subaccounts',
  templateUrl: './opex-subaccounts.component.html',
  styleUrls: ['./opex-subaccounts.component.scss']
})
export class OpexSubaccountsComponent {
  visible!: boolean;
  token: any;
  opexSubAccountSelected!: OpexSubAccount | null;
  opexSubAccounts: OpexSubAccount[] = [];
  opexAccounts: OpexSubAccount[] = [];
  opexSubForm!: FormGroup;

  showDialog() {
      this.visible = true;
  }

  hideDialog(){
    this.opexSubAccountSelected = null;
    this.opexSubForm.reset();
    this.visible = false;
  }
  constructor(private productService: ProductService, private capexAccountService: CapexOpexAccountsService, public _authGuardService: authGuardService, 
    private _fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService) {
      this.token = this._authGuardService.getToken();
      this.initFormulario();
      this.getSubOpexAccounts();
      this.getOpexAccounts();
    }

    initFormulario(){
      this.opexSubForm = this._fb.group({
          idopexsubaccount: ['',[]],
          cuentacompaq: ['',[Validators.required]],
          concepto: ['',[Validators.required]],
          idopexaccounts: ['',[Validators.required]],
          status: ['',[]],
      });
    }

    getSubOpexAccounts(){
      this.capexAccountService.getOpexSubaccounts(this.token?.access_token).subscribe((resp: any) => {
          if(resp.valido == 1) {
              this.opexSubAccounts = resp.result
          }
      });
    }

    getOpexAccounts(){
      this.capexAccountService.getOpexAccounts(this.token?.access_token).subscribe((resp: any) => {
          if(resp.valido == 1) {
              this.opexAccounts = resp.result
          }
      });
  }

    onRowSelected(opexSubAccount: OpexSubAccount){
      this.opexSubAccountSelected = opexSubAccount
      this.opexSubForm.patchValue({
          idopexsubaccount: this.opexSubAccountSelected?.idopexsubaccount,
          cuentacompaq: this.opexSubAccountSelected?.cuentacompaq,
          concepto: this.opexSubAccountSelected?.concepto,
          idopexaccounts: this.opexSubAccountSelected?.idopexaccounts,
      });
      this.visible = true;
    }

    saveCapexAccount(){
      if(!this.opexSubForm.valid){
          return this.messageService.add({ severity: 'error', summary: 'All fields required', detail: "All fields required, please try again"});
      }

      let data = {
          idopexsubaccount: this.opexSubAccountSelected?.idopexsubaccount ? this.opexSubAccountSelected?.idopexsubaccount : 0,
          cuentacompaq: this.opexSubForm.value.cuentacompaq,
          concepto: this.opexSubForm.value.concepto,
          idopexaccounts: this.opexSubForm.value.idopexaccounts,
          status: 1,
      }

      this.capexAccountService.setOpexSubaccounts(data, this.token?.access_token).subscribe((resp: any) => {
          if(resp.valido == 1){
            this.getSubOpexAccounts()
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
              this.deleteCapexSubAccount()
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
              this.hideDialog();
          }
      });
    }

    deleteCapexSubAccount(){
      let data = {
        idopexsubaccount: this.opexSubAccountSelected?.idopexsubaccount,
        cuentacompaq: this.opexSubForm.value.cuentacompaq,
        concepto: this.opexSubForm.value.concepto,
        idopexaccounts: this.opexSubForm.value.idopexaccounts,
        status: 0,
      }

      this.capexAccountService.setOpexSubaccounts(data, this.token?.access_token).subscribe((resp: any) => {
          if(resp.valido == 1){
              this.getSubOpexAccounts();
              this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
              this.hideDialog();
          } else {
              this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please try again"});
          }
      })
    }
}
