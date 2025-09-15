import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivitiesByAnnualPlan, AnnualPlan } from 'src/app/interfaces/implementation/Implementation.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { ImplementationCatalogsService } from 'src/app/services/Implementacion/Implementacion-catalogs.service';
import { ImplementacionService } from 'src/app/services/Implementacion/Implementacion.service';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { MonSummaryService } from 'src/app/services/MonitoringProjects/MonSummary.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-budgetpreview',
  templateUrl: './budgetpreview.component.html',
  styleUrls: ['./budgetpreview.component.scss']
})
export class BudgetpreviewComponent {

  url: string = environment.url

  token: any;
  itemT: any[] = [1,2,3,4,5];
  idAnnualPlan: number = 0;

  visible!: boolean;
  typeValidation: number = 0;
  Metricas!: any[];
  proyectoSelected: Projects | null = null;
  summaryActivities: any[] = [];
  loading: boolean = true;
  total: any;
  mesesDelAno: any[] = [];
  yearSelected: any;
  periodSelected: any;
  processColor: string = "";

  disableButton: boolean = false;
  showDialog(type: number) {
      this.typeValidation = type
      this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }


  validacionesSt: any[] = [];
  managers: any[] = [];

  status: any;
  activitiesByPlan: ActivitiesByAnnualPlan[] = [];
  activitiesSchedule: ActivitiesByAnnualPlan[] = [];
  annualPlanSelected: AnnualPlan | null = null;
  corrections: any;
  indicadoresCuantitativos: { [key: number]: string } = {}; 
  reporteo: { [key: number]: string } = {}; 
  typeHeaderBackup: string = "";
  formV: boolean = false;

  constructor(
    readonly serviceObsProject$: ObservableService, 
    public _authGuardService: authGuardService,
    private route: ActivatedRoute, 
    private router: Router,
    private _implementacionService: ImplementacionService,  
    private messageService: MessageService, 
    private MonitoringCatalogService: MonCatalogService,
    private _implementationCatalogsService: ImplementationCatalogsService,
  ){
    this.token = this._authGuardService.getToken();
    this.getStatusValidacion();
    this.observaProjectSelected();
    this.getMetricas();
    this.getManagers();
    this.route.params.subscribe(params => {
      this.idAnnualPlan = params['id'];
      if(this.idAnnualPlan){
          this.getPlanAnualById();
          this.getActividadesByPlanAnual();
      }
    });

  }
  getPlanAnualById(){
    this._implementacionService.getPlanAnualById(this.idAnnualPlan, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.annualPlanSelected = resp.result[0];
        this.status = this.annualPlanSelected?.status == 6 ? 4 : this.annualPlanSelected?.status;
        if(this.annualPlanSelected?.status == 6) this.validacionesSt = this.validacionesSt.filter(v => v.Idstatusvalidateplan != 6);
        
        this.typeHeaderBackup = this.annualPlanSelected?.status === 4 ? "Historical Plan" : this.annualPlanSelected?.status === 6 ? "Approved By Assembly" : "";
      }
    })
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

  getMetricas(){
    this.MonitoringCatalogService.getMetricas(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.Metricas = response.result;
        } else {
            console.error("No se pudo traer la información de getMetricas", response.message)
        }
    })
  }

  getStatusValidacion(){
    this._implementationCatalogsService.getStatusAnnualPlan(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.validacionesSt = resp.result;
      }
    });
  }

  getManagers(){
    this._implementationCatalogsService.getManagers(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.managers = resp.result;
      }
    });
  }

  getActividadesByPlanAnual(){
    this._implementacionService.getActividadesByPlanAnual(this.idAnnualPlan, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.activitiesByPlan = resp.result;

        this.activitiesByPlan.forEach(actividad => {
          this.getIndicadoresCuantitativosByActividad(actividad.IdActividaddata);
          this.getReporteoByActividad(actividad.IdActividaddata);
        });

        this.activitiesSchedule = resp.result;
        
        this.generarMesesDesdeFecha(this.activitiesSchedule[this.activitiesSchedule.length -1]?.actividaddatestart)
        this.loading = false;
      }
    })
  }

  sumTotalsByActivities(Activities: any[]){
    let sum = 0
    for(let activity of Activities){
      sum += activity.EstimadoUSD
    }
    return sum
  }

  generarMesesDesdeFecha(fechaInicial: Date) {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 
      'Mayo', 'Junio', 'Julio', 'Agosto', 
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  
    const mesInicial = new Date(fechaInicial).getMonth();
    const anioInicial = new Date(fechaInicial).getFullYear(); // Año de la fecha inicial
    const mesesGenerados: string[] = [];
  
    for (let i = 0; i < 12; i++) {
      const indiceMes = (mesInicial + i) % 12;
      const anio = anioInicial + Math.floor((mesInicial + i) / 12);
      mesesGenerados.push(`${meses[indiceMes]} ${anio}`);
    }
  
    this.mesesDelAno = mesesGenerados;
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

  
  getMonthBackgroundCell(beginString: string, endString: string, month: string): string {
    const mapaMeses: { [key: string]: number } = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
      'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
      'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
  
    const mesMinuscula = month.toLowerCase();
    const mes = mapaMeses[mesMinuscula.split(' ')[0]];
  
    const fechaInicio = new Date(beginString);
    const fechaFin = new Date(endString);
  
    const añoInicio = fechaInicio.getFullYear();
    const añoFin = fechaFin.getFullYear();
    const mesInicio = fechaInicio.getMonth();
    const mesFin = fechaFin.getMonth();
  
    if (mes !== undefined) {
      if (añoInicio === añoFin) {
        if (mes >= mesInicio && mes <= mesFin) {
          return "#088F83"; 
        }
      }
      else if (añoInicio < añoFin) {
        if (mes >= mesInicio && añoInicio === fechaInicio.getFullYear()) {
          return "#088F83";
        }
        else if (mes <= mesFin && añoFin === fechaFin.getFullYear()) {
          return "#088F83";
        }
      }
    }
  
    return "#FFFFFF";
  }
  
  /**
   * 
   * @param type La idea es manejar varios estatus
   * 1 -- Pending
   * 2 -- Corrección
   * 3 -- Evaluación
   * 4 -- Aprobado
   */

  saveAnnualPlan(){

    /** VALIDAR QUE USUARIOS PUEDEN Y NO PUEDEN CANCELAR UN PADI
     * 1.- SI EL PADI NO ESTA APROBADO POR ASAMBLEA, CUALQUIER USUARIO QUE TENGA PERMISOS DE EDICIÓN PUEDE CANCELARLO
     * 2.- SI EL PADI ESTA APROBADO POR ASAMBLEA, SOLO LOS GERENTES Y SISTEMAS PUEDEN CANCELARLO
     */
    let existeManager = this.managers.find(m => m.IDUser === this.token?.userId);
    if(this.status === 5 && this.annualPlanSelected?.status === 6 && !existeManager){
      return this.messageService.add({ severity: 'error', summary: 'Cancel Plan', detail: 'Only Managers and Systems can cancel a plan approved by the assembly.'});
    }

    if(this.formV) return;
    this.formV = true;

    let titulo;
    if(this.status == 1 || this.status == 2 || this.status == 3) titulo = 'Implementation Annual Plan Draft_' + this.proyectoSelected?.ProjectName;
    if(this.status == 4) titulo = 'Implementation Annual Plan_' + this.proyectoSelected?.ProjectName;

    if(this.status == 2 && !this.corrections){
      return this.messageService.add({ severity: 'error', summary: 'Corrections', detail: 'Please, write your corrections'});
    }

    if(this.status == 0) titulo = this.annualPlanSelected?.name

    this.disableButton = true;

    if(this.annualPlanSelected?.status != 4 && this.status == 6){
      return this.messageService.add({ severity: 'error', summary: 'PADI Validation', detail: 'Prior to approval by the assembly, the PADI must first be approved.'});
    }

    /** FORMATEO DE LAS ACTIVIDADES DE PADI */
    let ActivitiesFinal = [];
    for(let act of this.activitiesByPlan){
      ActivitiesFinal.push({
        Idactividad_Rel_PlanAnual: act.Idactividad_Rel_PlanAnual,
        Idplananual: this.idAnnualPlan,
        IdActividaddata: act.IdActividaddata,
        status: 1
      })
    }
    
    let data = {
      p_Idplananual: this.idAnnualPlan,
      p_name: titulo || this.annualPlanSelected?.name,
      p_idrpnumber: this.annualPlanSelected?.idrpnumber,
      p_description: this.annualPlanSelected?.description,
      p_Observaciones: this.corrections,
      p_status: this.status,
      p_idprojects: this.proyectoSelected?.idprojects,
      activities: ActivitiesFinal
    }

    /** GENERAREMOS EL RESTO DE LA FUNCIÓN */
    this._implementacionService.setPlanAnnual(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.formV = false;

        if(resp.idPlanAnnual){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'PADI changed successfully!'});
          this.disableButton = false;
          this.router.navigate(['AnnualPlanning'])
        } else if(!resp.idPlanAnnual && resp.result[0].result.includes("Error: Ya existe un registro aprobado con este idrpnumber e idprojects")) {
          this.messageService.add({ severity: 'error', summary: 'Plan error', detail: 'There is already an approved plan for this RP'});
          this.router.navigate(['AnnualPlanning'])
        } else if(!resp.idPlanAnnual && resp.result[0].result.includes("Updated in tb_plananual: 1")) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'PADI changed successfully!'});
          this.router.navigate(['AnnualPlanning'])
        }

      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  
  saveAnnualPlanNew(){
    if(this.status == 2){
      this.showDialog(2);
    } else if(this.status == 4){
      this.showDialog(4);
    } else if(this.status == 5){
      this.showDialog(5)
    } else if(this.status == 6){
      this.showDialog(6)
    } else {
      this.saveAnnualPlan();
    }
  }

  exportToExcel() {
    this._implementacionService.downloadExcel(this.idAnnualPlan, this.annualPlanSelected?.name, this.token?.access_token)
  }

  exportToWord(){
    this._implementacionService.downloadWord(this.idAnnualPlan, this.annualPlanSelected?.name, this.token?.access_token)
  }
}

