import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CtNotifyAll } from 'src/app/interfaces/Catalogos/Request/CtnotifyAll.interface';
import { CtPendientes } from 'src/app/services/Notify/ctPendientes.service';
import { ProjectUsuarioService } from 'src/app/services/newProject/admin.service';
import { RequestProjectUpdate } from 'src/app/services/newProject/requestProjectUpdate.service';
import { Notification } from 'src/app/interfaces/Catalogos/Request/NotifyDetall.interface';
import { ProjectDetaillByid } from 'src/app/interfaces/InterfacesDetalladas/Projectdetaillbyid.interface';
import { StateandmunByagrario } from 'src/app/interfaces/InterfacesDetalladas/StateandmunByagrario.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaComponent } from 'src/app/util/alerta.component';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { UpdateProjects } from 'src/app/interfaces/Portafolio/NewProject/UpdateNewProject.interface';
import { Observable } from 'rxjs';
import { CatalogosService } from 'src/app/services/catalogs/catalogs.service';
import { Aggregation } from 'src/app/interfaces/Catalogos/Ctaggregation.interface';

@Component({
  selector: 'app-newproject-update',
  templateUrl: './newproject-update.component.html',
  styleUrls: ['./newproject-update.component.scss'],
  providers: [MessageService]
})
export class NewprojectUpdateComponent {
  @ViewChild(AlertaComponent, { static: false }) mensajeAlerta!: AlertaComponent;
  notification!: Notification;
  projectDetaillByid!: ProjectDetaillByid;
  ExistProjectDetail: boolean = false;
  ctNotifyAll: CtNotifyAll[] = [];
  updateProjects: UpdateProjects[] = [];
  Projects !: any[];
  notificationsCount = 0;
  notificacionesOrderList: CtNotifyAll[] = [];
  public displayDialog: boolean = false;
  stateandmunByagrario!: StateandmunByagrario;
  datoNucleoAgrario ?: number;
  recoInfo !: FormGroup;
  public position: string = 'top right';
  public agregation !: Aggregation[];
  disablebutton: boolean = false;
  projectJustification: string = '';

  token: any;
  constructor(
    private ctPendientes: CtPendientes,
    private messageService: MessageService,
    private requestProjectUpdate: RequestProjectUpdate,
    private router: Router, private projectUsuarioService: ProjectUsuarioService,
    private fb: FormBuilder,
    public _authGuardService: authGuardService,
    private catalogosService: CatalogosService,
    ) {
      this.token = this._authGuardService.getToken();
      this.projectUsuarioService.getProjectsNew(this.token.access_token).subscribe((files) => {
      this.Projects = files; // Asignar los archivos al array Projects cuando se complete la operación
    });
  }
  ngOnInit() {
    this.FnnotifypendientesAndOrderList();
    this.getaggregation();
    this.formulario();
    this.getNotifications();
  }
  async FnnotifypendientesAndOrderList() {
    await this.Fnnotifypendientes();
    await this.FnOrderListNotificaciones();
    await this.getOrderListNotificaciones();
  }
  
  formulario() {
      this.recoInfo = this.fb.group({
        ProjectName: ['', Validators.required], 
        idaggregation: [this.projectDetaillByid?.idaggregation || '', Validators.required],
        Counterpart: [''],
        idnucleoAgrario: [this.projectDetaillByid?.idnucleoAgrario || '', Validators.required],
        nomEstado: [''],
        nameMunicipality: [''],
        NameNuc: [''],
        descripcion: [''],
        Justification: [''],

        status:[]
      });
  
    }
   
  UpdateInsertAceptrequest(idprojects: number, status: number) {
    // Llamar a sendPutRequest con los datos necesarios
    this.recoInfo.patchValue({
      ProjectName: this.projectDetaillByid?.ProjectName, 
      idaggregation: this.projectDetaillByid?.idaggregation,
      Counterpart:this.projectDetaillByid?.Counterpart,
      idnucleoAgrario:this.projectDetaillByid?.idnucleoAgrario,
      status: status})
    this.requestProjectUpdate.sendPutRequest(this.recoInfo.value, this.projectDetaillByid.idprojects, this.token.access_token).subscribe({
      next: (respuesta) => {
        if (respuesta && respuesta.message) {
          this.getNotifications();
          this.obtenerNotificaciones()
          this.messageService.add({ severity: 'success', summary: '¡Muy bien! se ha actualizado correctamente', detail: respuesta.message });
          this.ExistProjectDetail = false;
        } else {
          this.messageService.add({ severity: 'success', summary: '¡Muy bien! se ha actualizado correctamente', detail: respuesta.message });
        }
      }
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
  
  async obtenerNotificaciones(): Promise<CtNotifyAll[]> {
    try {
      const response = await this.ctPendientes.FnCtAllStatus(this.token.access_token).toPromise();
      if (response && Array.isArray(response)) {
        return response;
      } else {
        throw new Error('La respuesta no es un array válido');
      }
    } catch (error) {
      throw error;
    }
  }

  getNotifications(){
    this.ctPendientes.FnCtAllStatus(this.token.access_token).subscribe((response: any)=>{
      this.ctNotifyAll = response.allNotifications;
    });
  }

  async Fnnotifypendientes(): Promise<void> {
    try {
      const response = await this.obtenerNotificaciones();
      this.ctNotifyAll = response;
      this.notificationsCount = this.ctNotifyAll.length;
      this.notificacionesOrderList = this.ctNotifyAll.map((notify) => {
        return {
          idproyectohist: notify.idproyectohist,
          statusauthorization: notify.statusauthorization,
          severity: 'info', // You can change the severity based on your needs
          summary: notify.ProjectName || 'Unknown',
          detail: notify.idproyectohist.toString(), // Convertir a cadena si es necesario
          icon: 'pi pi-bell'
        };
      });
    } catch (error) {
      console.error("Error al obtener pendientes notificaciones:", error);
    }
  }
  FnOrderListNotificaciones(): Observable<string> {
    return new Observable<string>((observer) => {
    this.ctPendientes.FnCtpendientes(this.token?.access_token).subscribe((idproyectohist: any) => {
      this.notification = idproyectohist;
      const projectName = this.notification?.ProjectName || 'Unknown';
        observer.next(projectName);
        observer.complete();
      });
    });
  }

  getOrderListNotificaciones(): Observable<string> {
    return new Observable<string>((observer) => {
      this.ctPendientes.FnCtpendientes(this.token?.access_token).subscribe((idproyectohist: any) => {
        this.notification = idproyectohist;
        const projectName = this.notification?.ProjectName || 'Unknown';
          observer.next(projectName);
          observer.complete();
        });
      });
  }

  selectSolicitud(p_idproyectohist: number): Promise<number | null> {
    return new Promise<number | null>((resolve, reject) => {
      if (p_idproyectohist) {
        this.requestProjectUpdate.FnDetailRequest(p_idproyectohist, this.token?.access_token)
          .subscribe(
            (response: any) => {
              let projectSelected = response.project[0]
              this.recoInfo.patchValue({
                ProjectName: projectSelected.ProjectName || '',
                idaggregation: this.agregation.find(item => item.descripcion == projectSelected.Aggregation)?.idaggregation || '',
                Counterpart: projectSelected.Counterpart || '',
                idnucleoAgrario: projectSelected.idnucleoAgrario || '',
              });
              if (response && Array.isArray(response.project)) {
                this.FnObtenerMunState(projectSelected.idnucleoAgrario);
                this.notification = response.project[0];
                resolve(projectSelected.idnucleoAgrario);
              } else {
                console.error("La respuesta no es un array válido de notificaciones.");
                resolve(null);
              }
            },
            error => {
              console.error("Error al obtener setprojecthist:", error);
              reject(error);
            });
      } else {
        reject("p_idproyectohist no válido");
      }
    });
  }
  async ProjectByidDetaill(idprojects: number): Promise<void> {
    try {
      if (idprojects) {
        await this.projectUsuarioService.FngetDetaillProject(idprojects, this.token?.access_token).subscribe(async (response: any) =>{
          if (response.valido == 1) {
            this.projectDetaillByid = response.project[0];
            this.ExistProjectDetail = true;
          } else {
            console.error("La respuesta no es un array válido de notificaciones.");
          }
        });
      }
    } catch (error) {
      console.error("Error al obtener detalles del proyecto:", error);
    }
  }
  FnObtenerMunState(idnucleoAgrario: number){
    this.requestProjectUpdate.Fnstatemunbyagrario(idnucleoAgrario, this.token?.access_token)
      .subscribe(
        (response: any) => {
         
          this.stateandmunByagrario = response.project[0];
        },
        error => {
          console.error("Error al obtener FnObtenerMunState:", error);
        }
      );
  }
  async handleNotificationClick(notifi: any) {
    this.projectJustification = notifi.Justification
    this.ProjectByidDetaill(notifi.idprojects);
    if(notifi.idstatusauthorization == 1) this.disablebutton = true;
    else this.disablebutton = false
    try {
      const idnucleoAgrario = await this.selectSolicitud(notifi.idproyectohist);
    } catch (error) {
      
    }
  }

}