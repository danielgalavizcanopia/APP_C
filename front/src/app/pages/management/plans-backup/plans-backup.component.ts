import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActividadesByPlanHistorico } from 'src/app/interfaces/implementation/PlanAnualHistoric.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { ImplementacionService } from 'src/app/services/Implementacion/Implementacion.service';
import { MonSummaryService } from 'src/app/services/MonitoringProjects/MonSummary.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { environment } from 'src/environments/environment';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-plans-backup',
  templateUrl: './plans-backup.component.html',
  styleUrls: ['./plans-backup.component.scss']
})
export class PlansBackupComponent {
  
  url: string = environment.url
  token: any;
  itemT: any[] = [1,2,3,4,5];

  visible!: boolean;
  typeValidation: number = 0;

  proyectoSelected: Projects | null = null;
  summaryActivities: any[] = [];
  loading: boolean = true;
  total: any;
  mesesDelAno: any[] = [];
  yearSelected: any;
  periodSelected: any;
  processColor: string = "";

  showDialog() {
      this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }

  idAnnualPlan: number = 0;
  actividadesHist: ActividadesByPlanHistorico[] = [];
  activitiesSchedule: ActividadesByPlanHistorico[] = [];

  indicadoresCuantitativos: { [key: number]: string } = {}; 
  reporteo: { [key: number]: string } = {}; 

  constructor(
    readonly serviceObsProject$: ObservableService, 
    private _summaryActivities: MonSummaryService, 
    public _authGuardService: authGuardService,
    private _implementacionService: ImplementacionService,
    private route: ActivatedRoute,){
    this.token = this._authGuardService.getToken();
    this.route.params.subscribe(params => {
      if(params['id']){
        this.getActividadesByPlanAnualHistorico(params['id']);
      }
    });

  }

  getActividadesByPlanAnualHistorico(idPlanAnnual: number){
    this._implementacionService.getActividadesByPlanAnualHistorico(idPlanAnnual, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.actividadesHist = resp.result;

        this.actividadesHist.forEach(actividad => {
          this.getIndicadoresCuantitativosByActividadHistorico(actividad.IdActividaddata);
          this.getReportingByActividadHistorico(actividad.IdActividaddata);
        });

        this.activitiesSchedule = resp.result.sort((a: any, b: any) => new Date(a.actividaddatestart).getTime() - new Date(b.actividaddatestart).getTime());
        this.generarMesesDesdeFecha(this.activitiesSchedule[0]?.actividaddatestart)
        
        this.loading = false;
      }
    })
  }

  getIndicadoresCuantitativosByActividadHistorico(idActividad: number) {
    if (!this.indicadoresCuantitativos[idActividad]) {
      this._implementacionService.getIndicadoresCuantitativosByActividadHistorico(idActividad, this.token.access_token).subscribe((resp: any) => {
        if (resp.valido == 1) {
          this.indicadoresCuantitativos[idActividad] = resp.result.map((item: any) => `<li><strong>${item.nombreCuantitativo}:</strong> ${item.estimado}</li>`).join('');
        }
      });
    }
  }

  getReportingByActividadHistorico(idActividad: number): any{
    if (!this.reporteo[idActividad]) {
      this._implementacionService.getReportingByActividadHistorico(idActividad, this.token.access_token).subscribe((resp: any) => {
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

  sumTotalsByActivities(Activities: any[]){
    let sum = 0
    for(let activity of Activities){
      sum += activity.EstimadoUSD
    }
    return sum
  }
}
