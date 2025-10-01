import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ActualRequest, HistoryActualRequests, TransactionDetails } from 'src/app/interfaces/Monitor/requests.interface';

@Component({
  selector: 'dash-financial',
  templateUrl: './dash-financial.component.html',
  styleUrls: ['./dash-financial.component.scss']
})
export class DashFinancialComponent {

  items!: MenuItem[];
  products!: any[];
  visible: boolean = false;
  actualRequests: any[] = [];
  loading: boolean = true;
  selectedRequest!: ActualRequest;
  token: any;
  transactionDetails: TransactionDetails[] = [];
  loadingTransactions: boolean = false;
  requestInfo!: TransactionDetails | null;
  historyActualRequests: HistoryActualRequests[] = [];
  StatusAuthorizations: any[] = []
  relUsersAndAccounts: any[] = [];

  optionStatusSelected: any;
  justification: string = '';

  disabledButton: boolean = false;
  constructor(
    private MonitoringCatalogService: MonCatalogService, 
    private _authGuardService: authGuardService,
    private messageService: MessageService,
  ) { 
    this.token = this._authGuardService.getToken(); 
  }

  ngOnInit() {
    this.getStatusAuthorizations();
    this.getActualRequests();
    this.getConfigUsersAndAccounts();

    this.items = [
      {
        label: 'View History',
        routerLink: ''
      }
    ]
  }

  getActualRequests() {
    this.MonitoringCatalogService.getActualRequests(this.token?.access_token)
      .subscribe((response: any) => {
        if (response.valido === 1) {
          this.actualRequests = response.result;
          this.loading = false;
        } else {
          console.error("Error al obtener requests:", response.message);
          this.loading = false;
        }
      });
  }

  getStatusAuthorizations() {
    this.MonitoringCatalogService.getStatusAuthorizations(this.token?.access_token).subscribe((response: any) => {
        if (response.valido === 1) {
          this.StatusAuthorizations = response.result;
        } else {
          console.error("Error al obtener requests:", response.message);
        }
    });
  }

  getConfigUsersAndAccounts() {
    this.MonitoringCatalogService.getConfigUsersAndAccounts(this.token?.access_token).subscribe((response: any) => {
        if (response.valido === 1) {
          this.relUsersAndAccounts = response.result;
        } else {
          console.error("Error al obtener requests:", response.message);
        }
    });
  }

  showDialog(request?: any) {
    this.selectedRequest = request;
    this.visible = true;
    if (request) {
      this.loadTransactionDetails(request.Idactualreviewrequest);
      this.loadgetHistoryActualRequest(request.Idactualreviewrequest);
      
    }
  }

  hideDialog(){
    this.visible = false;
    this.selectedRequest = undefined!;
    this.transactionDetails = [];
    this.requestInfo = null;
    this.historyActualRequests = [];
    this.optionStatusSelected = null;
    this.justification = '';
    this.disabledButton = false;
  }

  loadgetHistoryActualRequest(idActualReviewRequest: number) {
    this.MonitoringCatalogService.getHistoryActualRequest(
      idActualReviewRequest, 
      this.token?.access_token
    ).subscribe((response: any) => {
      if (response.valido === 1) {
        this.historyActualRequests = response.result;
      } else {
        console.error("Error al cargar historial:", response.message);
      }
    });
  }

  loadTransactionDetails(idActualReviewRequest: number) {
    this.loadingTransactions = true;
    this.MonitoringCatalogService.getTransactionsDetailsByID(
      idActualReviewRequest, 
      this.token?.access_token
    ).subscribe((response: any) => {
      if (response.valido === 1 && response.result.length > 0) {
        this.transactionDetails = response.result;
        this.requestInfo = response.result[0]; 
        this.loadingTransactions = false;
      } else {
        console.error("Error al cargar transacciones:", response.message);
        this.transactionDetails = [];
        this.requestInfo = undefined!;
        this.loadingTransactions = false;
      }
    });
  }

  getTotalAmount(): number {
    return this.transactionDetails.reduce((sum, t) => sum + t.Original_Amount_USD, 0);
  }
  
  getTotalTransactions(): number {
    return this.transactionDetails.length > 0 
      ? this.transactionDetails[0].TotalTransacciones 
      : 0;
  }

  saveChanges(){
    if(this.disabledButton) return; /** block multiples peticiones */

    if(!this.optionStatusSelected || !this.justification){
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Option and Justification are required.'});
    }

    const catchUsersValidateByAccount = this.relUsersAndAccounts.find(ua => ua.idcapexsubaccount === this.requestInfo?.Newidcapexsubaccount || ua.idopexsubaccount === this.requestInfo?.Newidopexsubaccount);
    if(!catchUsersValidateByAccount){
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No users assigned to validate this account.'});
    }

    console.log(catchUsersValidateByAccount);

    this.disabledButton = true;

    let typeOfAutho = catchUsersValidateByAccount.IdUsertechnicaldirector > 0 ? 2 : 1;

    let data = {
      Idactualreviewrequest: this.selectedRequest?.Idactualreviewrequest,
      iduserautho: this.token?.userId,
      idstatusautho: this.optionStatusSelected,
      AuthorizationComment: this.justification,
      typeOfAutho: typeOfAutho,
    }

    console.log(data);
    
    this.MonitoringCatalogService.setAuthotizationRequest(data, this.token?.access_token).subscribe((response: any) => {
      if (response.valido === 1) {
        if(response.result[0].result.includes("Error")){
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.result[0].result});
        } else {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Changes saved successfully.'});
        }
        this.hideDialog();
        this.getActualRequests();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while saving changes.'});
      }
    });
  }

    isValidStatus(status: number): string {
    switch (status) {
      case 1:
        return 'status-approved';
      case 2:
        return 'status-negate';
      case 3:
        return 'status-negate';
      default:
        return ''; // sin clase si no hay match
    }
  }
}