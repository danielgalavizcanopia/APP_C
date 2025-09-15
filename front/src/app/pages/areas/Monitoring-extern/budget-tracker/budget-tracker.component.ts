import { Component } from '@angular/core';
import { BudgetTrackerData } from 'src/app/interfaces/Monitor/SummaryActivities.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-budget-tracker',
  templateUrl: './budget-tracker.component.html',
  styleUrls: ['./budget-tracker.component.scss']
})
export class BudgetTrackerComponent {

  token: any;
  proyectoSelected: Projects | null = null;
  
  LastUpdatePaid!: string;
  LastUpdateProvisional!: string;
  messageProvisionalReport: string = 'This transactional report has not been validated by Finance.';
 
  totalCapexApproved: any;
  totalCapexPlanned: any;
  totalCapexActual: any;
  totalCapexProvisional: any;
  totalCapexReconciled: any;

  totalOpexApproved: any;
  totalOpexPlanned: any;
  totalOpexActual: any;
  totalOpexProvisional: any;
  totalOpexReconciled: any;

  BudgetTrackerData: BudgetTrackerData[] = [];
    totalsFinancial: any = {
      totalApproved: 0,
      totalPlanned: 0,
      totalPaid: 0,
      totalProvisional: 0,
    };
  rpnumbers: any[] = [];
  rpSelected: any;

  loading: boolean = true;

  constructor(
    private MonitoringCatalogService: MonCatalogService,
    public _authGuardService: authGuardService,
    readonly serviceObsProject$: ObservableService,
    private RPcatalogsService: RPCatalogsService,
  ){
    this.token = this._authGuardService.getToken();
    this.getRPnumber()
    this.observaProjectSelected()
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.changeRP();
      } else {
      }
    });
  }

  getRPnumber(){
    this.RPcatalogsService.getRPnumber( this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
          this.rpnumbers = resp.result;
      }
    });
  }

  changeRP(){
    if(this.rpSelected){
      this.getBudgetTrackerByProjectRP();
    } else {
      this.BudgetTrackerData = [];
      this.totalsFinancial = {
        totalApproved: 0,
        totalPlanned: 0,
        totalPaid: 0,
        totalProvisional: 0,
      };
      this.loading = false;
    }
  }
  
  getBudgetTrackerByProjectRP(){
    this.loading = true;
    this.MonitoringCatalogService.getBudgetTrackerByProjectRP(this.rpSelected.join(','), this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.BudgetTrackerData = response.result;
          this.getCatchTotals()
          this.UpdatePaid();
          this.UpdateProvisional();
          this.loading = false;
      } else {
          console.error("No se pudo traer la información de getBudgetTrackerByProjectRP", response.message)
      }
    })
  }

  exportBTToExcel() {
    this.MonitoringCatalogService.downloadBTMonitorExcel(this.proyectoSelected?.idprojects ,this.rpSelected.join(','), this.proyectoSelected?.ProjectName, this.token?.access_token)
  }

  exportProvisionalReport() {
    this.MonitoringCatalogService.downloadProvisionalReport(this.proyectoSelected?.Folio_project, this.proyectoSelected?.ProjectName, this.proyectoSelected?.idprojects, this.rpSelected.join(','), this.token?.access_token)
  }

  getCatchTotals(){
    this.totalsFinancial.totalApproved = 0;
    this.totalsFinancial.totalPlanned = 0;
    this.totalsFinancial.totalPaid = 0;
    this.totalsFinancial.totalProvisional = 0;

    if(this.BudgetTrackerData.length > 0) {
      for(let financial of this.BudgetTrackerData) {
        this.totalsFinancial.totalApproved += financial.Approved;
        this.totalsFinancial.totalPlanned += financial.PlannedTotal;
        this.totalsFinancial.totalPaid += financial.PaidTotal;
        this.totalsFinancial.totalProvisional += financial.ProvisionalTotal;
      }
    }
  }

  UpdateProvisional(){
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    

    this.LastUpdateProvisional = `Last update: ${dia}/${mes}/${anio}`;
  }

  UpdatePaid(){
    const fecha = new Date();
    const dosMesesAtras = new Date(fecha.getFullYear(), fecha.getMonth() - 2, 1);
    const lastDay = new Date(dosMesesAtras.getFullYear(), dosMesesAtras.getMonth() + 1, 0);

    const dia = lastDay.getDate().toString().padStart(2, '0');
    const mes = (lastDay.getMonth() + 1).toString().padStart(2, '0');
    const anio = lastDay.getFullYear();

    this.LastUpdatePaid = `Last update: ${dia}/${mes}/${anio}`;
  }
}
