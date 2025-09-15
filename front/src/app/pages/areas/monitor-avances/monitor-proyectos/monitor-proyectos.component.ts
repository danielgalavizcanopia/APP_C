import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ScrollPanel } from 'primeng/scrollpanel';
import { KPIbyActivity } from 'src/app/interfaces/Monitor/MetricasByActivity.interface';
import { ActivitiesApproved, ActivitiesReportedByID, ReporteoByActivity } from 'src/app/interfaces/Monitor/MonitorActivities.interface';
import { StatusReporteoActivities } from 'src/app/interfaces/Monitor/MonitorCatalog.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { ImplementacionService } from 'src/app/services/Implementacion/Implementacion.service';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
@Component({
  selector: 'app-monitor-proyectos',
  templateUrl: './monitor-proyectos.component.html',
  styleUrls: ['./monitor-proyectos.component.scss'],
  providers: [MessageService]
})
export class MonitorProyectosComponent {
    @ViewChild('scrollPanel') scrollPanel!: ScrollPanel;
    token: any;
    proyectoSelected: Projects | null = null;
    idActivity: any;
    idRP: any;
    idRAct: any;

    /** VARIABLES PARA GRAFICA */
    rpSelected: any;
    ActivitiesByRP: any[] = [];
    loading: boolean = true;
    ActivitySelected!: ActivitiesReportedByID;
    reporteoByActivities!: ReporteoByActivity[] | any[];
    rpnumbers: any[] = [];
    metricasbyActividad: KPIbyActivity[] = [];
    indicadoresCuantitativosByActividad!: any[];
    indicadorSelected: any;

    ActivitiesReportedByID: ActivitiesReportedByID[] = [];
    activityForm!: FormGroup;

    metricaLabel: string = '';
    sidebarVisible: boolean = false;

    visible!: boolean;
    progressPreview!: any[];
    statusReporteo!: StatusReporteoActivities[];
    statusSelected!: number;

    disableButtonSave: boolean = true;

    showDialog() {
      // console.log(this.items.getRawValue());
      
      if(!this.activityForm.valid){
        this.messageService.add({ severity: 'error', summary: 'Invalid Activity', detail: "All fields is required"});
        return;
      }
        this.visible = true;
        this.progressPreview = this.items.getRawValue(); 
    }

    onHide() {
      this.visible = false;
    }

    constructor(
        private MonitoringCatalogService: MonCatalogService,
        public _authGuardService: authGuardService,
        readonly serviceObsProject$: ObservableService,
        private _fb: FormBuilder,
        private messageService: MessageService,
        private datepipe: DatePipe,
        private route: ActivatedRoute,
        private router: Router,
        private RPcatalogsService: RPCatalogsService,
    ) {
      this.token = this._authGuardService.getToken();
      this.initFormulario();
      this.getRPnumber();
      this.getStatusReporteoActividades();
      this.observaProjectSelected();
      
      this.route.params.subscribe(params => {
        this.idRP = params['rp'];
        this.idActivity = params['id'];
        if(this.idActivity && this.idRP){
          this.getReportActDetailById(this.idActivity);
        }
      });

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

    initFormulario(){
        this.activityForm = this._fb.group({
            idprojects: [this.proyectoSelected?.idprojects],
            rpnumber: [''],
            activity: [''],
            /**PARA INICIAR ARRAY */
             items: this._fb.array([]) //[Validators.required]

        });
    }

    get items() : FormArray {
        return this.activityForm.get('items') as FormArray;
    }

    addItem() {
        this.items.push(this._fb.group({
            Idreporteoactividades: [0],
            Idcuantitativo: ['', Validators.required],
            Idactividadrelcuantitativo: [''],
            AvanceCuantitativo: ['', ],
            begindate: ['', Validators.required],
            enddate: ['', Validators.required],
            calculatedprogress: [''],
            NumJornales: [0],
            participatingW: [0],
            participatingM: [0],
            status: [1,[]]
        }));

        setTimeout(() => {
          const el = this.scrollPanel?.contentViewChild?.nativeElement;
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        }, 0);
    }

    remove(index: number) {
      this.items.controls[index].clearValidators()
    }

    /** CATALOGOS */
    getRPnumber(){
        this.RPcatalogsService.getRPnumber( this.token?.access_token).subscribe((resp: any) => {
          if(resp.valido == 1){
            this.rpnumbers = resp.result;
            if(this.idRP){
              this.activityForm.patchValue({
                rpnumber: parseInt(this.idRP),
              })
            }
          }
        });
    }

    getStatusReporteoActividades(){
      this.MonitoringCatalogService.getStatusReporteoActividades(this.token?.access_token).subscribe((response: any) => {
        if(response.valido == 1){
            this.statusReporteo = response.result;
        } else {
            console.error("No se pudo traer la información de getMonitorActivities", response.message)
        }
      })
    }

    /** ENDPOINTS QUE LLENAN PARA UN EDIT */
    getReportActDetailById(idActivity: number = 0){
      this.MonitoringCatalogService.getReportActDetailById(idActivity ,this.token?.access_token).subscribe((response: any) => {
        if(response.valido == 1){
          this.ActivitiesReportedByID = response.result;
          this.ActivitySelected = response.result[0];
          this.statusSelected = this.ActivitySelected.IdstatusReporteoActividades;
          if(this.ActivitySelected && this.idActivity) this.getReporteoByActivity(this.ActivitySelected.IdActividaddata);
          if(!this.idActivity){
            this.addItem();
          }
        } else {
            console.error("No se pudo traer la información de getReportActDetailById", response.message)
        }
      })
    }

    /** ESTE SOLO FUNCIONARÁ CUANDO HAGAS UN CREATE, HABILITARÁ EL DROPDOWN */
    getActivitiesByRP(rpnumber: number){
      this.MonitoringCatalogService.getActivitiesApproved(this.token?.access_token, rpnumber, this.proyectoSelected?.idprojects).subscribe((response: any) => {
        if(response.valido == 1){
            this.ActivitiesByRP = response.result;
            if(this.idActivity && this.ActivitiesByRP.length > 0){
              this.activityForm.patchValue({
                activity: parseInt(this.idActivity)
              })
            }
        } else {
            console.error("No se pudo traer la información de getTypeActivities", response.message)
        }
      })
    }

    /** ESTE TRAERÁ TODOS LOS REPORTEOS QUE SE HAN HECHO SOBRE N ACTIVIDAD */
    getReporteoByActivity(idactividad: number){
      this.MonitoringCatalogService.getReporteoByActivity(idactividad, this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1){
          this.reporteoByActivities = resp.result;
          if(this.reporteoByActivities.length > 0){
            for(let reporteo of this.reporteoByActivities){
              
              const reportRow = this._fb.group({
                Idreporteoactividades: [reporteo.IdReporteoActividades],
                Idcuantitativo: [this.ActivitiesReportedByID.find(x => x.Idcuantitativo == reporteo.Idcuantitativo)],
                Idactividadrelcuantitativo: [reporteo.IdActividadRelCuantitativo],
                AvanceCuantitativo: [reporteo.AvanceCuantitativo],
                begindate: [this.datepipe.transform(reporteo.begindate,'yyyy-MM-dd')],
                enddate: [this.datepipe.transform(reporteo.enddate,'yyyy-MM-dd')],
                calculatedprogress: [reporteo.calculatedprogress],
                NumJornales: [reporteo.NumJornales],
                participatingW: [reporteo.participatingW],
                participatingM: [reporteo.participatingM],
                status: [1]
              });

              const hoy = new Date();

              if(new Date(reporteo.enddate).getTime() < hoy.setHours(0,0,0,0)) {
                reportRow.disable();
              }

              this.items.push(reportRow);
            }
            setTimeout(() => {
              const el = this.scrollPanel?.contentViewChild?.nativeElement;
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }, 0);
          }
          this.loading = false
        }
      })  
    }

    /** CALCULA PROGRESO ACORDE A LO QUE SE INGRESA (SUJETO A ERRORES, HAY QUE VALIDAR SI ES VIABLE DEJARLO) */
    calculateProgress(indexItem: any){
      const indicadoresArray = this.items.controls.map((control, index) => ({ index, control }));
      const indicador = indicadoresArray.find(item => item.index === indexItem)?.control;
      const porcentaje = ((indicador?.get('AvanceCuantitativo')?.value / indicador?.get('Idcuantitativo')?.value.estimado) * 100).toFixed(2);

      if(parseInt(porcentaje) < 100){
        indicador?.patchValue({
          calculatedprogress: porcentaje
        });
      } else {
        indicador?.patchValue({
          calculatedprogress: 100
        });
      }
    }

    /** ESTE MANDA A GUARDAR TODO EL REPORTEO, YA SEAN REPORTEOS NUEVOS, EDITADOS, O ELIMINADOS SEGÚN SU CASO */
    saveActivities(){
      this.disableButtonSave = false;
        let data = {
          reporteo: this.items.getRawValue()
        }
        
        this.MonitoringCatalogService.setReporteoActivities(data, this.token?.access_token).subscribe((resp: any) => {
          if(resp.valido == 1){
            this.disableButtonSave = true;
            if(!this.idActivity){
              this.setStatusReporteoActivity();
            } else {
              this.messageService.add({ severity: 'success', summary: 'Success!', detail: "Progress save successfully."});
              this.router.navigate(['Monitor-activities'])
            }
          } else {
            this.disableButtonSave = false;
            this.messageService.add({ severity: 'error', summary: 'Invalid', detail: "Server error, please, try again"});
          }
        });
    }

    /** ESTE EJECUTA EL CAMBIO DE STATUS EN GENERAL DEL REPORTEO */
    setStatusReporteoActivity(){
      if(!this.statusSelected && this.idActivity){
        return this.messageService.add({ severity: 'error', summary: 'Invalid', detail: "Please, Select a Status"});
      }

      let data = {
        p_Idstatus: this.idActivity ? this.ActivitySelected.Idstatus :  0,
        p_IdActividaddata: this.idActivity ? this.idActivity : this.ActivitySelected.IdActividaddata,
        p_IdstatusReporteoActividades:  !this.idActivity ? 1 : this.statusSelected,
        p_IDUser: this.token?.userId,
      }

      this.MonitoringCatalogService.setStatusReporteoactivities(data, this.token?.access_token).subscribe((resp: any) => {
        if(resp.valido == 1){
          if(!this.idActivity){
            this.messageService.add({ severity: 'success', summary: 'Success!', detail: "Status changed succesfully."});
            this.router.navigate(['Monitor-activities'])
          } else {
            this.messageService.add({ severity: 'success', summary: 'Success!', detail: "Status changed succesfully."});
          }
        }
      });
    }
}
