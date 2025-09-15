import { Component } from '@angular/core';
import { ByTransaction } from 'src/app/interfaces/Monitor/SummaryActivities.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { CustomerService } from 'src/app/services/customer.service';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-by-transaction',
  templateUrl: './by-transaction.component.html',
  styleUrls: ['./by-transaction.component.scss']
})
export class ByTransactionComponent {
    token: any;
    proyectoSelected: Projects | null = null;

    rpnumbers: any[] = [];
    rpSelected: any;
    loading: boolean = true;

    byTransactionData: ByTransaction[] = [];
    totalAmount: number = 0;
    
    constructor(
        private MonitoringCatalogService: MonCatalogService,
        public _authGuardService: authGuardService,
        readonly serviceObsProject$: ObservableService,
        private RPcatalogsService: RPCatalogsService,
    ) {
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
      this.RPcatalogsService.getRPnumber(this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1){
            this.rpnumbers = resp.result;
        }
      });
    }

    getTransactionTracker(){
      this.loading = true;
      this.MonitoringCatalogService.getTransactionTracker(this.rpSelected.join(','), this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.byTransactionData = response.result;
            this.loading = false;
            this.totalAmount = 0;
            for(let transaction of this.byTransactionData){
                this.totalAmount += transaction.total;
            }
        } else {
            console.error("No se pudo traer la información de getTransactionTracker", response.message)
        }
      })
    }

    changeRP(){
      if(this.rpSelected){
          this.getTransactionTracker();
        } else {
          this.loading = false;
        }
    }

    exportByTransactionExcel() {
      this.MonitoringCatalogService.downloadTransactionMonitor(this.proyectoSelected?.idprojects ,this.rpSelected.join(','), this.proyectoSelected?.ProjectName, this.token?.access_token)
    }
}

