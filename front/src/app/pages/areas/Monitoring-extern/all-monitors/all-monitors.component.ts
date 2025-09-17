import { Component } from '@angular/core';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-all-monitors',
  templateUrl: './all-monitors.component.html',
  styleUrls: ['./all-monitors.component.scss']
})
export class AllMonitorsComponent {

  TypeView: number = 2;
  token: any;
  proyectoSelected: Projects | null = null;
  rpSelected: any;
  
  constructor(
    public _authGuardService: authGuardService, 
    readonly serviceObsProject$: ObservableService,
    private MonitoringCatalogService: MonCatalogService,
  ){
    this.token = this._authGuardService.getToken();

    this.observaProjectSelected();
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
      } else {

      }
    });
  }

  recibir(valor: string) {
    this.rpSelected = valor;
  }

  exportFullReportXLSX(){
    this.MonitoringCatalogService.downloadFullFinancialReport(this.proyectoSelected?.idprojects ,this.rpSelected, this.proyectoSelected?.ProjectName, this.token?.access_token)
  }
}
