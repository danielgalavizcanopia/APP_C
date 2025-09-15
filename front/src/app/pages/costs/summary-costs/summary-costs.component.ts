import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { CostsService } from 'src/app/services/Costs/costs.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { AnnualOMComponent } from '../annual-om/annual-om.component';
import { UpfrontCostDeductionComponent } from '../upfront-cost-deduction/upfront-cost-deduction.component';
import { AnnualOMDeductionsComponent } from '../annual-omdeductions/annual-omdeductions.component';
import { UpfrontCostComponent } from '../upfront-cost/upfront-cost.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SummaryCostByProject } from 'src/app/interfaces/Costs/costs.interface';
import { UpfrontCost } from 'src/app/interfaces/Costs/upfrontCosts.interface';
import { SummaryCostLock } from 'src/app/interfaces/Costs/lockSummaryCost.interface';

@Component({
  selector: 'app-summary-costs',
  templateUrl: './summary-costs.component.html',
  styleUrls: ['./summary-costs.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class SummaryCostsComponent {
  @ViewChild(AnnualOMComponent) modalAnnualCosts!: AnnualOMComponent;
  @ViewChild(UpfrontCostDeductionComponent, { static: false }) modalUpfrontDeductionCost!: UpfrontCostDeductionComponent;
  @ViewChild(AnnualOMDeductionsComponent, { static: false }) modalAnnualDeductionCost!: AnnualOMDeductionsComponent;
  @ViewChild(UpfrontCostComponent, { static: false }) modalUpfrontCost!: UpfrontCostComponent;

  token: any;
  proyectoSelected: Projects | null = null;
  summaryCost: SummaryCostByProject[] = [];
  upFrontCost!: UpfrontCost;
  labelsUpfront: any [] = [];
  items!: MenuItem[];
  lock!: SummaryCostLock;
  validateUserLock: boolean = false;
  labelbuttonLock: string = '';
  iconbuttonLock: string = '';
  toolTip: string = '';

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private productService: ProductService, readonly serviceObsProject$: ObservableService, public _authGuardService: authGuardService, private _costsService: CostsService) {
    this.token = this._authGuardService.getToken();
    this.observaProjectSelected();
    this.getLockSummaryCost();

    this.validateUser();
  }

  confirm(event: any) {
        this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.setLock();
               
            },
            reject: () => {

            }
        });
      }

  ngOnInit() {
    this.items = [
      {
        label: 'Annual Cost',
        command: (showModal: boolean) => {
            this.modalAnnualCosts.openModal(showModal)
        }
      },
      {
        label: 'Upfront Cost Deduction (UCD)',
        command: (showModal: boolean) => {
            this.modalUpfrontDeductionCost.openModal(showModal);
        }
      },
      {
        label: 'Annual Cost deductions',
        command: (showModal: boolean) => {
            this.modalAnnualDeductionCost.openModal(showModal);
        }
      },
      {
        label: 'Upfront Costs USD',
        command: (showModal: boolean) => {
            this.modalUpfrontCost.openModal(showModal);
        }
      },
    ]
  }


  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if (project) {
        this.proyectoSelected = project;
        this.getSummaryCostByProject();
        this.getSummaryUpfrontCostByProject();
      } else {

      }
    });
  }

  getSummaryCostByProject() {
    this._costsService.getSummaryCostByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((resp: any) => {
      if (resp.valido == 1) {
        this.summaryCost = resp.result;
      }
    })
  }

  getSummaryUpfrontCostByProject() {
    this._costsService.getUpfrontCostByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((resp: any) => {
      if (resp.valido == 1) {
        this.upFrontCost = resp.result[0];
        this.labelsUpfront = Object.keys(this.upFrontCost).map(key => {
        return { 
          concept: key, 
          value: (this.upFrontCost as any)[key] 
        };
      });
      }
    })
  }

  getReplaceWithSpaces(conceptName: string): string{
    if (!conceptName) return '';
    return conceptName.replace(/_/g, ' ');
  }

  getTotalUpfrontCost(): number{
    let total = 0;
    for(let concept of this.labelsUpfront){
      if(concept.concept != 'Idupdfront' && concept.concept != 'Idproject' && concept.concept != 'DateModify'){
        total += concept.value;
      }
    }
    return total;
  }

  getTotalSummaryCost(type: number): number{
    let total = 0;
    if(this.summaryCost.length > 0){
      if(type === 1){
        this.summaryCost.forEach(item => {
          if(item.RP){
            total += item.AnnualCosts;
          }
        });
      }
      if(type === 2){
        this.summaryCost.forEach(item => {
          if(item.RP){
            total += item.UpfrontCostsDeductions;
          }
        });
      }
      if(type === 3){
        this.summaryCost.forEach(item => {
          if(item.RP){
            total += item.AnnualCostDeductions;
          }
        });
      }
    }
    return total;
  }

  getLockSummaryCost(){
    this._costsService.getLockSummaryCost(this.token?.access_token).subscribe((resp: any) =>{
      if(resp.valido == 1){
        this.lock = resp.result[0];
        this.validateLabels();
      }
    })
  }

  validateLabels(){
    if(this.lock.status == 0){
      this.labelbuttonLock = 'Block entry';
      this.iconbuttonLock = 'pi pi-lock';
      this.toolTip = `
          If you activate this button, no user will be able to enter, modify, or update information in the system.
          This measure is implemented to:

          - Prevent errors or conflicts during critical processes.
          - Ensure the integrity and consistency of the information.
          - Protect sensitive data during maintenance or review tasks.
        `;
    }
    if(this.lock.status == 1){
      this.labelbuttonLock = 'Unblock entry';
      this.iconbuttonLock = 'pi pi-unlock';
      this.toolTip = '';
    }
  }

  setLock(){
    let data = {
      action: this.lock.status == 1 ? 0 : 1
    }

    this._costsService.setLockSummaryCost(data, this.token?.access_token).subscribe((resp: any) =>{
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'You have accepted' });
        this.lock = resp.result[0];
        this.validateLabels()
      }
    })
  }

  validateUser(){
    if(this.token?.userId === 14){
      this.validateUserLock = true;
    } else {
      this.validateUserLock = false;
    }
  }



}
