import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BenefitTracker } from 'src/app/interfaces/Monitor/SummaryActivities.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ProductService } from 'src/app/services/product.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-supplier-tracker',
  templateUrl: './Supplier-tracker.component.html',
  styleUrls: ['./Supplier-tracker.component.css'],
})
export class SupplierTrackerComponent {
  token: any;
  proyectoSelected: Projects | null = null;

  products!: any[];
  dummyArray!: any[];
  rpSelected: any;
  rpnumbers: any[] = [];
  BenefitTrackerData: BenefitTracker[] = [];
  totalsFinancial: any = {
    totalApproved: 0,
    totalPlanned: 0,
    totalPaid: 0,
    totalProvisional: 0,
  };

  loading: boolean = true;

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  constructor(
    public _authGuardService: authGuardService,
    private productService: ProductService,
    readonly serviceObsProject$: ObservableService,
    private RPcatalogsService: RPCatalogsService,
    private MonitoringCatalogService: MonCatalogService,

  ) {
    this.token = this._authGuardService.getToken();
    this.getRPnumber()
    this.observaProjectSelected();
  }


  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.changeRP();
        // Se ejecutaría el get que traiga la información al supplier
      } else {
      }
    });
  }

  getRPnumber(){
    this.RPcatalogsService.getRPnumber( this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
          this.rpnumbers = resp.result;
          // this.rpSelected = this.rpnumbers[0].idrpnumber
      }
    });
  }

  changeRP(){
    if(this.rpSelected){
      this.getFinancialTracker();
    } else {
      this.BenefitTrackerData = [];
      this.totalsFinancial = {
        totalApproved: 0,
        totalPlanned: 0,
        totalPaid: 0,
        totalProvisional: 0,
      };
      this.loading = false;
    }
  }

  getFinancialTracker(){
    this.loading = true;
    this.MonitoringCatalogService.getBenefitsTracker(this.rpSelected.join(','), this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.BenefitTrackerData = response.result;
          this.getCatchTotals();
          this.loading = false;
      } else {
          console.error("No se pudo traer la información de getFinancialTracker", response.message)
      }
    })
  }

  getCatchTotals(){
    this.totalsFinancial.totalApproved = 0;
    this.totalsFinancial.totalPlanned = 0;
    this.totalsFinancial.totalPaid = 0;
    this.totalsFinancial.totalProvisional = 0;

    if(this.BenefitTrackerData.length > 0) {
      for(let financial of this.BenefitTrackerData) {
        this.totalsFinancial.totalApproved += financial.Approved;
        this.totalsFinancial.totalPlanned += financial.Planned;
        this.totalsFinancial.totalPaid += financial.Paid;
      }
    }
  }

  exportBDTToExcel() {
    this.MonitoringCatalogService.downloadBenefitMonitorExcel(this.proyectoSelected?.idprojects ,this.rpSelected.join(','), this.proyectoSelected?.ProjectName, this.token?.access_token)
  }
}
