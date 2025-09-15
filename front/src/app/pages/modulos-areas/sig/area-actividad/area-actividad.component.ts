import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivityArea, Catalogleadsig } from 'src/app/interfaces/CatalgosSig/CtProjectArea/CtprojectArea.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ActivityAreaService } from 'src/app/services/SIG/ProjectArea/activityarea.service';
import { ctprojectareaService } from 'src/app/services/SIG/ProjectArea/ctprojectarea.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { regex } from 'src/app/util/regex';
import { ComponenSigComponent } from '../componen-sig/componen-sig.component';

@Component({
  selector: 'app-area-actividad',
  templateUrl: './area-actividad.component.html',
  styleUrls: ['./area-actividad.component.scss']
})
export class AreaActividadComponent {

  token: any;
  permissions: any[] = [];
  enablebutton: boolean = false;
  /** CATALOG VARIABLES */
  catvalidacion: any[] = [];
  catversionaa: any[] = [];
  proyectoSelected: Projects | null = null;
  ActivitySelected!: ActivityArea;
  public catalogleadsig !: Catalogleadsig[];

  recoInfo!: FormGroup;
  constructor(
    public _authGuardService: authGuardService,
    private fb: FormBuilder,
    private _ctprojectareaService: ctprojectareaService,
    private activityAreaService: ActivityAreaService,
    private readonly serviceObsProject$: ObservableService,
    private messageService: MessageService,
    private _componentSig: ComponenSigComponent
  ){
    this.token = this._authGuardService.getToken();
    
    this.formulario();
    this.fnCtgleadsig();
    this.getvalidacionArea();
    this.getVersionAA();


    this.observaProjectSelected();
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.getactivitiesbyid();
        this.recoInfo.patchValue({IdProject: this.proyectoSelected?.idprojects});
      } else {
      }
    });
  }

  fnCtgleadsig(): void {
    this._ctprojectareaService.fngetCatalogleadsig(this.token?.access_token)
      .subscribe(
        (response: any) => {
          // Verifica si la propiedad 'leadsig' existe en la respuesta
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

  getactivitiesbyid(){
    this.activityAreaService.getactivitiesbyid(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if (response && response.valido == 1) {
        this.ActivitySelected = response.result[0];
        if(this.ActivitySelected) this.activitySelected();
        
      } else {
        console.error("La propiedad 'response' no está presente en los datos recibidos.");
      }
    })
  }


  getvalidacionArea(){
    this.activityAreaService.getvalidacionArea(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.catvalidacion = response.result;
      } else {
        console.error("La propiedad 'statusvalidacion' no está presente en los datos recibidos.");
      }
    })
  }

  getVersionAA(){
    this.activityAreaService.getVersionAA(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.catversionaa = response.result;
      } else {
        console.error("La propiedad 'versionaa' no está presente en los datos recibidos.");
      }
    })
  }

  formulario(){
    this.recoInfo = this.fb.group({
      IdProject: [this.proyectoSelected?.idprojects,[]], 
      IdStatusValidacionAA: ['',[Validators.required]], 
      IdversionAA: ['',[Validators.required]], 
      IdLeadSIG: [''], 
      ObservacionesAA: ['',[Validators.required, Validators.pattern(regex.textarea)]]
    })

    this.validatePermissions();
  }

  validatePermissions(){
    this.permissions = this.token?.permissions;
    if(!this.permissions.find(x=>x.idareas == 1 || x.idareas == 7 || x.idareas == 9)) {
      this.recoInfo.disable();
      this.enablebutton = true;
    }
  }

  activitySelected(){
    this.recoInfo.patchValue({
      IdProject: this.proyectoSelected?.idprojects,
      IdStatusValidacionAA: this.catvalidacion.find(item => item.IdStatusValidacionAA == this.ActivitySelected?.IdStatusValidacionAA)?.IdStatusValidacionAA,
      IdversionAA: this.catversionaa.find(item => item.IdversionAA == this.ActivitySelected?.IdVersionAA)?.IdversionAA,
      // IdLeadSIG: this.catalogleadsig.find(item =>item.IdLeadSIG == this.ActivitySelected?.IdLeadSIG)?.IdLeadSIG,
      ObservacionesAA: this.ActivitySelected?.ObservacionesAA,
    });
  }

  setActivityArea(){
    if(this.recoInfo.valid){

      if(!this._componentSig.LeadSelected){
        return this.messageService.add({ severity: 'error', summary: 'SIG error', detail: 'Please. Select a Lead' });
      }
      this.recoInfo.patchValue({IdLeadSIG: this._componentSig.LeadSelected})

      this.activityAreaService.setactivities(this.recoInfo.value, this.token?.access_token).subscribe((response: any ) => {
        if(response.message === "Se actualizó correctamente"){
          this.messageService.add({ severity: 'success', summary: 'Save succesfully!', detail: response.message });
        } else if (response.message === "Se guardó correctamente") {
          this.messageService.add({ severity: 'success', summary: 'Save succesfully!', detail: response.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Error interno, intentalo más tarde" });
        }
      })
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "All fields is required" });
    }
  }

}
