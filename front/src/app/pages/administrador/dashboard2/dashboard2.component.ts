import { ChangeDetectionStrategy, Component, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivitiesByOds, ActivitiesByProject, CountIndicencesNEvidences, DashboardOverView, IncidencesByProject, KeyMilestoneByMacro, KPIByActivity, MacroProcessByProject, MacroProcessCatalog, SummaryActivitiesTracker, SummaryBenefitTracker, TopODSbyProject } from 'src/app/interfaces/dashboards/dashbboards.interfaces';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { DashboarProjectDetailService } from 'src/app/services/dashboards/dashboarProjectDetail.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ActivityDetailComponent } from './ActivityDetail/ActivityDetail.component';
import { ProjectStatusService, StatusProject, SetStatusRequest } from 'src/app/services/project-status.service';
import { UserPermissionsService } from 'src/app/services/user-permissions.service';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css'],
})
export class Dashboard2Component implements OnInit {
    token: any;
    products!: any[];
    items!: MenuItem[];

    @ViewChild(ActivityDetailComponent) activityDetailModal!: ActivityDetailComponent;
    
    // Status management properties
    statusOptions: any[] = []; 
    selectedStatus: number = 1;
    statusChanged: boolean = false;
    updatingStatus: boolean = false;
    statusUpdateMessage: string = '';
    statusUpdateSuccess: boolean = false;

    userHasStatusPermission: boolean = false;
    loadingPermissions: boolean = true;
    
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
        private dashboardsService: DashboarProjectDetailService,
        private projectStatusService: ProjectStatusService,
        private userPermissionsService: UserPermissionsService
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

    ngOnInit() {
        this.checkUserPermissions(); 
        this.loadStatusCatalog();
    }

    checkUserPermissions() {
        const currentUserId = this.token?.IDUsuario || this.token?.id_user || this.token?.userId;
        
        if (!currentUserId) {
            console.warn('No se pudo obtener el ID del usuario actual');
            this.userHasStatusPermission = false;
            this.loadingPermissions = false;
            return;
        }

        console.log('Verificando permisos para usuario ID:', currentUserId);

        this.userPermissionsService.checkUserHasStatusPermission(currentUserId, this.token.access_token).subscribe({
            next: (hasPermission: boolean) => {
                this.userHasStatusPermission = hasPermission;
                this.loadingPermissions = false;
                console.log('Usuario tiene permisos para editar status:', hasPermission);
            },
            error: (error: any) => {
                console.error('Error verificando permisos:', error);
                this.userHasStatusPermission = false;
                this.loadingPermissions = false;
            }
        });
    }

    loadStatusCatalog() {
        this.projectStatusService.getStatusProject(this.token.access_token).subscribe({
            next: (response: any) => {
                console.log('Status catalog response:', response);
                
                if (response.valido === 1) {
                    if (response.result && Array.isArray(response.result)) {
                        this.statusOptions = response.result.map((status: any) => ({
                            label: status.statusProject,  
                            value: status.IdpstatusProject
                        }));
                        
                        console.log('Status options loaded:', this.statusOptions);
                    } else {
                        console.error('Response result is not an array:', response.result);
                    }
                } else {
                    console.error('API returned valido !== 1:', response);
                }
            },
            error: (error: any) => {
                console.error('Error loading status catalog:', error);
            }
        });
    }

    observaProjectSelected() {
        this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
            if(project){
                this.proyectoSelected = project;
                this.selectedStatus = project.IdpstatusProject || project.Status || 1;
                this.statusChanged = false;
                this.statusUpdateMessage = '';
                this.getprojectOverview();
                this.getSummaryBenefitTracker();
                this.getSummaryByActivitiesTracker();
                this.getTopODSByProject();
                this.getIncidenceByProject();
                this.getActivitiesByProject();
                this.getCountEvidencesNIncidences();
            } else {
                this.proyectoSelected = null;
                this.selectedStatus = 1;
                this.statusChanged = false;
                this.statusUpdateMessage = '';
            }
        });
    }

    onStatusChange(event: any) {
        if (this.proyectoSelected) {
            const currentStatus = this.proyectoSelected.IdpstatusProject || this.proyectoSelected.Status || 1;
            this.statusChanged = event.value !== currentStatus;
            this.statusUpdateMessage = '';
            console.log('Status changed:', event.value, 'Original:', currentStatus);
        }
    }

    updateProjectStatus() {
        if (!this.proyectoSelected || !this.statusChanged || !this.userHasStatusPermission) return;

        this.updatingStatus = true;
        this.statusUpdateMessage = '';

        const statusData: SetStatusRequest = {
            idprojects: this.proyectoSelected.idprojects,
            IdpstatusProject: this.selectedStatus
        };

        console.log('Sending status update:', statusData);

        this.projectStatusService.setProjectStatus(statusData, this.token.access_token).subscribe({
            next: (response: any) => {
                this.updatingStatus = false;
                console.log('Status update response:', response);
                
                if (response.valido === 1) {
                    this.statusChanged = false;
                    this.statusUpdateMessage = 'Status updated successfully!';
                    this.statusUpdateSuccess = true;
                    
                    this.serviceObsProject$.setProject({
                        ...this.proyectoSelected!,
                        Status: this.selectedStatus,              
                        IdpstatusProject: this.selectedStatus     
                    });

                    console.log('Project status updated in observable');
                } else {
                    this.statusUpdateMessage = response.message || 'Error updating status';
                    this.statusUpdateSuccess = false;
                }

                setTimeout(() => {
                    this.statusUpdateMessage = '';
                }, 3000);
            },
            error: (error: any) => {
                this.updatingStatus = false;
                this.statusUpdateMessage = 'Error updating status. Please try again.';
                this.statusUpdateSuccess = false;
                console.error('Error updating project status:', error);

                setTimeout(() => {
                    this.statusUpdateMessage = '';
                }, 5000);
            }
        });
    }

    calculateVariance(totalPlanned: number, totalPaid: number): number {
        if (totalPlanned === 0) return 0;
        const variance = ((totalPaid - totalPlanned) / ((totalPlanned + totalPaid) / 2)) * 100;
        return variance
    }

    getprojectOverview(){
        this.dashboardsService.getprojectOverview(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.dashboardOverView = response.result[0];
          } else {
              console.error("Could not fetch information from getprojectOverview", response.message)
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
              console.error("Could not fetch information from getSummaryBenefitTracker", response.message)
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
              console.error("Could not fetch information from getSummaryByActivitiesTracker", response.message)
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
              console.error("Could not fetch information from getTopODSByProject", response.message)
          }
        })
    }

    getMacroProcessCatalog(){
        this.dashboardsService.getMacroProcessCatalog(this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.macrossCatalog = response.result;
          } else {
              console.error("Could not fetch information from getMacroProcess Catalog", response.message)
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
              console.error("Could not fetch information from getTopODSByProject", response.message)
          }
        })
    }
    
    getIncidenceByProject(){
        this.dashboardsService.getIncidenceByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.loadingInc = false;
              this.incidencesByProject = response.result;
          } else {
              console.error("Could not fetch information from getIncidenceByProject", response.message)
          }
        })
    }

    getActivitiesByProject(){
        this.dashboardsService.getActivitiesByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
            this.loadingABP = false;
              this.ActivitiesByProject = response.result;
          } else {
              console.error("Could not fetch information from getIncidenceByProject", response.message)
          }
        })
    }

    getKPIActivitiesByActivity(idActivity: number){
        this.dashboardsService.getKPIActivitiesByActivity(idActivity, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.KPIByActivity = response.result;
          } else {
              console.error("Could not fetch information from getIncidenceByProject", response.message)
          }
        })
    }

    getMacroProcessByProject(idMacroProcess: number){
        this.dashboardsService.getKeyMilestonesByMacroprocess(this.proyectoSelected?.idprojects, idMacroProcess, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.MacroProcessByProject = response.result;
          } else {
              console.error("Could not fetch information from getIncidenceByProject", response.message)
          }
        })
    }

    getCountEvidencesNIncidences(){
        this.dashboardsService.getCountEvidencesNIncidences(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
          if(response.valido === 1){
              this.CountIndicencesNEvidences = response.result[0];
          } else {
              console.error("Could not fetch information from getIncidenceByProject", response.message)
          }
        })
    }
}