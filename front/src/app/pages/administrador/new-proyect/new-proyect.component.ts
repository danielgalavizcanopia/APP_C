
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectUsuarioService } from 'src/app/services/newProject/admin.service';
import { UsuarioService } from 'src/app/services/login.service';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { AlertaComponent } from 'src/app/util/alerta.component';
import { Respuesta } from 'src/app/interfaces/Respuesta.interface';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { Subscription } from 'rxjs';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CatalogosService } from 'src/app/services/catalogs/catalogs.service';
import { CatalogoEstados } from 'src/app/interfaces/Catalogos/CtEstados.interface';
import { Aggregation } from 'src/app/interfaces/Catalogos/Ctaggregation.interface';
import { NucleoAgrario } from 'src/app/interfaces/Catalogos/NucleoAgrario.interface';
import { Municipios } from 'src/app/interfaces/Catalogos/CtMuni.interface';
import { RequestProjectUpdate } from 'src/app/services/newProject/requestProjectUpdate.service';
import { N } from '@fullcalendar/core/internal-common';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-new-proyect',
  templateUrl: './new-proyect.component.html',
  styleUrls: ['./new-proyect.component.scss'],
})

export class NewProyectComponent implements OnInit, OnDestroy {
  @ViewChild('dt1') dt1!: Table;
  
  handleGlobalFilter(event: any): void {
    const input = event.target as HTMLInputElement;
    this.dt1.filterGlobal(input.value, 'contains');
  }

  @ViewChild(AlertaComponent, { static: false }) mensajeAlerta!: AlertaComponent;
  Update !: FormGroup;
  public respuesta    !: Respuesta | undefined;
  projects   !: Projects[];
  selectedEstado: string = '';
  isOpen: boolean = false;
  token: any;
  ctNomNuc: any[] = [];
  proyectoSelected: Projects | null = null;
  datoAgrario = '';
  isOpenSubscription !: Subscription;
  txtConsultaMunicipio: string = "Select State";
  municipios: Municipios[] = [];
  nucleoAgrario: NucleoAgrario[] = [];
  public agregation !: Aggregation[];
  public catalogoEstados !: CatalogoEstados[];

  private updateSubscription!: Subscription;

  estadoSelected: any;
  municipioSelected: any;
  agrarioSelected: any;
  constructor(
    private projectusuarioservice: ProjectUsuarioService,
    private _requestProjectUpdate:RequestProjectUpdate,
    private router: Router,
    private usuarioservice: UsuarioService,
    public _authGuardService: authGuardService,
    private readonly serviceObsProject$: ObservableService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private catalogosService: CatalogosService,
    private cdr: ChangeDetectorRef
  ) {
    this.token = this._authGuardService.getToken();
    this.isOpenSubscription = new Subscription(); // Inicialización en el constructor
  }


  ngOnInit() {
    this.getProjectsNew();
    this.getCt_Estados();
    this.getaggregation();
    this.editProject(this.proyectoSelected);
    this.formulario();

    this.updateSubscription = this.serviceObsProject$.catchRefresh$.subscribe(() => {
      this.getProjectsNew();
    });
  }
  selectEstado(idEstado: number): void {
    if (idEstado) {
      this.catalogosService.getMunXestado(idEstado, this.token?.access_token)
        .subscribe(
        ( response: any) => {
            // Verifica si la propiedad 'mulnicipalitys' existe en la respuesta
            if (response && Array.isArray(response.municipios)) {
              this.municipios = response.municipios;
              this.txtConsultaMunicipio = this.municipios.length == 0 ? "Sin registro" : "Select Municipality";
              if(this.proyectoSelected?.Municipio != null){
                this.municipioSelected = this.municipios.find(municipio => municipio.nameMunicipality == this.proyectoSelected?.Municipio);
                this.selectMunicipality(this.municipioSelected?.idmunicipio)
              }
            } else {
              console.error("La propiedad 'results' no está presente en los datos recibidos.");
            }
          },
          error => {
            console.error("Error al obtener results:", error);
          });
    }
  }
  selectMunicipality(idMunicipio: any): void {
    if (idMunicipio) {
      this.catalogosService.getagrarioBymun(idMunicipio, this.token?.access_token)
        .subscribe(
          (response: any) => {
            // Verifica si la propiedad 'NucleoAgrario' existe en la respuesta
            if (response && Array.isArray(response.nucleosag)) {
              this.nucleoAgrario = response.nucleosag;
              if(this.proyectoSelected?.NucleoAgrario){
                this.agrarioSelected = this.nucleoAgrario.find(nucleo => nucleo.NameNuc == this.proyectoSelected?.NucleoAgrario)?.idnucleoAgrario;
              }

              this.txtConsultaMunicipio = this.nucleoAgrario.length == 0 ? "Sin registro" : "Select Agrarian Core";
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


  getCt_Estados() {
    this.catalogosService.getCt_Estados(this.token?.access_token)
      .subscribe(
        (response: any) => {
          // Verifica si la propiedad 'estados' existe en la respuesta
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
    this.catalogosService.getCt_aggregation(this.token?.access_token)
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
  ngOnDestroy() {
    // Desuscribirse del observable para evitar fugas de memoria
    if (this.isOpenSubscription || this.updateSubscription) {
      this.isOpenSubscription.unsubscribe();
      this.updateSubscription.unsubscribe();
    }
  }

  public getProjectsNew() {
    this.projectusuarioservice.getProjectsNew(this.token?.access_token)
      .subscribe(
        (response: any) => {
          // Verifica si la propiedad 'projects' existe en la respuesta
          if (response.projects && Array.isArray(response.projects)) {
            this.projects = response.projects;

            const savedValue = sessionStorage.getItem('selectedOption') || '';
            if(savedValue){
              let projectSelected: any = this.projects.find(x => x.ProjectName == savedValue);
              this.btnSelectedRegister(projectSelected)
            }
          } else {
            console.error("La propiedad 'projects' no está presente en los datos recibidos.");
          }
        },
        error => {
          console.error("Error al obtener proyectos:", error);
        });
  }


  btnSelectedRegister(project: Projects) {
    this.proyectoSelected = project;
    sessionStorage.setItem('selectedOption', project?.ProjectName);
    this.serviceObsProject$.setProject(project);
    sessionStorage.setItem("proyectoSelected", JSON.stringify(this.proyectoSelected));
  }

   onRowSelect(project: Projects) {
    this.btnSelectedRegister(project); // Llamamos a la función btnSelectedRegister con el proyecto seleccionado
  }
  isProjectSelected(project: Projects): boolean {
    return this.proyectoSelected === project;
  }

  formulario() {
    this.Update = this.fb.group({
      idproyectohist: [0],
      idprojects: [''],
      ProjectName: ['',[Validators.required]],
      idaggregation: ['',[Validators.required]],
      Counterpart: ['',[Validators.required]],
      idnucleoAgrario: [''],
      Justification:['',[Validators.required]],

    });
  }
  close() {
    this.proyectoSelected = null;
    this.isOpen = false; // Cerrar el modal
    this.Update.reset();

    this.estadoSelected = null;
    this.municipioSelected = null;
    this.agrarioSelected = null;
  }


  editProject(project: Projects | null) {
    if (project !== null) {
      this.proyectoSelected = project;
      // Encuentra el objeto en this.agregation que coincide con project.idaggregation
      const selectedAggregation = this.agregation.find(item => item.descripcion == this.proyectoSelected?.Aggregation)?.idaggregation;
      
      this.estadoSelected = this.catalogoEstados.find(estado => estado.nomEstado == this.proyectoSelected?.Estado)?.idEstado;

      if (selectedAggregation) {
        this.selectEstado(this.estadoSelected);

        this.Update.patchValue({
          idprojects: project.idprojects,
          ProjectName: project.ProjectName,
          idaggregation: selectedAggregation, // Asigna el objeto de aggregation encontrado
          Counterpart: project.Counterpart,
          idnucleoAgrario: '',
          Justification: ''
        });

    
      } else {
        console.error("No se encontró el objeto de aggregation correspondiente para project.idaggregation:", project.Aggregation);
      }
      this.openModal(true);
    }
  }

  openModal(showModal: boolean) {
    this.isOpen = showModal;
  }
  FnrequestProjectUpdate() {
    // Obtener el ID del proyecto seleccionado
    const idProyecto = this.proyectoSelected ? this.proyectoSelected.idprojects : '';
  
    // Asignar el ID del proyecto seleccionado al campo idprojects dentro de this.Update.value
    this.Update.patchValue({ idprojects: idProyecto });
  
    // Llamar a updateNewProject() con this.Update.value
    this._requestProjectUpdate.updateNewProject(this.Update.value, this.token.access_token).subscribe({
      next: (respuesta) => {
        const message = respuesta ? 'Muy bien! se ha guardado correctamente' : 'Error desconocido';
        const severity = respuesta ? 'success' : 'error';
        this.messageService.add({ severity, summary: message, detail: '' });
        this.close();
      },
      error: (error) => {
        const errorMessage = (error?.error?.error || 'Error desconocido') + '. Hubo un error al enviar datos al servidor.';
        this.mensajeAlerta.error("Error", "", errorMessage, "");
      }
    });
  }
  

}
