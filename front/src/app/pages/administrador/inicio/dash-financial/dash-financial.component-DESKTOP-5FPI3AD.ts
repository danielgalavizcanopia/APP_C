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
        routerLink: '/histoReview'
      }
    ]
  }

  getActualRequests() {
    this.MonitoringCatalogService.getActualRequests(this.token?.access_token)
      .subscribe((response: any) => {
        console.log('getActualRequests:', response);
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

  getStatusCircles(request: any): any[] {
    const circles: any[] = [];
    
    const votedRoles = request.AllAuthorizersWithRoles 
      ? request.AllAuthorizersWithRoles.split(',').map((r: string) => r.trim())
      : [];
    
    const allRequiredRoles = this.getAllRolesForSubAccount(request);
    const lastVoter = request.LastAuthorizerWithRole ? request.LastAuthorizerWithRole.trim() : null;
    
    const statusMatch = request.CurrentStatusDescription?.match(/In progress \((\d+)\/(\d+)\)/);
    
    if (request.CurrentStatusDescription === 'Approved') {
      if (votedRoles.length === 2) {
        votedRoles.forEach((role: string) => {
          circles.push({
            tooltip: `${role} - Approved`,
            statusClass: 'status-approved',
            isPending: false
          });
        });
      } else {
        allRequiredRoles.forEach((role: string) => {
          circles.push({
            tooltip: `${role} - Approved`,
            statusClass: 'status-approved',
            isPending: false
          });
        });
      }
    } else if (request.CurrentStatusDescription === 'Rechazed') {
      
      if (votedRoles.length === 3) {
        votedRoles.forEach((role: string) => {
          if (role !== lastVoter) {
            circles.push({
              tooltip: `${role} - Approved`,
              statusClass: 'status-approved',
              isPending: false
            });
          }
        });
        if (lastVoter) {
          circles.push({
            tooltip: `${lastVoter} - Rejected`,
            statusClass: 'status-negate',
            isPending: false
          });
        }
        
      } else if (votedRoles.length === 2) {
        const approvedRole = votedRoles.find((role: string) => role !== lastVoter);
        const pendingRoles = allRequiredRoles.filter((role: string) => !votedRoles.includes(role));
        
        if (approvedRole) {
          circles.push({
            tooltip: `${approvedRole} - Approved`,
            statusClass: 'status-approved',
            isPending: false
          });
        }
        
        if (lastVoter) {
          circles.push({
            tooltip: `${lastVoter} - Rejected`,
            statusClass: 'status-negate',
            isPending: false
          });
        }
        
        pendingRoles.forEach((role: string) => {
          circles.push({
            tooltip: `${role} - Pending`,
            statusClass: 'status-pending',
            isPending: true
          });
        });
        
      } else if (votedRoles.length === 1) {
        circles.push({
          tooltip: `${votedRoles[0]} - Rejected`,
          statusClass: 'status-negate',
          isPending: false
        });
        
        allRequiredRoles.forEach((role: string) => {
          if (!votedRoles.includes(role)) {
            circles.push({
              tooltip: `${role} - Pending`,
              statusClass: 'status-pending',
              isPending: true
            });
          }
        });
      }
      
    } else if (statusMatch) {
      votedRoles.forEach((role: string) => {
        circles.push({
          tooltip: `${role} - Approved`,
          statusClass: 'status-approved',
          isPending: false
        });
      });
      
      allRequiredRoles.forEach((role: string) => {
        if (!votedRoles.includes(role)) {
          circles.push({
            tooltip: `${role} - Pending`,
            statusClass: 'status-pending',
            isPending: true
          });
        }
      });
      
    } else {
      allRequiredRoles.forEach((role: string) => {
        circles.push({
          tooltip: `${role} - Pending`,
          statusClass: 'status-pending',
          isPending: true
        });
      });
    }
    
    return circles;
  }

  getAllRolesForSubAccount(request: any): string[] {
    const config = this.relUsersAndAccounts.find(ua => {
      const matchCapex = request.LedgerType === 'Capex' && ua.idcapexsubaccount === request.idsubaccount;
      const matchOpex = request.LedgerType === 'Opex' && ua.idopexsubaccount === request.idsubaccount;
      return matchCapex || matchOpex;
    });
    
    if (!config) {
      return ['Financial Evaluator', 'Manager', 'Technical Director'];
    }
    
    const roles: string[] = [];
    
    if (config.name_financial_evaluator) {
      roles.push('Financial Evaluator');
    }
    if (config.name_user) {
      roles.push('Manager');
    }
    if (config.name_technical_director) {
      roles.push('Technical Director');
    }
    
    return roles.length > 0 ? roles : ['Financial Evaluator', 'Manager', 'Technical Director'];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rechazed':
      case 'rejected': return 'status-negate';
      default: return 'status-pending';
    }
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
    if(this.disabledButton) return;

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
      this.disabledButton = false;
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
        return '';
    }
  }
}