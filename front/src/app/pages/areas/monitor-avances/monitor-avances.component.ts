import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivitiesDates, ActivitiesMonitoringExpand } from 'src/app/interfaces/Monitor/MonitorActivities.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ProductService } from 'src/app/services/product.service';
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-monitor-avances',
  templateUrl: './monitor-avances.component.html',
  styleUrls: ['./monitor-avances.component.scss']
})
export class MonitorAvancesComponent {
  @ViewChild('dt1') dt1!: Table;
  
  handleGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dt1.filterGlobal(input.value, 'contains');
  }
  token: any;
  customers: any[] = [];
  cities!: City[];
  TypeView: number = 1; // 1 es interno, 2 es ejido
  balanceFrozen: boolean = true;
  proyectoSelected: Projects | null = null;
  MonitorAvances: any[] = [];
  ActivityPlan: ActivitiesMonitoringExpand[] = [];
  loading: boolean = false;
  mesesDelAno: any[] = [];
  ActivitiesDates: ActivitiesDates[] = [];
  rpnumbers: any[] = [];
  rpSelected: any;
  AccountsType: number = 1;
  totalCost: number = 0
  processColor: string = "";
  sidebarVisible: boolean = false;

  totalCapexApproved: any;
  totalCapexPlanned: any;
  totalCapexActual: any;
  totalCapexProvisional: any;
  totalCapexReconciled: any;

  totalOpexApproved: any;
  totalOpexPlanned: any;
  totalOpexActual: any;
  totalOpexProvisional: any;
  totalOpexReconciled: any;
  constructor(
              private customerService: ProductService,
              private MonitoringCatalogService: MonCatalogService,
              public _authGuardService: authGuardService,
              readonly serviceObsProject$: ObservableService,
              private RPcatalogsService: RPCatalogsService,
              ) {
    this.token = this._authGuardService.getToken();
    this.getRPnumber();
    this.observaProjectSelected();
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.changeRP();
      } else {
      }
    });
  }

  getRPnumber(){
    this.RPcatalogsService.getRPnumber( this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
          this.rpnumbers = resp.result;
          let rp = localStorage.getItem('RPKey') || 0;
          if(rp){
            this.rpSelected = this.rpnumbers.find(x=> x.idrpnumber == Number(rp))?.idrpnumber
            this.changeRP();
          }
      }
    });
  }

  changeRP(){
    if(this.rpSelected){
      localStorage.setItem('RPKey', this.rpSelected);
      this.getActivitiesDates();
      this.getActivityPlan();
    }
  }

  getMonitorAvances(){
    this.MonitoringCatalogService.getMonitorActivities(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.MonitorAvances = response.result;
      } else {
          console.error("No se pudo traer la información de getMonitorActivities", response.message)
      }
    })
  }
  
  getActivitiesDates(){
    this.MonitoringCatalogService.getActivitiesDates(this.token?.access_token, this.rpSelected, this.proyectoSelected?.idprojects).subscribe((response: any) => {
      if(response.valido === 1){
          this.ActivitiesDates = response.result;
          this.generarMesesDesdeFecha(new Date(response.result[0]?.actividaddatestart))
      } else {
          console.error("No se pudo traer la información de getActivitiesDates", response.message)
      }
    })
  }

  getActivityPlan(){
    this.MonitoringCatalogService.getReporteActividadByProject(this.rpSelected, this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.ActivityPlan = response.result;
          this.loading = false;
      } else {
          console.error("No se pudo traer la información de getTypeActivities", response.message)
      }
    })
  }

  getBeginMonth(dateString: string, idmes: number, data: any): any {
    const date = new Date(dateString);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    if(date.getUTCMonth() + 1 == idmes){
      var Month = monthNames[date.getUTCMonth()]; // Usamos getUTCMonth para asegurar la correcta interpretación
      if(Month){
        return data.quantityobjetive;
      }
    } else {
      return '';
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

  getEndMonth(dateString: string, idmes: number, data: any): any {
    const date = new Date(dateString);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    if(date.getUTCMonth() + 1 == idmes){
      var Month = monthNames[date.getUTCMonth()]; // Usamos getUTCMonth para asegurar la correcta interpretación
      if(Month){
        return data.quantityobjetive;
      }
    } else {
      return '';
    }
  }

  exportDatesToExcel() {
    this.MonitoringCatalogService.downloadDatesExcel(this.proyectoSelected?.idprojects ,this.rpSelected, this.token?.access_token)
  }

  exportKPIToExcel() {
    this.MonitoringCatalogService.downloadKPIMonitorExcel(this.proyectoSelected?.idprojects ,this.rpSelected, this.token?.access_token)
  }

  exportGeneralReport() {
    this.MonitoringCatalogService.downloadGeneralKPIReport(this.token?.access_token)
  }
  
  
}
