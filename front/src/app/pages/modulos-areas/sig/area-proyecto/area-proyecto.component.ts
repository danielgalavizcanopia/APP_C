import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CatalogRequestalRan, Catalogcertificacion, Catalogleadsig, Catalogstatusvalidacionap } from 'src/app/interfaces/CatalgosSig/CtProjectArea/CtprojectArea.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ctprojectareaService } from 'src/app/services/SIG/ProjectArea/ctprojectarea.service';
import { ProjectAreaService } from 'src/app/services/SIG/ProjectArea/projectarea.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ValidatorsService, decimalValidator, validaSoloNumeros, validarLink, TextareaPatternValidator, yearValidator } from 'src/app/services/validators/validators.service';
import { AlertaComponent } from 'src/app/util/alerta.component';
import { regex } from 'src/app/util/regex';
import { ComponenSigComponent } from '../componen-sig/componen-sig.component';
import { AreaProyecto } from 'src/app/interfaces/SIG/sig.interface';


@Component({
  selector: 'app-area-proyecto',
  templateUrl: './area-proyecto.component.html',
  styleUrls: ['./area-proyecto.component.scss']
})
export class AreaProyectoComponent {
  @ViewChild(AlertaComponent, { static: false }) mensajeAlerta!: AlertaComponent;
  token: any;
  permissions: any[] = [];
  enablebutton: boolean = false;
  recoInfo !: FormGroup;
  ProjectAreaSelected!: AreaProyecto;
  proyectoSelected: Projects | null = null;
  projectHistory!: any[];
  buttonLabel: string = "Create";
 
  public catalogRequestalRan !: CatalogRequestalRan[];
  public catalogcertificacion !: Catalogcertificacion[];
  public catalogstatusvalidacionap !: Catalogstatusvalidacionap[];
  public catalogleadsig !: Catalogleadsig[];
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private _ctprojectareaService: ctprojectareaService,
    public _authGuardService: authGuardService,
    private projectAreaService: ProjectAreaService,
    private validatorService:ValidatorsService,
    private readonly serviceObsProject$: ObservableService,
    private _componentSig: ComponenSigComponent
    ) {
    this.token = this._authGuardService.getToken();
    this.formularioProjectArea();
    this.fnCtgleadsig();
    this.fnCertificacion();
    this.fnStatusvalidnap();
    this.fnCtRan();

     // PARA OBTENER ID DE PROYECTO
    this.observaProjectSelected();
  }

  /** CAPTURA ID DEL PROYECTO SELECCIONADO -- OBSERVABLE */
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

  getViewProjectArea(){
    this._ctprojectareaService.getViewProjectArea(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if (response) {
        this.ProjectAreaSelected = response.result[0];
        if(this.ProjectAreaSelected){
          this.recoInfo.reset();
          this.buttonLabel = "Edit"
          this.projectAreaSelected();
          this.getviewbyidhist();
        }
      } else {
        console.error("La propiedad 'response' no está presente en los datos recibidos.");
      }
    })
  }

  /** HISTORIAL DE AREA DE PROYECTOS */
  getviewbyidhist(){
    this._ctprojectareaService.getviewbyidhist(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if (response && response.valido == 1) {
        this.projectHistory = response.result;
      } else {
        this.projectHistory = [];
        console.error("La propiedad 'response' no está presente en los datos recibidos.");
      }
    })
  }


  formularioProjectArea() {
    this.recoInfo = this.fb.group({
      IdProject:[this.proyectoSelected?.idprojects],
      Idcertificacion:['', [Validators.required]],
      SuperficieTotalPhina:['',[decimalValidator]],
      Achurado:['',[validaSoloNumeros, decimalValidator]],
      Expopriado:['',[validaSoloNumeros, decimalValidator]],
      LinkPHINA:['', [Validators.pattern(regex.link2)]],
      SuperficieTotal:['',[validaSoloNumeros, decimalValidator]],
      IdsolicitudRAN:['', [Validators.required]],
      SuperficiePlanoInterno:['',[validaSoloNumeros, decimalValidator]],
      AreasExpropiadas:['',[validaSoloNumeros, decimalValidator]],
      AñodelPlan:['',[yearValidator]],
      LinkPlanoInterno:[''],
      IdStatusValidacionAP:['',[Validators.required]],
      ObservacionesAP:['',[TextareaPatternValidator]],
      LinkAP:['',[]],
      IdLeadSIG:[''],
    });

    this.validatePermissions()
    
  }

  validatePermissions(){
    this.permissions = this.token?.permissions;
    if(!this.permissions.find(x=>x.idareas == 1 || x.idareas == 7 || x.idareas == 9)) {
      this.recoInfo.disable();
      this.enablebutton = true;
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.recoInfo.controls;
  }
  
  isFieldInvalidAndTouched(fieldName: string): boolean | null {
    const control = this.recoInfo.get(fieldName);
    return control && control.invalid && control.touched ? true : null;
  }


  fnCertificacion(): void {
    this._ctprojectareaService.fnctCertificacion(this.token?.access_token).subscribe(
        (response: any) => {
          // Verifica si la propiedad 'catCer' existe en la respuesta
          if (response.result && Array.isArray(response.result)) {
            this.catalogcertificacion = response.result;
          } else {
            console.error("La propiedad 'catCer' no está presente en los datos recibidos.");
          }
        },
        error => {
          console.error("Error al obtener catCer:", error);
        });
  }
  fnStatusvalidnap(): void {
    this._ctprojectareaService.fngetctstatusvalidnap(this.token?.access_token).subscribe(
        (response: any) => {
          // Verifica si la propiedad 'catValidnap' existe en la respuesta
          if (response.result && Array.isArray(response.result)) {
            this.catalogstatusvalidacionap = response.result;
          } else {
            console.error("La propiedad 'catValidnap' no está presente en los datos recibidos.");
          }
        },
        error => {
          console.error("Error al obtener catValidnap:", error);
        });
  }
  fnCtRan(): void {
    this._ctprojectareaService.fncatRan(this.token?.access_token).subscribe((response: any) => {
          // Verifica si la propiedad 'catRan' existe en la respuesta
          if (response.result && Array.isArray(response.result)) {
            this.catalogRequestalRan = response.result;
          } else {
            console.error("La propiedad 'catRan' no está presente en los datos recibidos.");
          }
        },
        error => {
          console.error("Error al obtener catRan:", error);
        });
  }
  fnCtgleadsig(): void {
    this._ctprojectareaService.fngetCatalogleadsig(this.token?.access_token).subscribe((response: any) => {
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

  addNewProjectArea() {
    
    this.recoInfo.patchValue({IdLeadSIG: this._componentSig.LeadSelected})
    if(this.recoInfo.valid){
      this.projectAreaService.fnSaveProjectArea(this.recoInfo.value).subscribe({
        next: (respuesta) => {
          if (respuesta && respuesta.message) {
            this.messageService.add({ severity: 'success', summary: 'Save succesfully!', detail: respuesta.message });
          }
        },
        error: (error) => {
          if (error && error.error) {
            if (error.error.error) {
              this.mensajeAlerta.error("Error", "", error.error.error, "");
            } else {
              const errorMessage = error.error.error || error.error.message[0] || 'Error desconocido'; // Obtener el mensaje de error del objeto de error
              this.mensajeAlerta.error("Error", "", errorMessage, "");
            }
          } else {
            console.error('Error al enviar datos al backend:', error);
            alert('Hubo un error al enviar datos al servidor');
          }
        }
      });
      Object.keys(this.recoInfo.controls).forEach(controlName => {
        const control = this.recoInfo.get(controlName);
        control?.setErrors(null);
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'All fields is required' });
    }
  }

  updateProjectArea() {
    if(this.recoInfo.valid){

      if(!this._componentSig.LeadSelected){
        return this.messageService.add({ severity: 'error', summary: 'SIG error', detail: 'Please. Select a Lead' });
      }

      let dataUpdate = {
          idAreaProyecto: this.ProjectAreaSelected ? this.ProjectAreaSelected.IdAreaDeProyecto : 0,
          IdProject: this.proyectoSelected?.idprojects,
          idCertificacionUpdate: this.recoInfo.value.Idcertificacion, 
          superficieTotalPhinaToUpdate: this.recoInfo.value.SuperficieTotalPhina, 
          achuradoToUpdate: this.recoInfo.value.Achurado , 
          expopriadoToUpdate: this.recoInfo.value.Expopriado, 
          linkPHINAToUpdate: this.recoInfo.value.LinkPHINA, 
          superficieTotalUpdate: this.recoInfo.value.SuperficieTotal, 
          idsolicitudRANUpdate: this.recoInfo.value.IdsolicitudRAN, 
          superficiePlanoInternoUpdate: this.recoInfo.value.SuperficiePlanoInterno, 
          areasExpropiadasUpdate: this.recoInfo.value.AreasExpropiadas, 
          añoDelPlanUpdate: new Date(this.recoInfo.value.AñodelPlan).getFullYear(), 
          linkPlanoInternoUpdate: this.recoInfo.value.LinkPlanoInterno, 
          idStatusValidacionAPUpdate: this.recoInfo.value.IdStatusValidacionAP, 
          observacionesAPUpdate: this.recoInfo.value.ObservacionesAP, 
          linkAPUpdate: this.recoInfo.value.LinkAP, 
          idLeadSIGUpdate: this._componentSig.LeadSelected, 
          usuarioQueRealizaElCambio: 1
      }

      this.projectAreaService.fnSaveProjectArea(dataUpdate, this.token?.access_token).subscribe({
        next: (respuesta) => {
          if (respuesta && respuesta.result) {
            this.messageService.add({ severity: 'success', summary: 'Save succesfully!', detail: respuesta.result });
            this.getViewProjectArea();
          }
        },
        error: (error) => {
          if (error && error.error) {
            if (error.error.error) {
              this.mensajeAlerta.error("Error", "", error.error.error, "");
            } else {
              const errorMessage = error.error.error || error.error.message[0] || 'Error desconocido'; // Obtener el mensaje de error del objeto de error
              this.mensajeAlerta.error("Error", "", errorMessage, "");
            }
          } else {
            console.error('Error al enviar datos al backend:', error);
            alert('Hubo un error al enviar datos al servidor');
          }
        }
      });
      this.recoInfo.reset();
      Object.keys(this.recoInfo.controls).forEach(controlName => {
        const control = this.recoInfo.get(controlName);
        control?.setErrors(null);
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'All fields is required' });
      console.log(this.recoInfo.controls);
      
    }
  }

  projectAreaSelected(){
    this.recoInfo.patchValue({
      IdProject: this.ProjectAreaSelected?.IdProject,
      Idcertificacion: this.ProjectAreaSelected.Idcertificacion,//this.catalogcertificacion.find(item => item.Certificacion == this.ProjectAreaSelected?.Certificacion)?.Idcertificacion,
      SuperficieTotalPhina: this.ProjectAreaSelected?.SuperficieTotalPhina,
      Achurado: this.ProjectAreaSelected?.Achurado,
      Expopriado: this.ProjectAreaSelected?.Expopriado,
      LinkPHINA: this.ProjectAreaSelected?.LinkPHINA,
      SuperficieTotal: this.ProjectAreaSelected?.SuperficieTotal,
      IdsolicitudRAN: this.ProjectAreaSelected.IdsolicitudRAN,//this.catalogRequestalRan.find(item =>item.SolictiudalRAM == this.ProjectAreaSelected?.SolictiudalRAM)?.IdsolicitudRAN,
      SuperficiePlanoInterno: this.ProjectAreaSelected?.SuperficiePlanoInterno,
      AreasExpropiadas: this.ProjectAreaSelected?.AreasExpropiadas,
      AñodelPlan: new Date(this.ProjectAreaSelected?.AnodelPlan),
      LinkPlanoInterno: this.ProjectAreaSelected?.LinkPlanoInterno,
      IdStatusValidacionAP: this.ProjectAreaSelected.IdStatusValidacionAP,//this.catalogstatusvalidacionap.find(item => item.StatusValicionAP == this.ProjectAreaSelected?.IdStatusValidacionAP)?.IdStatusValidacionAP,
      ObservacionesAP: this.ProjectAreaSelected?.ObservacionesAP,
      LinkAP: this.ProjectAreaSelected?.LinkAP,
      // IdLeadSIG: this.catalogleadsig.find(item =>item.LeadSIG == this.ProjectAreaSelected?.LeadSIG)?.IdLeadSIG,
    });

    this.serviceObsProject$.setcatch(this.recoInfo.get('IdStatusValidacionAP')?.value)

  }
}
