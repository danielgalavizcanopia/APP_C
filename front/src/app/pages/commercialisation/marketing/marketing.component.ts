import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivitiesByRP, ActivityReporting } from 'src/app/interfaces/marketing/marketing.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { CustomerService } from 'src/app/services/customer.service';
import { MarketingService } from 'src/app/services/marketing/marketing.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls:['marketing.component.scss']
})
export class MarketingComponent {
  selectedProducts: any;
  customers!: any[]
  events: any[];
  token: any;
  proyectoSelected: Projects | null = null;
  
  rpnumbers: any[] = [];
  rpSelected: any;
  activities: ActivitiesByRP[] = [];
  activitySelected?: ActivitiesByRP;
  activityReporting: ActivityReporting[] = [];
  totalReportingByActivity = {
    kpi: 0,
    estimado: 0,
    AvanceCuantitativo: 0,
    participatingW: 0,
    participatingM: 0,
    SumaTotalJornales: 0,
  };
  

  constructor(
    readonly serviceObsProject$: ObservableService,
    private _customerService: CustomerService,
    private RPcatalogsService: RPCatalogsService,
    public _authGuardService: authGuardService,
    private _marketingService: MarketingService,
    private messageService: MessageService,
  ){
    this.token = this._authGuardService.getToken();
    this.observaProjectSelected();
    this.getRPnumber()
    this._customerService.getCustomersMedium().then((data) => {
      this.customers = data;
    });

     this.events = [
        { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
      ];
  }

  getRPnumber(){
    this.RPcatalogsService.getRPnumber(this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
          this.rpnumbers = resp.result;
      }
    });
  }

  observaProjectSelected() {
  /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
      this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
          if(project){
              this.proyectoSelected = project;
              this.getActivitiesByRPmark(this.rpSelected)
          } else {
              this.proyectoSelected = null;
          }
      });
  }

  catchActivity(activity: any){
      this.activitySelected = activity;
      if(!this.activitySelected){
        return;
      }

      this.getReportingByActivitymark(this.activitySelected.IdActividaddata);
  }

  getActivitiesByRPmark(rp: number){
    if(!rp){
      return;
    }
    this._marketingService.getActivitiesByRPmark(this.proyectoSelected?.idprojects, rp, this.token?.access_token).subscribe((resp: any) =>{
      if(resp.valido == 1){
        this.activities = resp.result;
      }
    });
  }

  getReportingByActivitymark(idactivity: number){
    if(!idactivity){
      return;
    }

    this._marketingService.getReportingByActivitymark(idactivity, this.token?.access_token).subscribe((resp: any) =>{
      if(resp.valido == 1){
        this.activityReporting = resp.result;

        this.totalReportingByActivity = {
          kpi: 0,
          estimado: 0,
          AvanceCuantitativo: 0,
          participatingW: 0,
          participatingM: 0,
          SumaTotalJornales: 0,
        }
        if(this.activityReporting.length > 0){
          const kpisVistos: any = [];
          for(let reporting of this.activityReporting){
            const kpiFind = kpisVistos.find((x: any) => x == reporting.Metrica)
            if(!kpiFind){
              kpisVistos.push(reporting.Metrica)
            }
            // this.totalReportingByActivity.kpi += reporting.kpi;
            this.totalReportingByActivity.estimado += reporting.estimado;
            this.totalReportingByActivity.AvanceCuantitativo += reporting.AvanceCuantitativo;
            this.totalReportingByActivity.participatingW += reporting.participatingW;
            this.totalReportingByActivity.participatingM += reporting.participatingM;
            this.totalReportingByActivity.SumaTotalJornales += reporting.NumJornales;
          }
            this.totalReportingByActivity.kpi = kpisVistos.length;
          
        }
      }
    });
  }

  importReporting(){
    if(!this.activitySelected){
      return this.messageService.add({ severity: 'error', summary: 'No activity Selected', detail: "Please, select Activity to import reporting data"});
    }

    if(this.activityReporting.length == 0){
      return this.messageService.add({ severity: 'error', summary: 'Reporting doesn’t exist', detail: "This activity doesn’t have reporting to import."});
    }

    let data = {
      activity: this.activitySelected,
      reporting: this.activityReporting,
      totalCount: this.totalReportingByActivity,
    }
    
    this._marketingService.setImportAcivityEventCatalog(data, this.token?.access_token).subscribe((resp: any) =>{
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Import Successfully', detail: "All fields import to Airtable!"});
      } else {
        this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
      }
    });
  }
}
