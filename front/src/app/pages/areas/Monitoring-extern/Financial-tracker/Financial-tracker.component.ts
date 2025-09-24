import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { DateRangesByProject, FinancialTracker } from 'src/app/interfaces/Monitor/SummaryActivities.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { CapexOpexAccountsService } from 'src/app/services/Tools/CapexOpexAccounts.service';

interface City {
  name: string;
  code: number;
}
@Component({
  selector: 'app-financial-tracker',
  templateUrl: './Financial-tracker.component.html',
  styleUrls: ['./Financial-tracker.component.css'],
})
export class FinancialTrackerComponent {
    showSubAccountModal: boolean = false;
    selectedSubAccount: any = null;
    subAccountTransactions: any[] = [];
    selectAllTransactions: boolean = false
    cities: City[] = [
      { name: 'CAPEX', code: 1 },
      { name: 'OPEX', code: 2 }
    ];
    typeAccounts: number = 0; 
    CuentasCapex: any[] = [];
    CuentasOpex: any[] = [];
      
    capexSubAccounts: any[] = [];
    opexSubAccounts: any[] = [];
  
    currentSubAccountOptions: any[] = [];

    transactionList: any[] = [];
    totalSelected: number = 0;
    
    transactionOptions: any[] = [];
    rpOptions: any[] = [];
    subAccountOptions: any[] = [];
    
    selectedTransaction: string = '';
    newRP: string = '';
    newSubAccount: string = '';
    justification: string = '';

    token: any;
    proyectoSelected: Projects | null = null;
    
    FinancialTrackerData: FinancialTracker[] = [];
    totalsFinancial: any = {
      totalAssembly: 0,
      totalApproved: 0,
      totalPlanned: 0,
      totalPaid: 0,
      totalProvisional: 0,
    };
    rpSelected: any;
    rpnumbers: any[] = [];

    LastUpdatePaid!: string;
    LastUpdateProvisional!: string;
    messageProvisionalReport: string = 'This transactional report has not been validated by Finance.';

    loading: boolean = true;
    @Output() evento = new EventEmitter<string>();

    dateRanges!: DateRangesByProject;

    constructor(
      public _authGuardService: authGuardService,
      readonly serviceObsProject$: ObservableService,
      private MonitoringCatalogService: MonCatalogService,
      private RPcatalogsService: RPCatalogsService,
      private capexOpexAccountsService: CapexOpexAccountsService,
    ){
      this.token = this._authGuardService.getToken();
      this.observaProjectSelected();
      this.getRPnumber();
        this.cities = [
        { name: 'CAPEX', code: 1 },
        { name: 'OPEX', code: 2 }
      ];
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
            // this.rpSelected = this.rpnumbers[0].idrpnumber
        }
      });
    }

    changeRP(){
      if(this.rpSelected){
        this.getFinancialTracker();
        this.getRangeRPByDates();
      } else {
        this.FinancialTrackerData = [];
        this.totalsFinancial = {
          totalAssembly: 0,
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
      this.MonitoringCatalogService.getFinancialTracker(this.rpSelected.join(','), this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.FinancialTrackerData = response.result;
            this.getCatchTotals(); /** OBTIENE TOTALES DE LAS COLUMNAS APPROVED, PLANNED, ACTUAL, PROVISIONAL */
            this.UpdatePaid(); /** OBTIENE LA FECHA DE CORTE DE LA COLUMNA ACTUAL */
            this.UpdateProvisional(); /** OBTIENE LA FECHA DE CORTE DE LA COLUMNA PROVISIONAL, ESTA SE ACTUALIZA A DIARIO */
            this.loading = false;
        } else {
            console.error("No se pudo traer la información de getFinancialTracker", response.message)
        }
      })
    }

    getRangeRPByDates(){
      this.MonitoringCatalogService.getRangeRPByDates(this.rpSelected.join(','), this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.dateRanges = response.result[0];
        } else {
            console.error("No se pudo traer la información de getFinancialTracker", response.message)
        }
      })
    }

    getCatchTotals(){
      this.totalsFinancial.totalAssembly = 0;
      this.totalsFinancial.totalApproved = 0;
      this.totalsFinancial.totalPlanned = 0;
      this.totalsFinancial.totalPaid = 0;
      this.totalsFinancial.totalProvisional = 0;

      if(this.FinancialTrackerData.length > 0) {
        for(let financial of this.FinancialTrackerData) {
          this.totalsFinancial.totalAssembly += financial.Assembly;
          this.totalsFinancial.totalApproved += financial.Approved;
          this.totalsFinancial.totalPlanned += financial.Planned;
          this.totalsFinancial.totalPaid += financial.Paid;
          this.totalsFinancial.totalProvisional += financial.Provisional;
        }
      }
    }

    UpdateProvisional(){
      const fecha = new Date();
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const anio = fecha.getFullYear();
      

      this.LastUpdateProvisional = `Last update: ${dia}/${mes}/${anio}`;
    }

    UpdatePaid(){
      const fecha = new Date();
      const dosMesesAtras = new Date(fecha.getFullYear(), fecha.getMonth() - 2, 1);
      const lastDay = new Date(dosMesesAtras.getFullYear(), dosMesesAtras.getMonth() + 1, 0);

      const dia = lastDay.getDate().toString().padStart(2, '0');
      const mes = (lastDay.getMonth() + 1).toString().padStart(2, '0');
      const anio = lastDay.getFullYear();

      this.LastUpdatePaid = `Last update: ${dia}/${mes}/${anio}`;
    }

    exportFTToExcel() {
      this.MonitoringCatalogService.downloadFTMonitorExcel(this.proyectoSelected?.idprojects ,this.rpSelected.join(','), this.proyectoSelected?.ProjectName, this.token?.access_token)
    }

    exportProvisionalReport() {
      this.MonitoringCatalogService.downloadProvisionalReport(this.proyectoSelected?.Folio_project, this.proyectoSelected?.ProjectName, this.proyectoSelected?.idprojects, this.rpSelected.join(','), this.token?.access_token)
    }

  enviarRPs() {
    this.evento.emit(this.rpSelected.join(','));
  }

    openSubAccountModal(subAccount: any) {
      this.selectedSubAccount = subAccount;
      
      if (!this.selectedSubAccount.type) {
        if (subAccount.idcapexaccount !== undefined && subAccount.idcapexaccount !== null) {
          this.selectedSubAccount.type = 'CAPEX';
        } else if (subAccount.idopexaccount !== undefined && subAccount.idopexaccount !== null) {
          this.selectedSubAccount.type = 'OPEX';
        }
      }
      
      this.showSubAccountModal = true;
      
      this.loadSubAccountTransactions(subAccount);
      this.loadDropdownOptions();
      this.resetFormData();
    }

    loadSubAccountTransactions(subAccount: any) {
      const isCapex = subAccount.idcapexaccount !== undefined && subAccount.idcapexaccount !== null;
      const isOpex = subAccount.idopexaccount !== undefined && subAccount.idopexaccount !== null;
      
      const requestData = {
        idprojects: this.proyectoSelected?.idprojects,
        idrpnumber: subAccount.idrpnumber,
        idcapexsubaccount: isCapex ? subAccount.idcapexaccount : null,
        idopexsubaccount: isOpex ? subAccount.idopexaccount : null
      };


      this.MonitoringCatalogService.getByAccountDetails(requestData, this.token?.access_token)
        .subscribe((response: any) => {
          if (response.valido === 1) {
            this.subAccountTransactions = response.result;
            this.transformTransactionsForTable(response.result);
            this.calculateTransactionTotals();
          } else {
            console.error("Error al cargar detalles de la subcuenta:", response.message);
            this.subAccountTransactions = [];
            this.transactionList = [];
          }
        });
    }

    transformTransactionsForTable(backendTransactions: any[]) {
      this.transactionList = backendTransactions.map((transaction, index) => ({
        id: `TXN-${transaction.idrpnumber}-${index + 1}`,
        paymentDate: new Date(transaction.Created).toLocaleDateString('es-MX', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        }),
        amount: `$${transaction.Amount_USD.toFixed(2)}`,
        selected: false,
        originalData: transaction
      }));
      
      this.selectAllTransactions = false;
    }

    calculateTransactionTotals() {
      this.updateTotals();
    }
  
    updateSelectedTotal() {
      this.updateTotals();
      
      const selectedCount = this.getSelectedTransactionsCount();
      const totalCount = this.transactionList.length;
      
      this.selectAllTransactions = selectedCount > 0 && selectedCount === totalCount;
    }

    private updateTotals() {
      this.totalSelected = this.transactionList
        .filter(transaction => transaction.selected)
        .reduce((total, transaction) => {
          const amount = parseFloat(transaction.amount.replace('$', '').replace(',', ''));
          return total + amount;
        }, 0);
    }
    
    getSelectedTransactionsCount(): number {
      return this.transactionList.filter(transaction => transaction.selected).length;
    }

  toggleAllTransactions() {
    if (this.selectAllTransactions) {
      this.transactionList.forEach(transaction => {
        transaction.selected = true;
      });
    } else {
      this.transactionList.forEach(transaction => {
        transaction.selected = false;
      });
    }
    
    this.updateSelectedTotal();
  }

  resetFormData() {
    this.transactionList = [];
    this.totalSelected = 0;
    this.selectAllTransactions = false;
    this.selectedTransaction = '';
    this.newRP = '';
    this.newSubAccount = '';
    this.justification = '';
    this.typeAccounts = 0; 
  }


    closeRevisionModal() {
        this.showSubAccountModal = false;
        this.selectedSubAccount = null;
        this.transactionList = [];
        this.resetFormData();
    }
    typeAccountSelected(event: any) {
      if (event.value == 1) {
        this.newSubAccount = ''; 
        this.typeAccounts = 1;
        this.loadCapexSubAccounts(); 
      }

      if (event.value == 2) {
        this.newSubAccount = ''; 
        this.typeAccounts = 2;
        this.loadOpexSubAccounts(); 
      }
    }

  loadCapexSubAccounts() {
    this.capexOpexAccountsService.getCapexSubaccounts(this.token?.access_token)
      .subscribe((response: any) => {
        if (response.valido === 1) {
          this.CuentasCapex = response.result;
        } else {
          console.error("Error al cargar subcuentas CAPEX:", response.message);
        }
      });
  }

  loadOpexSubAccounts() {
    this.capexOpexAccountsService.getOpexSubaccounts(this.token?.access_token)
      .subscribe((response: any) => {
        if (response.valido === 1) {
          this.CuentasOpex = response.result;
        } else {
          console.error("Error al cargar subcuentas OPEX:", response.message);
        }
      });
  }
  loadDropdownOptions() {
    this.rpOptions = this.rpnumbers.map(rp => ({
      label: ` ${rp.RP_Number}`,
      value: rp.idrpnumber
    }));

    this.loadCapexSubAccounts();
    this.loadOpexSubAccounts();

    if (this.selectedSubAccount.type === 'CAPEX') {
      this.typeAccounts = 1;
      this.currentSubAccountOptions = this.capexSubAccounts;
    } else if (this.selectedSubAccount.type === 'OPEX') {
      this.typeAccounts = 2;
      this.currentSubAccountOptions = this.opexSubAccounts;
    }
  }
 


    sendRevisionRequest() {
      const selectedTransactions = this.transactionList.filter(t => t.selected);
      
      if (selectedTransactions.length === 0) {
        console.warn('No transactions selected');
        return;
      }

      if (!this.justification.trim()) {
        console.warn('Justification is required');
        return;
      }

      const requestData = {
        projectId: this.proyectoSelected?.idprojects,
        subAccount: {
          id: this.selectedSubAccount.idcapexaccount || this.selectedSubAccount.idopexaccount,
          type: this.selectedSubAccount.type,
          currentRP: this.selectedSubAccount.idrpnumber,
          name: this.selectedSubAccount.account || this.selectedSubAccount.accountWA
        },
        selectedTransactions: selectedTransactions.map(t => ({
          transactionId: t.id,
          originalData: t.originalData,
          amount: parseFloat(t.amount.replace('$', '').replace(',', ''))
        })),
        reassignment: {
          newRP: this.newRP,
          newSubAccount: this.newSubAccount,
          justification: this.justification
        },
        totalAmount: this.totalSelected,
        requestDate: new Date().toISOString(),
        userId: this.token?.user_id || 'current_user'
      };

      console.log('Sending revision request:', requestData);
      
      // Aquí implementarías la llamada al endpoint para guardar la solicitud
      // this.MonitoringCatalogService.submitRevisionRequest(requestData, this.token?.access_token)
      //   .subscribe(response => {
      //     if (response.valido === 1) {
      //       // Mostrar mensaje de éxito
      //       this.closeRevisionModal();
      //     } else {
      //       // Mostrar mensaje de error
      //     }
      //   });

      // Por ahora solo cerrar el modal
      this.closeRevisionModal();
    }
 }
