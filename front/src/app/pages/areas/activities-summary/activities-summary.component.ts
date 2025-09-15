import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SummaryCostCapexOpex } from 'src/app/interfaces/Monitor/SummaryActivities.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { CustomerService } from 'src/app/services/customer.service';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { MonSummaryService } from 'src/app/services/MonitoringProjects/MonSummary.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ProductService } from 'src/app/services/product.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { MessageService } from 'primeng/api';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-activities-summary',
  templateUrl: './activities-summary.component.html',
  styleUrls: ['./activities-summary.component.scss']
})
export class ActivitiesSummaryComponent {

  cities!: City[];

  visibleDialog: boolean = false;


  token: any;
  customers: any[] = [];
  proyectoSelected: Projects | null = null;
  ActivityPlan: any[] = [];
  visible!: boolean;
  MonitorAvancesIE: any[] = [];

  summaryActivities: any[] = [];
  loading: boolean = true;
  summary: SummaryCostCapexOpex | any;
  total: any;
  typeView: number = 1;
  typeFileUpload: number = 0;
  capexArraytoSave: any[]= [];
  mesesDelAno: any[] = [];

  yearSelected: any;
  periodSelected: any;
  processColor: string = "";
  
  openDialog(){
    this.visibleDialog = true;
  }
  HideDialog(){
    this.visibleDialog = false;
    this.typeFileUpload = 0;
    this.capexArraytoSave = [];
  }

  constructor(private customerService: ProductService, private _fb: FormBuilder, private MonitoringCatalogService: MonCatalogService,
    public _authGuardService: authGuardService, private _summaryActivities: MonSummaryService,
    readonly serviceObsProject$: ObservableService, private messageService: MessageService) {
    this.token = this._authGuardService.getToken();
    
    this.customerService.getProductsWithOrdersLarge().then((customers) => (this.customers = customers));
    this.observaProjectSelected();
    this.cities = [ 
      {name:"RP 1" ,code: "1"},
      {name:"RP 2" ,code: "2"},
      {name:"RP 3" ,code: "3"},
      {name:"RP 4" ,code: "4"},
      {name:"RP 5" ,code: "5"},
      {name:"RP 6" ,code: "6"},
      {name:"RP 7" ,code: "7"},
      {name:"RP 8" ,code: "8"},
      {name:"RP 9" ,code: "9"},
      {name:"RP 10" ,code: "10"}
    ]
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.getSumTotalCapexOpexEC();
        this.yearSelected = new Date()
        this.getSummaryActivitiesByProject(new Date())
      } else {
      }
    });
  }

  getSummaryActivitiesByProject(year: Date){
    
    this._summaryActivities.getSummaryActivitiesByProject(this.proyectoSelected?.idprojects, year.getFullYear(), this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.summaryActivities = response.result;
          this.periodSelected = response.result[0];
          this.loading = false
          if(this.periodSelected){
            const rangoAnios = [new Date(this.periodSelected?.Reporting_period_start).getFullYear(), new Date(this.periodSelected?.Reporting_period_end).getFullYear()];  // Puedes cambiar estos años según sea necesario
            this.mesesDelAno = this.generarMesesDelAno(rangoAnios);
          } else {
              this.mesesDelAno = [
                {id: 1, mes: 'Enero'},
                {id: 2, mes: 'Febrero'},
                {id: 3, mes: 'Marzo'},
                {id: 4, mes: 'Abril'},
                {id: 5, mes: 'Mayo'},
                {id: 6, mes: 'Junio'},
                {id: 7, mes: 'Julio'},
                {id: 8, mes: 'Agosto'},
                {id: 9, mes: 'Septiembre'},
                {id: 10, mes: 'Octubre'},
                {id: 11, mes: 'Noviembre'},
                {id: 12, mes: 'Diciembre'},
              ];
          }
      } else {
          console.error("No se pudo traer la información de getTypeActivities", response.message)
      }
    })
  }

  getSumTotalCapexOpexEC(){
    this._summaryActivities.getSumTotalCapexOpexEC(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido == 1){
          this.summary = response.result[0];
          this.total = this.summary?.Totalcapex + this.summary?.Totalopex;
      } else {
          console.error("No se pudo traer la información de getTypeActivities", response.message)
      }
    })
  }

  generarMesesDelAno(rangoAnios: number[]): any[] {
    const mesesDelAno: any[] = [];
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    rangoAnios.forEach(year => {
        nombresMeses.forEach((mes, index) => {
            mesesDelAno.push({ id: index + 1, mes: mes + ' ' + year, year: year });
        });
    });

    return mesesDelAno;
  }

  getMonthBackgroundCell(beginString: string, enddateString: string, idmes: number, year: number, customer: any): any {
    const begindate = new Date(beginString);
    const enddate = new Date(enddateString);
    
    const beginMonth = begindate.getUTCMonth() + 1;
    const beginYear = begindate.getUTCFullYear();
    const endMonth = enddate.getUTCMonth() + 1;
    const endYear = enddate.getUTCFullYear();

    if((beginMonth == idmes && beginYear == year) || (endMonth == idmes && endYear == year)){
        switch (customer.StatusDesarrollo) {
            case 'En Proceso':
                return this.processColor = "#088F83";
            case 'Terminada':
                return this.processColor = "#D1410D";  
            case 'Planificada':
                return this.processColor = "#E3F0EA";  
            default:
                break;
        }
    } else {
        return this.processColor = "#FFFFFF";
    }
}

  // onUpload(event: any) {
  //   const file = event.files[0];

  //   if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
  //     this.messageService.add({severity:'error', summary:'Error', detail:'This file is not a CSV format'});
  //     return;
  //   }

  //   Papa.parse(file, {
  //     header: true,
  //     complete: (result: any) => {
  //       this.capexArraytoSave = result.data;
  //     }
  //   });
  // }

  save(){
    if(!this.typeFileUpload || this.typeFileUpload == 0){
      return this.messageService.add({severity:'error', summary:'Error', detail:'Please, select a Category'});
    }

    if(this.capexArraytoSave.length == 0){
      return this.messageService.add({severity:'error', summary:'Error', detail:'You dont select a File'});
    }

    let data = {
      summary: this.capexArraytoSave,
      typeCapex: this.typeFileUpload
    }

    this._summaryActivities.setSummaryMoves(data, this.token?.access_token).subscribe((response: any) => {
      if(response.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Data file Saved!', detail: "The Data was saved successfully"});
        this.visibleDialog = false;
        this.typeFileUpload = 0;
        this.capexArraytoSave = [];
      } else {
        this.messageService.add({ severity: 'error', summary: 'Data file Saved!', detail: response?.message});
      }
    })
  }

}
