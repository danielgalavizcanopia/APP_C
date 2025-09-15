import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CapexAccount } from 'src/app/interfaces/CapexOpex/CapexAccount.interface';
import { CapexSubaccount } from 'src/app/interfaces/CapexOpex/CapexSubAccount.interface';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { CapexOpexAccountsService } from 'src/app/services/Tools/CapexOpexAccounts.service';

@Component({
  selector: 'app-capex-subaccounts',
  templateUrl: './capex-subaccounts.component.html',
  styleUrls: ['./capex-subaccounts.component.scss']
})
export class CapexSubaccountsComponent {
  visible!: boolean;
  token: any;
  capexSubAccountSelected!: CapexSubaccount | null;
  capexSubAccounts: CapexSubaccount[] = [];
  capexAccounts: CapexAccount[] = [];
  capexSubForm!: FormGroup;

  showDialog() {
      this.visible = true;
  }

  hideDialog(){
    this.capexSubAccountSelected = null;
    this.capexSubForm.reset();
    this.visible = false;
  }
  constructor(private productService: ProductService, private capexAccountService: CapexOpexAccountsService, public _authGuardService: authGuardService, 
    private _fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService) {
      this.token = this._authGuardService.getToken();
      this.initFormulario();
      this.getSubCapexAccounts();
      this.getCapexAccounts();
    }

    initFormulario(){
      this.capexSubForm = this._fb.group({
          idcapexsubaccount: ['',[]],
          cuentacompaq: ['',[Validators.required]],
          concepto: ['',[Validators.required]],
          idcapexaccounts: ['',[Validators.required]],
          status: ['',[]],
      });
    }

    getSubCapexAccounts(){
      this.capexAccountService.getCapexSubaccounts(this.token?.access_token).subscribe((resp: any) => {
          if(resp.valido == 1) {
              this.capexSubAccounts = resp.result
          }
      });
    }

    getCapexAccounts(){
      this.capexAccountService.getCapexAccounts(this.token?.access_token).subscribe((resp: any) => {
          if(resp.valido == 1) {
              this.capexAccounts = resp.result
          }
      });
  }

    onRowSelected(capexSubAccount: CapexSubaccount){
      this.capexSubAccountSelected = capexSubAccount
      this.capexSubForm.patchValue({
          idcapexsubaccount: this.capexSubAccountSelected?.idcapexsubaccount,
          cuentacompaq: this.capexSubAccountSelected?.cuentacompaq,
          concepto: this.capexSubAccountSelected?.concepto,
          idcapexaccounts: this.capexAccounts.find(x=>x.idcapexaccounts == this.capexSubAccountSelected?.idcapexaccounts)?.idcapexaccounts,
      });
      this.visible = true;
    }

    saveCapexAccount(){
      if(!this.capexSubForm.valid){
          return this.messageService.add({ severity: 'error', summary: 'All fields required', detail: "All fields required, please try again"});
      }

      let data = {
          idcapexsubaccount: this.capexSubAccountSelected?.idcapexsubaccount ? this.capexSubAccountSelected?.idcapexsubaccount : 0,
          cuentacompaq: this.capexSubForm.value.cuentacompaq,
          concepto: this.capexSubForm.value.concepto,
          idcapexaccounts: this.capexSubForm.value.idcapexaccounts,
          status: 1,
      }

      this.capexAccountService.setCapexSubaccounts(data, this.token?.access_token).subscribe((resp: any) => {
          if(resp.valido == 1){
            this.getSubCapexAccounts()
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
        idcapexsubaccount: this.capexSubAccountSelected?.idcapexsubaccount,
        cuentacompaq: this.capexSubForm.value.cuentacompaq,
        concepto: this.capexSubForm.value.concepto,
        idcapexaccounts: this.capexSubForm.value.idcapexaccounts,
        status: 0,
      }

      this.capexAccountService.setCapexSubaccounts(data, this.token?.access_token).subscribe((resp: any) => {
          if(resp.valido == 1){
              this.getSubCapexAccounts();
              this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
              this.hideDialog();
          } else {
              this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please try again"});
          }
      })
    }
}
