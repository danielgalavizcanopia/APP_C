import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProjectUsuarioService } from '../services/newProject/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Projects } from '../interfaces/Portafolio/NewProject/Newproject.interface';
import { NucleoAgrario } from '../interfaces/Catalogos/NucleoAgrario.interface';
import { Municipios } from '../interfaces/Catalogos/CtMuni.interface';
import { CatalogosService } from '../services/catalogs/catalogs.service';
import { Aggregation } from '../interfaces/Catalogos/Ctaggregation.interface';
import { CatalogoEstados } from '../interfaces/Catalogos/CtEstados.interface';
import { AlertaComponent } from '../util/alerta.component';
import { authGuardService } from '../services/Secret/auth-guard.service';
import { regex } from '../util/regex';
import { NewProyectComponent } from '../pages/administrador/new-proyect/new-proyect.component'
import { ObservableService } from '../services/Observables/observableProject.service';
import { AppTopbarComponent } from '../shared/administrador/topbar/app.topbar.component';

@Component({
  selector: 'app-modal-new-project',
  templateUrl: './modal-new-project.component.html',
  styleUrls: ['./modal-new-project.component.scss']
})
export class ModalNewProjectComponent  implements OnInit{
  @ViewChild(AlertaComponent, { static: false }) mensajeAlerta!: AlertaComponent;
  projects   !: Projects[];
  isOpen: boolean = false;
  recoInfo !: FormGroup;
  municipios: Municipios[] = [];
  nucleoAgrario: NucleoAgrario[] = [];
  txtConsultaMunicipio: string = "Selecciona una opciòn";
  openModalNewP : boolean =  false;
  datoAgrario = '';
  token: any;

  municipality: any
  public agregation !: Aggregation[];
  public catalogoEstados !: CatalogoEstados[];
  constructor(
    private messageService: MessageService,
    private projectusuarioservice: ProjectUsuarioService,
    private fb: FormBuilder,
    private catalogosService: CatalogosService,
    public _authGuardService: authGuardService,
    public _NewProyectC: NewProyectComponent,
    public _NewProjectTopbar: AppTopbarComponent,
    private readonly serviceObsProject$: ObservableService,

    ){

    this.token = this._authGuardService.getToken();

    }

  ngOnInit(): void {
 
      this.formulario();
      this.getCt_Estados();
      this.getaggregation();
  }


    formulario() {
      this.recoInfo = this.fb.group({
        ProjectName: ['',[Validators.required, Validators.pattern(regex.withoutMoretwoSpaces)]],
        idaggregation: ['',[Validators.required]],
        Counterpart: ['Pending',[Validators.required, Validators.pattern(regex.withoutMoretwoSpaces)]],
        idnucleoAgrario: [''] 
      });
    }


    addNewProject() {
      if(this.recoInfo.valid){
        this.projectusuarioservice.saveNewProject(this.recoInfo.value, this.token.access_token).subscribe({
          next: (respuesta) => {
            this._NewProyectC.getProjectsNew();
            this._NewProjectTopbar.getProjects();
            if (respuesta && respuesta.message) {
              this.serviceObsProject$.setValidation();
              this.messageService.add({ severity: 'success', summary: 'Success!', detail: "Project Save Succesfully" });
              this.closeModalFromComponent();
            } else {
              this.mensajeAlerta.error("Error", "", "Error desconocido", "");
            }
          },
          error: (error) => {
            if (error && error.error) {
              if (error.error.error) {
                this.mensajeAlerta.error("Error", "", error.error.error, "");
              } else {
                const errorMessage = error.error.error || 'Error desconocido'; // Obtener el mensaje de error del objeto de error
                this.mensajeAlerta.error("Error", "", errorMessage, "");
              }
            } else {
              console.error('Error al enviar datos al backend:', error);
              alert('Hubo un error al enviar datos al servidor');
            }
          }
        });
      } else {
        this.mensajeAlerta.error("Error", "", "All fields is required", "");
      }
    }
    


  closeModalFromComponent() {
    this.recoInfo.reset();
    this.openModalNewP = false;
  }

  selectEstado(idEstado: number): void {
    if (idEstado) {
      this.catalogosService.getMunXestado(idEstado, this.token.access_token)
        .subscribe(
          (response: any) => {
            // Verifica si la propiedad 'mulnicipalitys' existe en la respuesta
            if (response && Array.isArray(response.municipios)) {
              this.municipios = response.municipios;
              this.txtConsultaMunicipio = this.municipios.length == 0 ? "Sin registro" : "Seleccione un Registro";
            } else {
              console.error("La propiedad 'results' no está presente en los datos recibidos.");
            }
          },
          error => {
            console.error("Error al obtener results:", error);
          });
    }
  }
  selectMunicipality(idMunicipio: number): void {
    if (idMunicipio) {
      this.catalogosService.getagrarioBymun(idMunicipio, this.token.access_token)
        .subscribe(
          (response: any) => {
            // Verifica si la propiedad 'NucleoAgrario' existe en la respuesta
            if (response && Array.isArray(response.nucleosag)) {
              this.nucleoAgrario = response.nucleosag;
              this.txtConsultaMunicipio = this.nucleoAgrario.length == 0 ? "Sin registro" : "Seleccione un Registro";
            } else {
              console.error("La propiedad 'results' no está presente en los datos recibidos.");
            }
          },
          error => {
            console.error("Error al obtener results:", error);
          });
    }
  }
  nucleoAgrarioFilter(idnucleoAgrario: number): void {
    if (idnucleoAgrario) {
      let datoFiltrado = new Array();
      datoFiltrado = this.nucleoAgrario.filter(dato => {
        return dato.idnucleoAgrario == idnucleoAgrario;

      })
      this.datoAgrario = datoFiltrado[0].descripcion;
    }
  }

   
  getCt_Estados(): void {
    this.catalogosService.getCt_Estados(this.token.access_token)
      .subscribe(
        (response: any) => {
          // Verifica si la propiedad 'estados' existe en la respuest
          if (response.estados && Array.isArray(response.estados)) {
            this.catalogoEstados = response.estados;
          } else {
            console.error("La propiedad 'estados' no está presente en los datos recibidos.");
          }
        },
        error => {
          console.error("Error al obtener estados:", error);
        });
  }
  getaggregation(): void {
    this.catalogosService.getCt_aggregation(this.token.access_token)
      .subscribe(
        (response: any) => {
          // Verifica si la propiedad 'aggregation' existe en la respuesta
          if (response.aggregation && Array.isArray(response.aggregation)) {
            this.agregation = response.aggregation;
          } else {
            console.error("La propiedad 'aggregation' no está presente en los datos recibidos.");
          }
        },
        error => {
          console.error("Error al obtener aggregation:", error);
        });
  }


  openModalNewProject(showModal : boolean){
    this.openModalNewP = showModal;
  }
}
