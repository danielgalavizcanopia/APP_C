import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { Router } from '@angular/router';
import { Catalogleadsig } from 'src/app/interfaces/CatalgosSig/CtProjectArea/CtprojectArea.interface';
import { ctprojectareaService } from 'src/app/services/SIG/ProjectArea/ctprojectarea.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';

@Component({
  selector: 'app-componen-sig',
  templateUrl: './componen-sig.component.html',
  styleUrls: ['./componen-sig.component.scss']
})
export class ComponenSigComponent {
  showProjectArea = false;
  showActivityArea = false;
  showPed = false;
  token: any;
  proyectoSelected: Projects | null = null;
  public catalogleadsig !: Catalogleadsig[];
  public LeadSelected!: Catalogleadsig;
    
    
  constructor(private router: Router, private _ctprojectareaService: ctprojectareaService,public _authGuardService: authGuardService, private readonly serviceObsProject$: ObservableService,) { 
    this.token = this._authGuardService.getToken();
    this.fnCtgleadsig();

    this.observaProjectSelected();
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
      this.getViewProjectArea();
      } else {
      }
    });
  }

  fnCtgleadsig(): void {
    this._ctprojectareaService.fngetCatalogleadsig(this.token?.access_token).subscribe((response: any) => {
          if (response.result && Array.isArray(response.result)) {
            this.catalogleadsig = response.result;
          } else {
            console.error("La propiedad 'leadsig' no está presente en los datos recibidos.");
          }
        },
        error => {
          console.error("Error al obtener leadsig:", error);
        });
  }

  getViewProjectArea(){
    this._ctprojectareaService.getViewProjectArea(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response){
        let AreaProject = response.result[0]
        if(AreaProject) this.LeadSelected = AreaProject.IdLeadSIG
      } else {
        console.error("La propiedad 'response' no está presente en los datos recibidos.");
      }
    })
  }

}
