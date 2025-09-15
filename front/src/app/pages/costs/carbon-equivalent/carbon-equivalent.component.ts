import { Component } from '@angular/core';
// import { CarbonEquivalentCertificates } from 'src/app/interfaces/Costs/costs.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { CostsService } from 'src/app/services/Costs/costs.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-carbon-equivalent',
  templateUrl: './carbon-equivalent.component.html',
  styleUrls: ['./carbon-equivalent.component.scss']
})
export class CarbonEquivalentComponent {
  token: any;
  proyectoSelected: Projects | null = null;
  Costs: any | null = null;

  constructor(private _costsService: CostsService, readonly serviceObsProject$: ObservableService, public _authGuardService: authGuardService){
    this.token = this._authGuardService.getToken();
    this.observaProjectSelected();
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.getCarbonEquivalentCertificates();
      } else {

      }
    });
  }

  getCarbonEquivalentCertificates(){
    this._costsService.getCarbonEquivalentCertificates(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.Costs = response.result[0];
      } else {
          console.error("No se pudo traer la información de getCarbonEquivalentCertificates", response.message)
      }
    })
  }
}
