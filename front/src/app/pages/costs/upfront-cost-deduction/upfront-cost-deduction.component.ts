import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UpfrontCostDeduction } from 'src/app/interfaces/Costs/upFrontDeductions.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { CostsService } from 'src/app/services/Costs/costs.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { SummaryCostsComponent } from '../summary-costs/summary-costs.component';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-upfront-cost-deduction',
  templateUrl: './upfront-cost-deduction.component.html',
  styleUrls: ['./upfront-cost-deduction.component.scss']
})
export class UpfrontCostDeductionComponent {

  token: any;
  proyectoSelected: Projects | null = null;
  UpfrontDeductionForm!: FormGroup;
  UpfrontDeduction: UpfrontCostDeduction[] = [];


  visible: boolean =  false;
  openModal(showModal : boolean){
    if(showModal == false){
      this.initFormulario()
      this.getUpfrontCostDeductionByProject()
      this.editMode = [];
    }
    this.visible = showModal;
  }
  products: any[] = [];

  editMode: boolean[] = [];

  constructor(private _costsService: CostsService, readonly serviceObsProject$: ObservableService, public _authGuardService: authGuardService, private _fb: FormBuilder,
    private messageService: MessageService, public _summaryComponent: SummaryCostsComponent,private productService: ProductService
  ){
    this.token = this._authGuardService.getToken();
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
        this.initFormulario();
        this.getUpfrontCostDeductionByProject()
      } else {

      }
    });
  }

  initFormulario(){
    this.UpfrontDeductionForm = this._fb.group({
      upfrontCostDeduction: this._fb.array([])
    });

    this.UpfrontDeductionForm.reset();
  }

  get upfrontCostD(): FormArray {
    return this.UpfrontDeductionForm.get('upfrontCostDeduction') as FormArray;
  }

  addItem() {
    const calculateRP = this.upfrontCostD.length != 0 ? this.upfrontCostD.at(this.upfrontCostD.length-1)?.get('idrpnumber')?.value + 1 : 1
    this.upfrontCostD.push(this._fb.group({
        Idfinalupfrontdeduction: [0],
        idprojects:[this.proyectoSelected?.idprojects],
        idrpnumber: [calculateRP,[Validators.required]],
        valorUCD: ['',[Validators.required]],
    }));
    this.editMode.push(true);
  }

  enableEdit(index: number, condition: boolean) {
    if(condition){
      this.editMode[index] = false;
      this.upfrontCostD.at(index).get('valorUCD')?.disable();
    } else {
      this.editMode[index] = true;
      this.upfrontCostD.at(index).get('valorUCD')?.enable();
    }
  }

  getUpfrontCostDeductionByProject(){
    this._costsService.getUpfrontCostDeductionByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.UpfrontDeduction = resp.result;
        if(this.UpfrontDeduction.length > 0){
          for(let i = 0; i < this.UpfrontDeduction.length; i++){
            const upfrontCost = this.UpfrontDeduction[i];
            const calculateMaxRP = this.UpfrontDeduction.map(a => a.idrpnumber)
            const maximo = Math.max(...calculateMaxRP);
            const idrp = upfrontCost.idrpnumber ? upfrontCost.idrpnumber : maximo + 1;
            this.upfrontCostD.push(this._fb.group({
              Idfinalupfrontdeduction: [upfrontCost.Idfinalupfrontdeduction],
              idprojects:[upfrontCost.idprojects],
              idrpnumber: [idrp,[Validators.required]],
              valorUCD: [upfrontCost.valorUCD,[Validators.required]],
          }));
          this.editMode.push(false);
          }
        } else {
          this.addItem();
        }
      }
    })
  }

  getTotalUpfrontCostDeduction(){
    let total = 0;
    this.upfrontCostD.controls.forEach((group: any) => {
      const valor = group.get('valorUCD')?.value;
      if(!isNaN(valor)){
        total += Number(valor);
      }
    });
    return total;
  }

  save(){
    if(this.upfrontCostD.length == 0){
      return this.messageService.add({severity:'warn', summary:'Warning', detail: 'No data to save'});
    }

    let data = {
      upfrontCostD: this.upfrontCostD.value
    }

    this._costsService.setUpfrontCostDeductionByProject(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this._summaryComponent.getSummaryUpfrontCostByProject();
        this.messageService.add({severity:'success', summary:'Success', detail: 'Data saved successfully'});
        this.openModal(false);
      } else {
        this.messageService.add({severity:'error', summary:'Error', detail: 'Error saving data'});
      }
    });
    
  }

}
