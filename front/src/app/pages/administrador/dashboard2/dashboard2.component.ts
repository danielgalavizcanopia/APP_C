import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivitiesByOds, ActivitiesByProject, CountIndicencesNEvidences, DashboardOverView, IncidencesByProject, KeyMilestoneByMacro, KPIByActivity, MacroProcessByProject, MacroProcessCatalog, SummaryActivitiesTracker, SummaryBenefitTracker, TopODSbyProject } from 'src/app/interfaces/dashboards/dashbboards.interfaces';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { DashboarProjectDetailService } from 'src/app/services/dashboards/dashboarProjectDetail.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ActivityDetailComponent } from './ActivityDetail/ActivityDetail.component';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css'],
})
export class Dashboard2Component {
    token: any;
    products!: any[];
    items!: MenuItem[];

    @ViewChild(ActivityDetailComponent) activityDetailModal!: ActivityDetailComponent;
    
    openModalAnnualCost(showModal: boolean = false, idactivitydata: any) {
        this.activityDetailModal.openModal(showModal, parseInt(idactivitydata))
    }

    truncateText(text: string, maxLength: number): string {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    }

    proyectoSelected: Projects | null = null;

    dashboardOverView: DashboardOverView | null = null;
    summaryBenefT: SummaryBenefitTracker[] = [];
    totalBenefTPlanned: number = 0;
    totalBenefTPaid: number = 0;
    summaryActT: SummaryActivitiesTracker[] = [];
    totalActT: SummaryActivitiesTracker | null = null;
    loadingBenef: boolean = true;
    loadingAct: boolean = true;

    topOdsByProject: TopODSbyProject[] = [];
    macrossCatalog: MacroProcessCatalog[] = [];
    ActivitiesByOds: ActivitiesByOds[] = [];
    incidencesByProject: IncidencesByProject[] = [];
    loadingInc: boolean = true;

    ActivitiesByProject: ActivitiesByProject[] = [];
    loadingABP: boolean = true;

    KPIByActivity: KPIByActivity[] = [];

    MacroProcessByProject: KeyMilestoneByMacro []= [];
    CountIndicencesNEvidences!: CountIndicencesNEvidences;

    odsName: string = '';
    selectedIndex: number | null = null;

    constructor(
        readonly serviceObsProject$: ObservableService,
        public _authGuardService: authGuardService,
        private productService: ProductService,
        private dashboardsService: DashboarProjectDetailService
    ){
        this.token = this._authGuardService.getToken();
        this.getMacroProcessCatalog()
        this.observaProjectSelected();
        this.productService.getProductsWithOrdersSmall().then((data) => {
            this.products = data;
        });

        this.items = [
            {
                label: 'Origination',
            },
            {
                label: 'Listing',
            },
            {
                label: 'Implementation',
            },
            {
                label: 'Reporting',
            },
            {
                label: 'Verification',
            },
            {
                label: 'Registration/Issuance',
            },
            {
                label: 'Benefit distribution',
            },
            {
                label: 'Settlement',
            },
            {
                label: 'Commercialisation',
            }
        ];
    }

    observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
        this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
            if(project){
                this.proyectoSelected = project;
                this.getprojectOverview();
                this.getSummaryBenefitTracker();
                this.getSummaryByActivitiesTracker();
                this.getTopODSByProject();
                this.getIncidenceByProject();
                this.getActivitiesByProject();
                this.getCountEvidencesNIncidences();
            } else {
                this.proyectoSelected = null;
            }
        });
    }

    getprojectOverview(){
        this.dashboardsService.getprojectOverview(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.dashboardOverView = response.result[0];
          } else {
              console.error("No se pudo traer la información de getprojectOverview", response.message)
          }
        })
    }

    getSummaryBenefitTracker(){
        this.totalBenefTPlanned = 0;
        this.totalBenefTPaid = 0;
        this.dashboardsService.getSummaryBenefitTracker(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.summaryBenefT = response.result;
              this.loadingBenef = false;

              for(let row of this.summaryBenefT){
                this.totalBenefTPlanned += row.totalPlanned;
                this.totalBenefTPaid += row.totalPaid;
              }
          } else {
              console.error("No se pudo traer la información de getSummaryBenefitTracker", response.message)
          }
        })
    }

    getSummaryByActivitiesTracker(){
        this.dashboardsService.getSummaryByActivitiesTracker(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.summaryActT = response.result;
              this.totalActT = response.result[0]
              this.loadingAct = false;
          } else {
              console.error("No se pudo traer la información de getSummaryByActivitiesTracker", response.message)
          }
        })
    }

    calcularPorcentaje(cantidad: number, total: number) {
        if (total === 0) return 0;
        return (cantidad / total) * 100;
    }

    calcularVarianza(totalPlanned: any = 0, totalPaid: any = 0){
        let variance = (Math.abs(totalPlanned - totalPaid) / ((totalPlanned + totalPaid) / 2)) * 100;
        return variance
    }

    getTopODSByProject(){
        this.dashboardsService.getTopODSByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.topOdsByProject = response.result;
              if(this.topOdsByProject.length > 0){
                this.getActivitiesByOds(this.topOdsByProject[0].Idglobalgoals, this.topOdsByProject[0].ShortDescriptionODSs);
              }
          } else {
              console.error("No se pudo traer la información de getTopODSByProject", response.message)
          }
        })
    }

    getMacroProcessCatalog(){
        this.dashboardsService.getMacroProcessCatalog(this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.macrossCatalog = response.result;
          } else {
              console.error("No se pudo traer la información de getMacroProcessCatalog", response.message)
          }
        })
    }

    getActivitiesByOds(idOds: number, odsName: string, index: number = 0){
        this.odsName = odsName
        this.selectedIndex = index;
        this.dashboardsService.getActivitiesByOds(this.proyectoSelected?.idprojects, idOds,this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.ActivitiesByOds = response.result;
          } else {
              console.error("No se pudo traer la información de getTopODSByProject", response.message)
          }
        })
    }
    
    getIncidenceByProject(){
        this.dashboardsService.getIncidenceByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.loadingInc = false;
              this.incidencesByProject = response.result;
          } else {
              console.error("No se pudo traer la información de getIncidenceByProject", response.message)
          }
        })
    }

    getActivitiesByProject(){
        this.dashboardsService.getActivitiesByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
            this.loadingABP = false;
              this.ActivitiesByProject = response.result;
          } else {
              console.error("No se pudo traer la información de getIncidenceByProject", response.message)
          }
        })
    }

    getKPIActivitiesByActivity(idActivity: number){
        this.dashboardsService.getKPIActivitiesByActivity(idActivity, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.KPIByActivity = response.result;
          } else {
              console.error("No se pudo traer la información de getIncidenceByProject", response.message)
          }
        })
    }

    getMacroProcessByProject(idMacroProcess: number){
        this.dashboardsService.getKeyMilestonesByMacroprocess(this.proyectoSelected?.idprojects, idMacroProcess, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.MacroProcessByProject = response.result;
          } else {
              console.error("No se pudo traer la información de getIncidenceByProject", response.message)
          }
        })
    }

    getCountEvidencesNIncidences(){
        this.dashboardsService.getCountEvidencesNIncidences(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.CountIndicencesNEvidences = response.result[0];
          } else {
              console.error("No se pudo traer la información de getIncidenceByProject", response.message)
          }
        })
    }
}
