import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { DateRangesByProject, FinancialTracker } from 'src/app/interfaces/Monitor/SummaryActivities.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { CapexOpexAccountsService } from 'src/app/services/Tools/CapexOpexAccounts.service';
import { MessageService } from 'primeng/api';
interface City {
  name: string;
  code: number;
}
@Component({
  selector: 'app-financial-tracker',
  templateUrl: './Financial-tracker.component.html',
  styleUrls: ['./Financial-tracker.component.css'],
  providers: [MessageService]
})
export class FinancialTrackerComponent {
    showSubAccountModal: boolean = false;
    selectedSubAccount: any = null;
    totalGeneral: number = 0;  
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
    newRP: number | null = null; 
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
      private messageService: MessageService,
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

    openSubAccountModal(subAccount: any, accountName?: string) {
      this.selectedSubAccount = {
        ...subAccount,
        parentAccountName: accountName  
      };
      
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
            this.subAccountTransactions = [];
            this.transactionList = [];
          }
        });
    }

    transformTransactionsForTable(backendTransactions: any[]) {
      this.transactionList = backendTransactions.map((transaction, index) => ({
        id: transaction.IdP_R_Estructurada,
        paymentDate: new Date(transaction.Created).toLocaleDateString('es-MX', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        }),
        amount: `$${transaction.Amount_USD.toFixed(2)}`,
        selected: false,
        originalData: transaction
      }));
      
      this.totalGeneral = this.transactionList.reduce((total, transaction) => {
        const amount = parseFloat(transaction.amount.replace('$', '').replace(',', ''));
        return total + amount;
      }, 0);
      
      this.selectAllTransactions = false;
    }

    hasSelectedTransactions(): boolean {
      return this.transactionList.some(transaction => transaction.selected);
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
      this.newSubAccount = '';
      this.justification = '';
      this.typeAccounts = 0; 
      this.currentSubAccountOptions = [];
    }


    closeRevisionModal() {
        this.showSubAccountModal = false;
        this.selectedSubAccount = null;
        this.transactionList = [];
        this.resetFormData();
    }
    // typeAccountSelected(event: any) {
    //   if (event.value == 1) {
    //     this.newSubAccount = ''; 
    //     this.typeAccounts = 1;
    //     this.loadCapexSubAccounts(); 
    //   }

    //   if (event.value == 2) {
    //     this.newSubAccount = ''; 
    //     this.typeAccounts = 2;
    //     this.loadOpexSubAccounts(); 
    //   }
    // }

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
        label: `${rp.RP_Number}`,
        value: rp.idrpnumber
      }));

      this.loadSubAccountsAndSetDefault();
    }

    loadSubAccountsAndSetDefault() {
      Promise.all([
        this.loadCapexSubAccountsAsync(),
        this.loadOpexSubAccountsAsync()
      ]).then(() => {
        this.setDefaultRP();
      });
    }

    loadCapexSubAccountsAsync(): Promise<void> {
      return new Promise((resolve) => {
        this.capexOpexAccountsService.getCapexSubaccounts(this.token?.access_token)
          .subscribe((response: any) => {
            if (response.valido === 1) {
              this.CuentasCapex = response.result;
            } else {
              console.error("Error al cargar subcuentas CAPEX:", response.message);
              this.CuentasCapex = [];
            }
            resolve();
          });
      });
    }

    loadOpexSubAccountsAsync(): Promise<void> {
      return new Promise((resolve) => {
        this.capexOpexAccountsService.getOpexSubaccounts(this.token?.access_token)
          .subscribe((response: any) => {
            if (response.valido === 1) {
              this.CuentasOpex = response.result;
            } else {
              console.error("Error al cargar subcuentas OPEX:", response.message);
              this.CuentasOpex = [];
            }
            resolve();
          });
      });
    }

    setDefaultRP() {
      const currentRP = this.selectedSubAccount.idrpnumber;
      
      this.newRP = currentRP;
      
      this.updateSubAccountsBasedOnRP(currentRP);
    }

    updateSubAccountsBasedOnRP(rpValue: number) {
      if (rpValue === 1) {
        this.typeAccounts = 1;
        this.currentSubAccountOptions = [...this.CuentasCapex];
      } else if (rpValue >= 2) {
        this.typeAccounts = 2;
        this.currentSubAccountOptions = [...this.CuentasOpex];
      } else {
        this.typeAccounts = 0;
        this.currentSubAccountOptions = [];
      }
    }


    onRPSelected() {
      if (this.newRP) {
        this.updateSubAccountsBasedOnRP(this.newRP);
      } else {
        this.setDefaultRP();
      }
      
      this.newSubAccount = '';
    }
 


    sendRevisionRequest() {
      const selectedTransactions = this.transactionList.filter(t => t.selected);
      
      if (selectedTransactions.length === 0) {
        this.messageService.add({
          severity: 'warn', 
          summary: 'Warning', 
          detail: 'You must select at least one transaction to continue'
        });
        return;
      }

      if (!this.justification.trim()) {
        this.messageService.add({
          severity: 'warn', 
          summary: 'Warning', 
          detail: 'You must provide a justification'
        });
        return;
      }

      if (!this.newRP && !this.newSubAccount) {
        this.messageService.add({
          severity: 'warn', 
          summary: 'Warning', 
          detail: 'You must select at least one RP or Subaccount to make the change'
        });
        return;
      }

      const currentRP = this.selectedSubAccount.idrpnumber;
      const currentSubAccountId = this.selectedSubAccount.idcapexaccount || this.selectedSubAccount.idopexaccount;
      const finalRP = this.newRP || currentRP;

      if (finalRP === currentRP && !this.newSubAccount) {
        this.messageService.add({
          severity: 'warn', 
          summary: 'Warning', 
          detail: 'You cannot move transactions to the same RP without selecting a different subaccount'
        });
        return;
      }

      if (finalRP === currentRP && this.newSubAccount === currentSubAccountId) {
        this.messageService.add({
          severity: 'warn', 
          summary: 'Warning', 
          detail: 'You cannot move transactions to the same RP and subaccount. No changes would be made'
        });
        return;
      }

      const ledgerType = finalRP === 1 ? "Capex" : "Opex";
      const isCapex = finalRP === 1;
      
      const subAccountId = isCapex 
        ? (this.newSubAccount || this.selectedSubAccount.idcapexaccount)
        : (this.newSubAccount || this.selectedSubAccount.idopexaccount);

      const requests = selectedTransactions.map(transaction => {
        const baseRequest = {
          IdP_R_Estructurada: transaction.originalData.IdP_R_Estructurada,
          New_idrpnumber: finalRP
        };

        if (isCapex) {
          return {
            ...baseRequest,
            New_idcapexsubaccount: this.newSubAccount,
            New_CompaqCapex: this.getCompaqCode('capex')
          };
        } else {
          return {
            ...baseRequest,
            New_idopexsubaccount: this.newSubAccount,
            New_CompaqOpex: this.getCompaqCode('opex')
          };
        }
      });

      const requestBody = {
        idprojects: this.proyectoSelected?.idprojects,
        ledgerType: ledgerType,
        idrpnumber: finalRP,
        idsubaccount: subAccountId,
        justification: this.justification, 
        requests: requests
      };

      console.log('requestBody:', JSON.stringify(requestBody, null, 2));

      this.MonitoringCatalogService.setReviewActualRequest(requestBody, this.token?.access_token)
        .subscribe(
          (response: any) => {
            if (response.valido === 1) {
              this.messageService.add({
                severity: 'success', 
                summary: 'Success', 
                detail: 'Request sent successfully'
              });
              this.closeRevisionModal();
            } else {
              this.messageService.add({
                severity: 'error', 
                summary: 'Error', 
                detail: response.message || 'Error sending request'
              });
            }
          },
          (error: any) => {
            console.error(error);
            this.messageService.add({
              severity: 'error', 
              summary: 'Error', 
              detail: 'Server connection error'
            });
          }
        );
    }

    private getCompaqCode(type: 'capex' | 'opex'): string | null {
      if (type === 'capex') {
        const capexAccount = this.CuentasCapex.find(account => 
          account.idcapexsubaccount === this.newSubAccount
        );
        return capexAccount?.cuentacompaq || null;
      } else {
        const opexAccount = this.CuentasOpex.find(account => 
          account.idopexsubaccount === this.newSubAccount
        );
        return opexAccount?.cuentacompaq || null;
      }
    }
 }
