import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { CustomerService } from 'src/app/services/customer.service';
import { UsuarioService } from 'src/app/services/login.service';
import { ProjectUsuarioService } from 'src/app/services/newProject/admin.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';


interface City {
  name: string;
  code: string;
}


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent {
  token: any;
  proyectoSelected: Projects | null = null;
  isSelectedProject: boolean = false;

  constructor( 
    readonly serviceObsProject$: ObservableService,
    public _authGuardService: authGuardService
  ) {
    this.token = this._authGuardService.getToken();
    this.observaProjectSelected();

  }

    observaProjectSelected() {
      /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
      this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
        if(project){
          this.proyectoSelected = project;
          this.isSelectedProject = true;
        } else {
          this.proyectoSelected = null;
          this.isSelectedProject = false;
        }
      });
    }

}
