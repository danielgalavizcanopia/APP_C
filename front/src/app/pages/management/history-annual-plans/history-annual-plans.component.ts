import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ActivitiesByAnnualPlan, ActivitiesWithoutAnnualPlan, AnnualPlan } from 'src/app/interfaces/implementation/Implementation.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { ImplementacionService } from 'src/app/services/Implementacion/Implementacion.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-history-annual-plans',
  templateUrl: './history-annual-plans.component.html',
  styleUrls: ['./history-annual-plans.component.scss']
})
export class HistoryAnnualPlansComponent {
  
  token: any;

  products!: any[];
  items!: MenuItem[];
  activeIndex: number = 0;

  onActiveIndexChange(event: any) {
    this.activeIndex = event; 
  }

  proyectoSelected: Projects | null = null;
  AnnualPlans: AnnualPlan[] = [];
  AnnualPlanSelected!: AnnualPlan;
  activitiesByPlan: ActivitiesByAnnualPlan[] = [];
  ActivitiesWithoutPlan: ActivitiesWithoutAnnualPlan[] = [];
  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }

  hideDialog() {
    this.activitiesByPlan = [];
    this.visible = false;
    this.activitiesByPlan = [];
    this.ActivitiesWithoutPlan = [];
    this.activeIndex = 0;
  }

    truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
    readonly serviceObsProject$: ObservableService,
    public _authGuardService: authGuardService, private _implementacionService: ImplementacionService,
    private router: Router,
  ) {
    this.token = this._authGuardService.getToken();
    this.observaProjectSelected();

    this.items = [
      {
          label: 'Activities',
      },
      {
          label: 'Preview',
      },
    ]
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.getPlanAnualByProject()
      } else {

      }
    });
  }

  getPlanAnualByProject(){
    this._implementacionService.getPlanAnualByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.AnnualPlans = resp.result;
      }
    })
  }

  redirectToPreview(annualPlan: AnnualPlan){
      this.router.navigate(['/AnnualPlan-preview', annualPlan.Idplananual])
  }

  getTotalActivitiesSelected(activities: any[]): any{
    let sumTotal = 0;
    if(activities.length != 0){
      for (let activity of activities){
        sumTotal += parseFloat(activity?.EstimadoUSD)
      }
      return sumTotal
    } else {
      return 0;
    }
  }

  onRowSelected(AnnualPlan: AnnualPlan){

    this.AnnualPlanSelected = AnnualPlan;
    this.getActividadesByPlanAnual(AnnualPlan?.Idplananual);
    this.getActividadesWithoutPlanAnual(AnnualPlan?.idrpnumber, AnnualPlan?.Idplananual);
    this.visible = true;
  }

  getActividadesByPlanAnual(Idplananual: number){
    this._implementacionService.getActividadesByPlanAnual(Idplananual, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.activitiesByPlan = resp.result;
      }
    })
  }

  getActividadesWithoutPlanAnual(idrpnumber: number, idplan: number){
    this._implementacionService.getActividadesWithoutPlanAnual(idrpnumber, this.proyectoSelected?.idprojects, idplan,this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.ActivitiesWithoutPlan = resp.result;
      }
    })
  }

  saveActivitiesByAnnualPlan(){

    if(this.activitiesByPlan.length == 0){
      return this.messageService.add({ severity: 'error', summary: 'None Activities', detail: 'You need select mininum 1 activity to generate Annual Plan'});
    }

    let ActivitiesFinal = [];
    for(let act of this.activitiesByPlan){
      ActivitiesFinal.push({
        Idactividad_Rel_PlanAnual: act.Idactividad_Rel_PlanAnual,
        Idplananual: this.AnnualPlanSelected.Idplananual,
        IdActividaddata: act.IdActividaddata,
        status: 1
      })
    }

    for(let actWA of this.ActivitiesWithoutPlan){
      if(actWA.Idactividad_Rel_PlanAnual){
        ActivitiesFinal.push({
          Idactividad_Rel_PlanAnual: actWA.Idactividad_Rel_PlanAnual,
          Idplananual: actWA.Idplananual,
          IdActividaddata: actWA.IdActividaddata,
          status: 0,
        })
      }
    }

    let data = {
      p_Idplananual: this.AnnualPlanSelected.Idplananual,
      p_name: 'Implementation Annual Plan Draft_' + this.proyectoSelected?.ProjectName,
      p_idrpnumber: this.AnnualPlanSelected.idrpnumber,
      p_description: this.AnnualPlanSelected.description,
      p_Observaciones: '',
      p_status: this.AnnualPlanSelected.status,
      p_idprojects: this.proyectoSelected?.idprojects,
      activities: ActivitiesFinal
    }

    this._implementacionService.setPlanAnnual(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.hideDialog();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Activity changed successfully!'});
        this.serviceObsProject$.triggerRefresh();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
        this.serviceObsProject$.triggerRefresh();
      }
    })

  }
}
