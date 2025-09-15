import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FinancialTracker } from 'src/app/interfaces/Monitor/SummaryActivities.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-financial-tracker',
  templateUrl: './Financial-tracker.component.html',
  styleUrls: ['./Financial-tracker.component.css'],
})
export class FinancialTrackerComponent {

    token: any;
    proyectoSelected: Projects | null = null;
    
    FinancialTrackerData: FinancialTracker[] = [];
    totalsFinancial: any = {
      totalAssembly: 0,
      totalApproved: 0,
      totalPlanned: 0,
      totalPaid: 0,
      totalProvisional: 0,
    };
    rpSelected: any;
    rpnumbers: any[] = [];

    LastUpdatePaid!: string;
    LastUpdateProvisional!: string;
    messageProvisionalReport: string = 'This transactional report has not been validated by Finance.';

    loading: boolean = true;

    constructor(
      public _authGuardService: authGuardService,
      readonly serviceObsProject$: ObservableService,
      private MonitoringCatalogService: MonCatalogService,
      private RPcatalogsService: RPCatalogsService,
    ){
      this.token = this._authGuardService.getToken();
      this.observaProjectSelected();
      this.getRPnumber();
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
            // this.rpSelected = this.rpnumbers[0].idrpnumber
        }
      });
    }

    changeRP(){
      if(this.rpSelected){
        this.getFinancialTracker();
      } else {
        this.FinancialTrackerData = [];
        this.totalsFinancial = {
          totalAssembly: 0,
          totalApproved: 0,
          totalPlanned: 0,
          totalPaid: 0,
          totalProvisional: 0,
        };
        this.loading = false;
      }
    }

    getFinancialTracker(){
      this.loading = true;
      this.MonitoringCatalogService.getFinancialTracker(this.rpSelected.join(','), this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.FinancialTrackerData = response.result;
            this.getCatchTotals(); /** OBTIENE TOTALES DE LAS COLUMNAS APPROVED, PLANNED, ACTUAL, PROVISIONAL */
            this.UpdatePaid(); /** OBTIENE LA FECHA DE CORTE DE LA COLUMNA ACTUAL */
            this.UpdateProvisional(); /** OBTIENE LA FECHA DE CORTE DE LA COLUMNA PROVISIONAL, ESTA SE ACTUALIZA A DIARIO */
            this.loading = false;
        } else {
            console.error("No se pudo traer la información de getFinancialTracker", response.message)
        }
      })
    }

    getCatchTotals(){
      this.totalsFinancial.totalAssembly = 0;
      this.totalsFinancial.totalApproved = 0;
      this.totalsFinancial.totalPlanned = 0;
      this.totalsFinancial.totalPaid = 0;
      this.totalsFinancial.totalProvisional = 0;

      if(this.FinancialTrackerData.length > 0) {
        for(let financial of this.FinancialTrackerData) {
          this.totalsFinancial.totalAssembly += financial.Assembly;
          this.totalsFinancial.totalApproved += financial.Approved;
          this.totalsFinancial.totalPlanned += financial.Planned;
          this.totalsFinancial.totalPaid += financial.Paid;
          this.totalsFinancial.totalProvisional += financial.Provisional;
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

    exportFTToExcel() {
      this.MonitoringCatalogService.downloadFTMonitorExcel(this.proyectoSelected?.idprojects ,this.rpSelected.join(','), this.proyectoSelected?.ProjectName, this.token?.access_token)
    }

    exportProvisionalReport() {
      this.MonitoringCatalogService.downloadProvisionalReport(this.proyectoSelected?.Folio_project, this.proyectoSelected?.ProjectName, this.proyectoSelected?.idprojects, this.rpSelected.join(','), this.token?.access_token)
    }
 }
