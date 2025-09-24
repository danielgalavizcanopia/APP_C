import { Component } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { PercentageMktOrigination, RPCount, Settlement, SettlementDeductions, SettlementDetails, TotalApprovedByAssembly } from 'src/app/interfaces/settlement/settlement.interface';
import { ImplementationCatalogsService } from 'src/app/services/Implementacion/Implementacion-catalogs.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ProductService } from 'src/app/services/product.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { SettlementCatalogsService } from 'src/app/services/settlement/settlement-catalogs.service';
import { SettlementService } from 'src/app/services/settlement/settlement.service';
import { CapexOpexAccountsService } from 'src/app/services/Tools/CapexOpexAccounts.service';

@Component({
  selector: 'app-cdr',
  templateUrl: './cdr.component.html',
  styleUrls: ['./cdr.component.scss']
})
export class CdrComponent {

  decimalType!: string;

  cities!: any[];
  visible!: boolean;
  products: any[] = [];
  showDialog() {
    this.visible = true;
  }

  onHide(){
    this.settlementForm.reset();
    this.details.clear();
    this.deductions.clear();
    this.visible = false;
    this.settlementSelected = undefined!;
    this.settlementApproved = false;
    this.statusSelected = '';
    this.settlementForm.get('idrpnumber_main')?.enable();
    this.decimalType = '';

  }

  token: any;
  position: string = '';
  proyectoSelected: Projects | null = null;

  RPselected: any;
  rpnumbers!: any[];

  settlements: Settlement[] = [];
  settlementSelected!: Settlement;
  settlementForm!: FormGroup;
  settlementApproved: boolean = false;

  settlementDetails: SettlementDetails[] = [];
  settlementDeductions: SettlementDeductions[] = [];
  rpCountByproject!: RPCount;
  TotalApprovedByAssembly!: TotalApprovedByAssembly;
  formV: boolean = false;
  detailsV: boolean = false;
  deductionsV: boolean = false;

  settlementCurrency!: any[];
  paymentType!: any[];
  deductionType!: any[];
  percentageMktByProject!: PercentageMktOrigination;
  CuentasCapex!: any[];
  CuentasOpex!: any[];
  prePayments!: any[];
  statusSettlement!: any[];

  statusSelected: any;

  blockPetitions: boolean = false;
  validateDeleteBtn: boolean = false;

  constructor(private productService: ProductService, private RPcatalogsService: RPCatalogsService, private settlementService: SettlementService,
    public _authGuardService: authGuardService, private readonly serviceObsProject$: ObservableService, private _fb: FormBuilder,
    private _settlementeCatalogsService: SettlementCatalogsService, private _implementationCatalogsService: ImplementationCatalogsService,
    private messageService: MessageService, private confirmationService: ConfirmationService, private capexAccountService: CapexOpexAccountsService
  ) {

    this.token = this._authGuardService.getToken();
    this.position = this.token?.area;
    this.getRPnumber();
    this.getSettlementCurrency();
    this.getPaymentType();
    this.getDeductionType();
    this.getStatusSettlement();
    this.getCuentasCapex();
    this.getCuentasOpex();
    this.getPrePaymentDeductions();
    this.initFormulario();
    this.observaProjectSelected();
    this.productService.getProducts().then(response => {
      this.products = response;
    });

  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.RPselected = null;
        this.getPercentageMktByProject();
        this.getRPCountByProject();
        this.getSettlement(0)
      } else {

      }
    });
  }

  initFormulario(){
    this.settlementForm = this._fb.group({
      idrpnumber_main: ['',[Validators.required]],
      Idsettlement: [''],
      Idsetlecurrency: [''],

      newDetail: this._fb.group({
        idrpnumber: [''],
        settlement_volume: [,[Validators.required]],
        selectedDate: ['',[Validators.required]],
        vintage: [''],
        Idprepayment: ['',[Validators.required]],
        markert_price: [,[Validators.required]],
        pricecanopia: [],
      }),

      newDeduction: this._fb.group({
        idrpnumber: [''],
        Idtypededuction: ['',[Validators.required]],
        idcapexaccounts: ['',[Validators.required]],
        idopexaccounts: ['',[Validators.required]],
        Idprepaymentdeduction: ['',[Validators.required]],
        cost: [,[Validators.required]],
      }),

      details_json: this._fb.array([],),
      deductions_json: this._fb.array([],),
    });
  }

  get details() : FormArray {
    return this.settlementForm.get('details_json') as FormArray;
  }

  get newDetail() : FormGroup {
    return this.settlementForm.get('newDetail') as FormGroup;
  }

  removeDetail(index: number){
    this.details.removeAt(index);
  }

  addDetail(){
    if(this.settlementForm.get('idrpnumber_main')?.invalid || !this.decimalType){
      this.formV = true;
      return this.messageService.add({ severity: 'error', summary: 'RP Number and decimals required', detail: 'Please select an RP Number and a decimal precision (2, 3 or 4 decimals).'});
    }

    if(!this.newDetail.valid){
      this.detailsV = true;
      return this.messageService.add({ severity: 'error', summary: 'Fields Required', detail: 'All fields is required'});
    }

    this.details.push(this._fb.group({
        idrpnumber: [this.settlementForm.value.idrpnumber_main],
        settlement_volume: [this.newDetail.value.settlement_volume],
        vintage: [this.newDetail.value.vintage],
        Idprepayment: [this.newDetail.value.Idprepayment],
        markert_price: [this.newDetail.value.markert_price],
        price_canopia: [this.getPriceCanopia(this.newDetail.value.markert_price)],
    }));
    this.detailsV = false;
    this.formV = false;
    this.newDetail.reset();
  }

  onDateSelect(event: string) { 
    const year = new Date(event).getFullYear();
    this.newDetail.get('vintage')?.setValue(year);
  }

  get deductions() : FormArray {
    return this.settlementForm.get('deductions_json') as FormArray;
  }

  get newDeduction() : FormGroup {
    return this.settlementForm.get('newDeduction') as FormGroup;
  }

  addDeduction(){
    if(this.settlementForm.get('idrpnumber_main')?.invalid){
      this.formV = true;
      return this.messageService.add({ severity: 'error', summary: 'RP Number Required', detail: 'Please select a RP Number'});
    }
    
    if(!this.newDeduction.valid){
      this.deductionsV = true;
      return this.messageService.add({ severity: 'error', summary: 'Fields Required', detail: 'All fields is required'});
    }

    this.deductions.push(this._fb.group({
      idrpnumber: [this.settlementForm.value.idrpnumber_main],
      Idtypededuction: [this.newDeduction.value.Idtypededuction],
      idcapexaccounts: [this.newDeduction.value.idcapexaccounts],
      idopexaccounts: [this.newDeduction.value.idopexaccounts],
      Idprepaymentdeduction: [this.newDeduction.value.Idprepaymentdeduction],
      cost: [this.newDeduction.value.cost],
    }));

    this.deductionsV = false;
    this.formV = false;
    this.newDeduction.reset();
  }

  removeDeduction(index: number){
    this.deductions.removeAt(index);
  }

  typeAccountSelected(value: any){
    if(value == 1){
      this.newDeduction.get('idopexaccounts')?.removeValidators([Validators.required])
      this.newDeduction.get('idopexaccounts')?.reset()
      this.newDeduction.get('idcapexaccounts')?.setValidators([Validators.required])
      this.newDeduction.get('idcapexaccounts')?.updateValueAndValidity()
      this.newDeduction.get('Idprepaymentdeduction')?.removeValidators([Validators.required])
      this.newDeduction.get('Idprepaymentdeduction')?.reset()
    }

    if(value == 2){
      this.newDeduction.get('idcapexaccounts')?.removeValidators([Validators.required])
      this.newDeduction.get('idcapexaccounts')?.reset()
      this.newDeduction.get('idopexaccounts')?.setValidators([Validators.required])
      this.newDeduction.get('idopexaccounts')?.updateValueAndValidity()
      this.newDeduction.get('Idprepaymentdeduction')?.removeValidators([Validators.required])
      this.newDeduction.get('Idprepaymentdeduction')?.reset()
    }

    if(value == 3){
      this.newDeduction.get('Idprepaymentdeduction')?.setValidators([Validators.required])
      this.newDeduction.get('Idprepaymentdeduction')?.updateValueAndValidity()
      this.newDeduction.get('idcapexaccounts')?.removeValidators([Validators.required])
      this.newDeduction.get('idcapexaccounts')?.reset()
      this.newDeduction.get('idopexaccounts')?.removeValidators([Validators.required])
      this.newDeduction.get('idopexaccounts')?.reset()
    }
  }

  getSettlement(idRP: number){
    this.settlementService.getSettlement(this.proyectoSelected?.idprojects, idRP, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.settlements = resp.result;
      }
    })
  }

  getTotalApprovedByAssembly(idRP: number){
    this.settlementService.getTotalApprovedByAssembly(this.proyectoSelected?.idprojects, idRP, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.TotalApprovedByAssembly = resp.result[0];
      }
    })
  }
  
  getRPnumber(){
    this.RPcatalogsService.getRPnumber(this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.rpnumbers = resp.result;
      }
    });
  }

  getSettlementCurrency(){
    this._settlementeCatalogsService.getSettlementCurrency(this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.settlementCurrency = resp.result;
      }
    });
  }

  getPaymentType(){
    this._settlementeCatalogsService.getPaymentType(this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.paymentType = resp.result;
      }
    });
  }

  getDeductionType(){
    this._settlementeCatalogsService.getDeductionType(this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.deductionType = resp.result;
      }
    });
  }

  getStatusSettlement(){
    this._settlementeCatalogsService.getStatusSettlement(this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.statusSettlement = resp.result;
      }
    });
  }

  getPercentageMktByProject(){
    this._settlementeCatalogsService.getPercentageMktByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.percentageMktByProject = resp.result[0];
      }
    });
  }

  getCuentasCapex(){
    this.capexAccountService.getCapexAccounts(this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1) {
            this.CuentasCapex = resp.result
        }
    });
  }

  getCuentasOpex(){
    this.capexAccountService.getOpexAccounts(this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1) {
            this.CuentasOpex = resp.result;
        }
    });
  }

  getPrePaymentDeductions(){
    this._settlementeCatalogsService.getPrePaymentDeductions(this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.prePayments = response.result;
      } else {
          console.error("No se pudo traer la información de getPrePaymentDeductions", response.message)
      }
    })
  }

  getPaymentName(idPayment: number): string{
    const paymentName = this.paymentType.find(pt => pt.Idprepayment === idPayment)?.Descripprepayment;
    return paymentName ? paymentName : '';
  }

  getPriceCanopia(marketPrice: number): number{
    const percentage = this.settlementSelected?.PercentageMktPrice_avg ? this.settlementSelected?.PercentageMktPrice_avg : this.percentageMktByProject.PercentageMktPrice
    const calculatePrice = marketPrice * (percentage / 100);
    let decimals = 2;
    if(this.decimalType == 'two'){
      decimals = 2 
    } else if(this.decimalType == 'three'){
      decimals = 3
    } else if(this.decimalType == 'four'){
      decimals = 4
    }
    console.log(this.decimalType, decimals);
    
    return parseFloat(calculatePrice.toFixed(decimals));
  }

  getTotalHorizontal(volume: number, index: number): number{
    const priceCanopia = Number(this.getPriceCanopia(this.details.at(index).value.markert_price).toFixed(
      this.decimalType == 'two' ? 2 : this.decimalType == 'three' ? 3 : this.decimalType == 'four' ? 4 : 2
    ));
    const total = volume * priceCanopia;
    return total;
  }

  getGrossIncome(): number{
    let totalGrossIncome = 0;
    this.details.controls.forEach((detail, index) => {
      totalGrossIncome += this.getTotalHorizontal(detail.value.settlement_volume, index);
    });
    return totalGrossIncome;
  }

  getNameDeduction(idTypeDeduction: number): string{
    const nameDeduction = this.deductionType.find(dt => dt.IdtypeDeduction === idTypeDeduction)?.typeDeduction;
    return nameDeduction ? nameDeduction : '';
  }

  getNamePrePayment(Idprepaymentdeduction: number): string{
    const namePrepayment = this.prePayments.find(pre => pre.Idprepaymentdeduction === Idprepaymentdeduction)?.Descripprepaymentdeduction;
    return namePrepayment;
  }

  getNameAccount(idAccount: number, typeAccount: number): string{
    let nameAccount = '';
    if(typeAccount == 1){
      nameAccount = this.CuentasCapex.find(c => c.idcapexaccounts === idAccount)?.concepto;
    } else if(typeAccount == 2){
      nameAccount = this.CuentasOpex.find(c => c.idopexaccounts === idAccount)?.concepto;
    } else if(typeAccount == 3){
      nameAccount = this.prePayments.find(p => p.Idprepaymentdeduction === idAccount)?.Descripprepaymentdeduction;
    }
    return nameAccount ? nameAccount : '';
  }

  getTotalCapex(): number{
    let totalDeductions = 0;
    this.deductions.controls.forEach((deduction) => {
      if(deduction.value.Idtypededuction == 1){
        totalDeductions += deduction.value.cost;
      } // Capex
    });
    return totalDeductions;
  }

  getTotalOpex(): number{
    let totalDeductions = 0;
    this.deductions.controls.forEach((deduction) => {
      if(deduction.value.Idtypededuction == 2){
        totalDeductions += deduction.value.cost;
      } // Opex
    });
    return totalDeductions;
  }

  /** PARA SACAR ESTE CALCULO, SE REQUIERE LA REESTRUCTURA DE SUMMARY COST - EXPLICADO EN LOS CASOS DE USO
   * donde va el recoup period, debe de ir el valor necesario para hacer el calculo
   */
  getFinalUpfrontDeduction(): number{
    const RP = this.settlementSelected?.rp_count ? this.settlementSelected.rp_count : this.rpCountByproject.rp_count
    const finalUpfrontDeduction = (this.getTotalCapex() / RP);
    return finalUpfrontDeduction;
  }

  getTotalCapexResume(): number{
    const RP = this.settlementSelected?.rp_count ? this.settlementSelected.rp_count : this.rpCountByproject.rp_count
    let totalDeductions = this.getTotalCapex() / RP;
    return totalDeductions;
  }

  getTotalOpexResume(): number{
    const RP = this.settlementSelected?.rp_count ? this.settlementSelected.rp_count : this.rpCountByproject.rp_count
    let totalDeductions = this.getTotalOpex() / RP;
    return totalDeductions;
  }

  getTotalProjectNetIncome(): number{
    /** en caso de uso es final upfront deduction - project gross income - final annual cost deduction */
    let total = this.getGrossIncome() - this.getFinalUpfrontDeduction() - this.getTotalOpex();
    return total;
  }

  getCompareTotal(total: number): string{
    let ngclass = ''
    if(total > this.TotalApprovedByAssembly?.Total_byRP_EstimadoUSD){
      ngclass = 'font-bold pl-3 status-warn'
    } else {
      ngclass = 'font-bold pl-3 status-nowarn'
    }
    return ngclass;
  }

  getCompareTotalActivateIcon(total: number): string{
    let condition = 'desactivate'
    if(total > this.TotalApprovedByAssembly?.Total_byRP_EstimadoUSD){
      condition = 'activate'
    } else {
      condition = 'desactivate'
    }
    return condition;
  }

  getCatchStatus(idstatus: number): string{
    let textoStatus = this.statusSettlement.find(status => status.IdstatusSettlement === idstatus)?.status;
    return textoStatus
  }

  onRowSelected(idrpnumber: number, idSettlement: number, settlement: Settlement){
    this.settlementSelected = settlement;
    this.settlementForm.get('Idsettlement')?.setValue(idSettlement);
    this.settlementForm.get('idrpnumber_main')?.setValue(idrpnumber);
    this.getSettlementDetails(idSettlement, idrpnumber);
    this.getSettlementDeductions(idSettlement, idrpnumber);
    this.getTotalApprovedByAssembly(idrpnumber);
    if(this.settlementSelected.status == 2 && this.settlementSelected.statusdirection != 2 || this.settlementSelected.status != 2 && this.settlementSelected.statusdirection == 2){
      if(!this.position.includes('Direction') && !this.position.includes('Operations')){
        this.settlementForm.get('idrpnumber_main')?.disable();
        this.settlementApproved = true;
      }
    } else if(this.settlementSelected.status == 2 && this.settlementSelected.statusdirection == 2) {
        this.settlementForm.get('idrpnumber_main')?.disable();
        this.settlementApproved = true;
    } else if(this.settlementSelected.status == 3 && this.settlementSelected.statusdirection != 3 || this.settlementSelected.status != 3 && this.settlementSelected.statusdirection == 3){
      if(!this.position.includes('Direction') && !this.position.includes('Operations')){
        this.validateDeleteBtn = true
      } else {
        this.validateDeleteBtn = false
      }
    }
    this.showDialog();
  }

  getRPCountByProject(){
    this.settlementService.getRPCountByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        if(resp.result.length > 0){
          this.rpCountByproject = resp.result[0];
        } else {
          const defaultValue = {idprojects: 0, rp_count: 0}
          this.rpCountByproject = defaultValue
        }
      }
    })
  }

  getSettlementDetails(idSettlement: number, idrpnumber: number){
    this.settlementService.getSettlementDetails(idSettlement, idrpnumber, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.settlementDetails = resp.result;
        this.countDecimals(this.settlementDetails[0]?.pricecanopia)
        for(let detail of this.settlementDetails){
          this.details.push(this._fb.group({
              idrpnumber: [detail.idrpnumber],
              settlement_volume: [detail.settlement_volume],
              vintage: [detail.vintage],
              Idprepayment: [detail.Idprepayment],
              markert_price: [detail.markert_price],
              price_canopia: [this.getPriceCanopia(detail.markert_price).toFixed( this.decimalType == 'two' ? 2 : this.decimalType == 'three' ? 3 : this.decimalType == 'four' ? 4 : 2 )],
          }));
        }
      }
    });
  }

  countDecimals(num: number): void {
    const numStr = num.toString();
    let count = 0;

    if (numStr.includes('.')) {
      count = numStr.split('.')[1].length;
    }

    switch (count) {
      case 2:
        this.decimalType = 'two';
        break;
      case 3:
        this.decimalType = 'three';
        break;
      case 4:
        this.decimalType = 'four';
        break;
      default:
        this.decimalType = '';
        break;
    }
    console.log(this.decimalType);
    
  }


  getSettlementDeductions(idSettlement: number, idrpnumber: number){
    this.settlementService.getSettlementDeductions(idSettlement, idrpnumber, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.settlementDeductions = resp.result;
        for(let deduction of this.settlementDeductions){
          this.deductions.push(this._fb.group({
            idrpnumber: [deduction.idrpnumber],
            Idtypededuction: [deduction.Idtypededuction],
            idcapexaccounts: [deduction.idcapexaccounts],
            idopexaccounts: [deduction.idopexaccounts],
            Idprepaymentdeduction: [deduction.Idprepaymentdeduction],
            cost: [deduction.cost],
          }));
        }
      }
    });
  }

  clearValidatorsFormGroups(parent: FormGroup, childGroupName: string): void {
    const childGroup = parent.get(childGroupName) as FormGroup;

    if (!childGroup) {
      return;
    }

    Object.keys(childGroup.controls).forEach(key => {
      const control = childGroup.get(key);
      control?.clearValidators();
      control?.updateValueAndValidity();
    });
  }


  save(){
    this.clearValidatorsFormGroups(this.settlementForm, 'newDetail');
    this.clearValidatorsFormGroups(this.settlementForm, 'newDeduction');

    if(this.blockPetitions){
      return;
    }
    
    this.blockPetitions = true;

    if(!this.settlementForm.valid){
      this.formV = true;
      this.blockPetitions = false;
      return this.messageService.add({ severity: 'error', summary: 'Fields Required', detail: 'All fields is required'});
    }

    if(this.details.length == 0){
      this.blockPetitions = false;
      return this.messageService.add({ severity: 'error', summary: 'Details Required', detail: 'At least one detail is required'});
    }

    if(this.deductions.length == 0){
      this.blockPetitions = false;
      return this.messageService.add({ severity: 'error', summary: 'Deductions Required', detail: 'At least one deduction is required'});
    }

    let data = {
      Idsettlement: this.settlementForm.value.Idsettlement ? this.settlementForm.value.Idsettlement : 0,
      idprojects: this.proyectoSelected?.idprojects,
      idrpnumber_main: this.settlementForm.value.idrpnumber_main,
      Idsetlecurrency: this.settlementForm.value.Idsetlecurrency || 1,
      PercentageMktPrice: this.settlementSelected?.PercentageMktPrice_avg ? this.settlementSelected?.PercentageMktPrice_avg : this.percentageMktByProject.PercentageMktPrice,
      rp_count: this.settlementSelected?.rp_count ? this.settlementSelected?.rp_count : this.rpCountByproject.rp_count,
      details_json: this.settlementForm.value.details_json,
      deductions_json: this.settlementForm.value.deductions_json,
    }

    this.settlementService.setSettlement(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.blockPetitions = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "settlement saved successfully"});
        this.getSettlement(this.RPselected || 0);
        if(this.statusSelected) this.saveStatus();
        else this.onHide();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Some was wrong, try again"});
      } 
    })
  }

  saveStatus(){
    if(!this.statusSelected){
      return this.messageService.add({ severity: 'error', summary: 'Fields Required', detail: 'this field is required'});
    }

    if(this.position.includes('Direction') || this.position.includes('Operations')){
      let data = {
        Idsettlement: this.settlementForm.get('Idsettlement')?.value,
        status: this.position.includes('Operations') ? this.statusSelected : this.settlementSelected.status,
        statusdirection: this.position.includes('Direction') ? this.statusSelected : this.settlementSelected.statusdirection,
      }

      this.settlementService.setStatusSettlement(data, this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1){
          if(resp.result[0]?.Resultado.includes('Error: Usuario no autorizado')){
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "You have not permissions to change register status"});
          } else if(resp.result[0]?.Resultado.includes('Actualización exitosa')){
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Status changed succesfully"});
          }
          this.onHide();
          this.getSettlement(this.RPselected || 0);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Some was wrong, try again"});
        } 
      })
    } else {
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: "You have not permission to change status"});
    }
  }

  confirm(event: any, settlementId: number) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.delete(settlementId)
        },
        reject: () => {

        }
    });
  }

  delete(settlementId: number){
    let data = {
      Idsettlement: settlementId,
    }

    this.settlementService.setDeleteSettlement(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Status changed succesfully"});
        this.onHide();
        this.getSettlement(this.RPselected || 0);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Some was wrong, try again"});
      } 
    })
  }

  downloadSettlementReport(){
    this.settlementService.downloadSettlementReport(this.proyectoSelected?.ProjectName ,this.proyectoSelected?.idprojects ,this.RPselected, this.token?.access_token)
  }

  downloadSettlementByID(settlementId: number, idrpnumber: number, folio: string, registryDate: string) {
    let data = {
      folio: folio,
      carId: this.proyectoSelected?.Id_ProyectoCAR,
      idprojects: this.proyectoSelected?.idprojects,
      projectCounter: this.proyectoSelected?.Counterpart,
      projectName: this.proyectoSelected?.ProjectName,
      registryDate: registryDate,
      rp_count: this.settlementSelected?.rp_count ? this.settlementSelected.rp_count : this.rpCountByproject.rp_count
    }
    this.settlementService.downloadSettlementByID(settlementId , idrpnumber, folio, data, this.token?.access_token)
  }
}
