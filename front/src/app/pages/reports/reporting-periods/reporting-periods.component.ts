import { Component, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ReportingPeriodsService } from 'src/app/services/ReportingPeriods/ReportingP.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ProductService } from 'src/app/services/product.service';

interface YearData {
  year: number;
  value: number | null;
}

@Component({
  selector: 'app-reporting-periods',
  templateUrl: './reporting-periods.component.html',
  styleUrls: ['./reporting-periods.component.scss']
})
export class ReportingPeriodsComponent {
  token: any;
  proyectoSelected: Projects | null = null;
  reports: any[] = [];
  reportsVolume: any[] = [];
  basicData: any;

  basicOptions: any;
  TypeView: number = 1; // 1 es RP, 2 es Years
  years: any[] = [ 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040]
  reportSummary: any;
  loading!: boolean;
  sidebarVisible: boolean = false;
  constructor(
    private productService: ProductService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,    
    public _authGuardService: authGuardService, 
    readonly serviceObsProject$: ObservableService,
    private reportingServices: ReportingPeriodsService) {
    this.token = this._authGuardService.getToken();
    this.observaProjectSelected();
    this.loading = true;
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.getReportingPeriods();
        this.loading = true;
      } else {

      }
    });
  }

  getReportingPeriods(){
    this.reportingServices.getReportingPeriods(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
        this.reports = response.result;
        this.loading = false;
        this.getRPGraphic();
        this.getReportingPeriodsVolume();
        this.getReportingPeriodsSummary();
      } else {
          console.error("No se pudo traer la información de getReportingPeriods", response.message)
      }
    });
  }

  getReportingPeriodsVolume(){
    this.reportingServices.getReportingPeriodsVolumeYear(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
        this.reportsVolume = response.result;
        
      } else {
          console.error("No se pudo traer la información de getReportingPeriodsVolume", response.message)
      }
    });
  }

  getReportingPeriodsSummary(){
    this.reportingServices.getReportingPeriodsSummary(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
        this.reportSummary = response.result[0];
      } else {
          console.error("No se pudo traer la información de getReportingPeriodsSummary", response.message)
      }
    });
  }

  getRPGraphic(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    let RPtotales = [];
    let RPtotalesLabels = [];
    let colors = [];
    let bordercolors = [];
    for(let report of this.reports){
      RPtotales.push(report.RP_total)
      RPtotalesLabels.push(report.RP_ID)
      colors.push(this.getRandomColor())
      bordercolors.push(this.getRandomColorBorder())
    }

    this.basicData = {
        labels: RPtotalesLabels,
        datasets: [
            {
                label: 'Cosechas por año',
                data: RPtotales,
                backgroundColor: colors,
                borderColor: bordercolors,
                borderWidth: 1
            }
        ]
    };

    this.basicOptions = {
        plugins: {
            legend: {
                legend: {
                  display: false
                },
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
  }

  getRandomColor(): string {
    const baseColor = { r: 94, g: 202, b: 148 };
    const variation = 20; // Ajusta este valor para cambiar el rango de variación

    const r = Math.min(255, Math.max(0, baseColor.r + Math.floor(Math.random() * (2 * variation + 1)) - variation));
    const g = Math.min(255, Math.max(0, baseColor.g + Math.floor(Math.random() * (2 * variation + 1)) - variation));
    const b = Math.min(255, Math.max(0, baseColor.b + Math.floor(Math.random() * (2 * variation + 1)) - variation));
    const alpha = 0.2;

    return `rgba(${r},${g},${b},${alpha})`;
  }

  getRandomColorBorder(): string {
    const baseColor = { r: 94, g: 202, b: 148 };
    const variation = 20; // Ajusta este valor para cambiar el rango de variación

    const r = Math.min(255, Math.max(0, baseColor.r + Math.floor(Math.random() * (2 * variation + 1)) - variation));
    const g = Math.min(255, Math.max(0, baseColor.g + Math.floor(Math.random() * (2 * variation + 1)) - variation));
    const b = Math.min(255, Math.max(0, baseColor.b + Math.floor(Math.random() * (2 * variation + 1)) - variation));

    return `rgba(${r},${g},${b})`;
  }

  matchYears(years: any, data: any): any{
    var Years = Object.keys(data)
    if(Years.find( x => x == years)){
      var YearVol = data[years]
      if(YearVol){
        return YearVol;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  exportToExcel() {
    this.reportingServices.downloadExcel(this.proyectoSelected?.idprojects, this.proyectoSelected?.ProjectName +'_ReportingPeriods', this.token?.access_token)
  }

}
