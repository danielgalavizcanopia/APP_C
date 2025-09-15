import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivityDetailsByOds } from 'src/app/interfaces/dashboards/dashbboards.interfaces';
import { DashboarProjectDetailService } from 'src/app/services/dashboards/dashboarProjectDetail.service';
import { ImplementacionService } from 'src/app/services/Implementacion/Implementacion.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'activity-detail',
  templateUrl: './ActivityDetail.component.html',
  styleUrls: ['./ActivityDetail.component.css'],
})
export class ActivityDetailComponent {
  token: any;

  url: string = environment.url;
  
  indicadoresCuantitativos: { [key: number]: string } = {}; 
  reporteo: { [key: number]: string } = {}; 
  
  visible!: boolean;
  loading: boolean = true;
  activity!: ActivityDetailsByOds;

  openModal(showModal: boolean, idactivitydata: number){
    this.visible = showModal;
    this.getActivityDetailByOdsAndProject(idactivitydata);
  }

  onHide(){
    this.visible = false;
    this.activity = undefined!;
    this.loading = true;
  }

  constructor(
    readonly serviceObsProject$: ObservableService,
    public _authGuardService: authGuardService,
    private productService: ProductService,
    private _implementacionService: ImplementacionService,  
    private dashboardsService: DashboarProjectDetailService
  ){
    this.token = this._authGuardService.getToken();
  }

  getActivityDetailByOdsAndProject(IdActividaddata: number){
    this.dashboardsService.getActivityDetailByOdsAndProject(IdActividaddata, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.activity = response.result[0];
          this.getIndicadoresCuantitativosByActividad(IdActividaddata);
          this.getReporteoByActividad(IdActividaddata);
          this.loading = false;
      } else {
          console.error("No se pudo traer la información de getTopODSByProject", response.message)
      }
    })
  }

  getIndicadoresCuantitativosByActividad(idActividad: number) {
    if (!this.indicadoresCuantitativos[idActividad]) {
      this._implementacionService.getIndicadoresCuantitativosByActividad(idActividad, this.token.access_token).subscribe((resp: any) => {
        if (resp.valido == 1) {
          this.indicadoresCuantitativos[idActividad] = resp.result.map((item: any) => `<li><strong>${item.nombreCuantitativo}:</strong> ${item.estimado}</li>`).join('');
        }
      });
    }
  }

  getReporteoByActividad(idActividad: number): any{
    if (!this.reporteo[idActividad]) {
      this._implementacionService.getReporteoByActividad(idActividad, this.token.access_token).subscribe((resp: any) => {
        if(resp.valido == 1){
          this.reporteo[idActividad] = resp.result.map((item: any) => `
          <div class="flex justify-content-between">
            <div>${item.ReportingQuien}</div>
            <div>${item.ReportingComo}</div>
            <div>${item.ReportingCuando.split('T')[0]}</div>
          </div>
          `
        ).join('');
        }
      });
    }
  }


  
}
