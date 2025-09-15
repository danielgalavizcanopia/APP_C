import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AnnualCost } from 'src/app/interfaces/Costs/AnualCTS.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { CostsService } from 'src/app/services/Costs/costs.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { SummaryCostsComponent } from '../summary-costs/summary-costs.component';
import { CapexOpexAccountsService } from 'src/app/services/Tools/CapexOpexAccounts.service';
import { OpexAccount } from 'src/app/interfaces/Monitor/SummaryActivities.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-annual-om',
  templateUrl: './annual-om.component.html',
  styleUrls: ['./annual-om.component.scss']
})
export class AnnualOMComponent implements OnInit {
  /** ABRIR MODAL MEDIANTE VIEWCHILD */
  visible!: boolean;

  openModal(showModal: boolean){
    if(showModal == false){
      this.initFormulario()
      this.getAnnualCostByProject()
      this.editMode = [];
    }
    this.visible = showModal;
  }

  token: any;
  proyectoSelected: Projects | null = null;
  anualOMCTSForm!: FormGroup;

  anualOMCTS: AnnualCost[] = [];

  disabled!: boolean[];
  items: { id: number; year: number, name: string}[] = [];
  products: any[] = [];

  editMode: boolean[] = [];

  constructor(private _costsService: CostsService, readonly serviceObsProject$: ObservableService, public _authGuardService: authGuardService, private _fb: FormBuilder,
    private messageService: MessageService, public _summaryComponent: SummaryCostsComponent, private _capexOpexService: CapexOpexAccountsService,private productService: ProductService
  ){
    this.token = this._authGuardService.getToken();
    this.observaProjectSelected();

    this.productService.getProducts().then(response => {
      this.products = response;
    });
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.initFormulario();
        this.proyectoSelected = project;
        this.getAnnualCostByProject()
      } else {

      }
    });
  }

  ngOnInit() {
    this.initFormulario();
  }

  initFormulario(){
    this.anualOMCTSForm = this._fb.group({
      yearsAnnualCost: this._fb.array([]),
    })
    this.anualOMCTSForm.reset();
  }

  get yearsAnnualCost(): FormArray {
    return this.anualOMCTSForm.get('yearsAnnualCost') as FormArray;
  }
  
  addItem() {
    const calculateRP = this.yearsAnnualCost.length != 0 ? this.yearsAnnualCost.at(this.yearsAnnualCost.length-1)?.get('idrpnumber')?.value + 1 : 1
    this.yearsAnnualCost.push(this._fb.group({
        IdAnnualoCostsopex: [],
        idprojects:[this.proyectoSelected?.idprojects],
        idrpnumber: [calculateRP,[Validators.required]],
        valor: ['',[Validators.required]],
    }));
    this.editMode.push(true);
  }

  enableEdit(index: number, condition: boolean) {
    if(condition){
      this.editMode[index] = false;
      this.yearsAnnualCost.at(index).get('valor')?.disable();
    } else {
      this.editMode[index] = true;
      this.yearsAnnualCost.at(index).get('valor')?.enable();
    }
  }

   removeActivity(index: number) {
    this.yearsAnnualCost.removeAt(index);
  }

  getAnnualCostByProject(){
    this._costsService.getAnnualCostByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.anualOMCTS = resp.result;
        if(this.anualOMCTS.length > 0){
          for(let i = 0; i < this.anualOMCTS.length; i++){
            const anualOM = this.anualOMCTS[i];
            const calculateMaxRP = this.anualOMCTS.map(a => a.idrpnumber)
            const maximo = Math.max(...calculateMaxRP);
            const idrp = anualOM.idrpnumber ? anualOM.idrpnumber : maximo + 1;
            this.yearsAnnualCost.push(this._fb.group({
              IdAnnualoCostsopex: [anualOM.IdAnnualoCostsopex],
              idprojects: [anualOM.idprojects],
              idrpnumber: [idrp,[Validators.required]],
              valor: [anualOM.valor,[Validators.required]],
            }));
            this.editMode.push(false);
          }
        } else {
          this.addItem();
        }
      }
    })
  }

  getTotalAnnualCost(){
    let total = 0;
    this.yearsAnnualCost.controls.forEach((group: any) => {
      const valor = group.get('valor')?.value;
      if(!isNaN(valor)){
        total += Number(valor);
      }
    });
    return total;
  }

  save(){
    if(this.yearsAnnualCost.length == 0){
      return this.messageService.add({severity:'warn', summary:'Warning', detail: 'No data to save'});
    }

    let data = {
        annualCosts: this.yearsAnnualCost.value,
    }

    this._costsService.setAnnualCostByProject(data, this.token?.access_token).subscribe((resp: any) => {
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
