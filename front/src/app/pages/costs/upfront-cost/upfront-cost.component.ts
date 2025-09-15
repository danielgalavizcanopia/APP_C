import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UpfrontCost } from 'src/app/interfaces/Costs/upfrontCosts.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { CostsService } from 'src/app/services/Costs/costs.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { SummaryCostsComponent } from '../summary-costs/summary-costs.component';
import { DatePipe } from '@angular/common';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-upfront-cost',
  templateUrl: './upfront-cost.component.html',
  styleUrls: ['./upfront-cost.component.scss']
})
export class UpfrontCostComponent {
  token: any;
  proyectoSelected: Projects | null = null;
  upFrontCost!: UpfrontCost;
  ModifyDate!: Date;

  upFrontForm!: FormGroup;
  total!: any;
  visible: boolean =  false;
  openModal(showModal : boolean){
    this.visible = showModal;
    this.getUpfrontCost()
  }

  closeModal(){
    this.visible = false;
    this.total = 0;
  }
products: any[] = [];
  constructor(private _costsService: CostsService, readonly serviceObsProject$: ObservableService, public _authGuardService: authGuardService, private _fb: FormBuilder,
    private messageService: MessageService, public _summaryComponent: SummaryCostsComponent, private datepipe: DatePipe,private productService: ProductService
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
        this.getUpfrontCost();
      } else {

      }
    });
  }

  initFormulario(){
    this.upFrontForm = this._fb.group({
        CAPEX_of_Projects:[,[Validators.required]],
        CAROnsiteVerification:[,[Validators.required]],
        CCBSOnsiteVerification:[,[Validators.required]],
        Social_Monitoring:[,[Validators.required]],
        MonitoringBaseline:[,[Validators.required]],
        OnsiteImplementation:[,[Validators.required]],
        Project_Management_Expenses:[,[Validators.required]],
        PDDDevelopment:[,[Validators.required]],
        Registration:[,[Validators.required]],
        VerificationSupport:[,[Validators.required]],
        Legal_and_Tax_Services:[,[Validators.required]],
        Notary_Services:[,[Validators.required]],
        Contingency:[,[Validators.required]],
    });

    this.upFrontForm.reset();
  }

  getUpfrontCost(){
    this._costsService.getUpfrontCostByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.upFrontCost = response.result[0];
          this.onUpfrontSelected();
      } else {
          console.error("No se pudo traer la información de getUpfrontCostsUSD", response.message)
      }
    })
  }

  onUpfrontSelected(){
    this.upFrontForm.patchValue({
      CAPEX_of_Projects: this.upFrontCost?.CAPEX_of_Projects,
      CAROnsiteVerification: this.upFrontCost?.CAROnsiteVerification,
      CCBSOnsiteVerification: this.upFrontCost?.CCBSOnsiteVerification,
      Social_Monitoring: this.upFrontCost?.Social_Monitoring,
      MonitoringBaseline: this.upFrontCost?.MonitoringBaseline,
      OnsiteImplementation: this.upFrontCost?.OnsiteImplementation,
      Project_Management_Expenses: this.upFrontCost?.Project_Management_Expenses,
      PDDDevelopment: this.upFrontCost?.PDDDevelopment,
      Registration: this.upFrontCost?.Registration,
      VerificationSupport: this.upFrontCost?.VerificationSupport,
      Legal_and_Tax_Services: this.upFrontCost?.Legal_and_Tax_Services,
      Notary_Services: this.upFrontCost?.Notary_Services,
      Contingency: this.upFrontCost?.Contingency,
    })
  }

  save(){
    if(!this.upFrontForm.valid){
      return  this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "All fields required"});
    }

    let data = {
      Idupdfront: this.upFrontCost?.Idupdfront ? this.upFrontCost?.Idupdfront : 0,
      Idproject: this.proyectoSelected?.idprojects,
      CAPEX_of_Projects: this.upFrontForm.value.CAPEX_of_Projects,
      CAROnsiteVerification: this.upFrontForm.value.CAROnsiteVerification,
      CCBSOnsiteVerification: this.upFrontForm.value.CCBSOnsiteVerification,
      Social_Monitoring: this.upFrontForm.value.Social_Monitoring,
      MonitoringBaseline: this.upFrontForm.value.MonitoringBaseline,
      OnsiteImplementation: this.upFrontForm.value.OnsiteImplementation,
      Project_Management_Expenses: this.upFrontForm.value.Project_Management_Expenses,
      PDDDevelopment: this.upFrontForm.value.PDDDevelopment,
      Registration: this.upFrontForm.value.Registration,
      VerificationSupport: this.upFrontForm.value.VerificationSupport,
      Legal_and_Tax_Services: this.upFrontForm.value.Legal_and_Tax_Services,
      Notary_Services: this.upFrontForm.value.Notary_Services,
      Contingency: this.upFrontForm.value.Contingency,
    }

    this._costsService.setUpfrontCostByProject(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
        this.visible = false;
        this.total = 0;
        this.getUpfrontCost();
        this._summaryComponent.getSummaryUpfrontCostByProject();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
      }
    });
  }

}