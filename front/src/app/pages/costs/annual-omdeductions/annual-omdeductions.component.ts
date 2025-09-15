import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { CostsService } from 'src/app/services/Costs/costs.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { SummaryCostsComponent } from '../summary-costs/summary-costs.component';
import { ProductService } from 'src/app/services/product.service';
import { AnnualCostDeduction } from 'src/app/interfaces/Costs/AOMDeductions.interface';

@Component({
  selector: 'app-annual-omdeductions',
  templateUrl: './annual-omdeductions.component.html',
  styleUrls: ['./annual-omdeductions.component.scss']
})
export class AnnualOMDeductionsComponent {
  token: any;
  proyectoSelected: Projects | null = null;
  anualOMForm!: FormGroup;
  anualCostDeduction: AnnualCostDeduction[] = [];

  visible: boolean =  false;
  openModal(showModal : boolean){
    if(showModal == false){
      this.initFormulario()
      this.getAnnualCostDeductionsByProject()
      this.editMode = [];
    }
    this.visible = showModal;
  }
  products: any[] = [];

  editMode: boolean[] = [];
  constructor(private _costsService: CostsService, readonly serviceObsProject$: ObservableService, public _authGuardService: authGuardService, private _fb: FormBuilder,
    private messageService: MessageService, public _summaryComponent: SummaryCostsComponent, private productService: ProductService
  ){
    this.token = this._authGuardService.getToken();
    this.initFormulario();
    this.observaProjectSelected()
    this.productService.getProducts().then(response => {
      this.products = response;
    });
  }

  initFormulario(){
    this.anualOMForm = this._fb.group({
      annualCostD: this._fb.array([])
    });
    this.anualOMForm.reset();
  }

  get annualCostD(): FormArray {
    return this.anualOMForm.get('annualCostD') as FormArray;
  }

  addItem() {
    const calculateRP = this.annualCostD.length != 0 ? this.annualCostD.at(this.annualCostD.length-1)?.get('idrpnumber')?.value + 1 : 1
    this.annualCostD.push(this._fb.group({
        Idannualcostddaoymcd: [0],
        idprojects:[this.proyectoSelected?.idprojects],
        idrpnumber: [calculateRP,[Validators.required]],
        valorAOyMCD: ['',[Validators.required]],
    }));
    this.editMode.push(true);
  }

  enableEdit(index: number, condition: boolean) {
    if(condition){
      this.editMode[index] = false;
      this.annualCostD.at(index).get('valorAOyMCD')?.disable();
    } else {
      this.editMode[index] = true;
      this.annualCostD.at(index).get('valorAOyMCD')?.enable();
    }
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.initFormulario();
        this.getAnnualCostDeductionsByProject()
      } else {

      }
    });
  }

  getAnnualCostDeductionsByProject(){
    this._costsService.getAnnualCostDeductionsByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((resp: any) => {
      if (resp.valido == 1) {
        this.anualCostDeduction = resp.result;
        if(this.anualCostDeduction.length > 0){
          for(let i = 0; i < this.anualCostDeduction.length; i++){
            const upfrontCost = this.anualCostDeduction[i];
            const calculateMaxRP = this.anualCostDeduction.map(a => a.idrpnumber)
            const maximo = Math.max(...calculateMaxRP);
            const idrp = upfrontCost.idrpnumber ? upfrontCost.idrpnumber : maximo + 1;
            this.annualCostD.push(this._fb.group({
              Idannualcostddaoymcd: [upfrontCost.Idannualcostddaoymcd],
              idprojects:[upfrontCost.idprojects],
              idrpnumber: [idrp,[Validators.required]],
              valorAOyMCD: [upfrontCost.valorAOyMCD,[Validators.required]],
            }));
            this.editMode.push(false);
          }
        } else {
          this.addItem();
        }
      }
    })
  }

  getTotalAnnualCostDeduction(){
    let total = 0;
    this.annualCostD.controls.forEach((group: any) => {
      const valor = group.get('valorAOyMCD')?.value;
      if(!isNaN(valor)){
        total += Number(valor);
      }
    });
    return total;
  }

  save(){
    if(this.annualCostD.length == 0){
      return this.messageService.add({severity:'warn', summary:'Warning', detail: 'No data to save'});
    }

    let data = {
      annualCostD: this.annualCostD.value
    }

    this._costsService.setAnnualCostDeductionsByProject(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this._summaryComponent.getSummaryCostByProject();
        this.messageService.add({severity:'success', summary:'Success', detail: 'Data saved successfully'});
        this.openModal(false);
      } else {
        this.messageService.add({severity:'error', summary:'Error', detail: 'Error saving data'});
      }
    });

  }
}
