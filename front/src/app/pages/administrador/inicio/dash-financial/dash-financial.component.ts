import { Component, ViewChild } from '@angular/core';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ActualRequest, HistoryActualRequests, TransactionDetails } from 'src/app/interfaces/Monitor/requests.interface';
import { Table } from 'primeng/table';


@Component({
  selector: 'dash-financial',
  templateUrl: './dash-financial.component.html',
  styleUrls: ['./dash-financial.component.scss']
})
export class DashFinancialComponent {
  @ViewChild('dt1') dt1!: Table;
  
  handleGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dt1.filterGlobal(input.value, 'contains');
  }
  canUserEdit: boolean = false;
  items!: MenuItem[];
  visible: boolean = false;
  actualRequests: any[] = [];
  loading: boolean = true;
  selectedRequest!: ActualRequest;
  token: any;
  transactionDetails: TransactionDetails[] = [];
  loadingTransactions: boolean = false;
  requestInfo!: TransactionDetails | null;
  historyActualRequests: HistoryActualRequests[] = [];
  StatusAuthorizations: any[] = [];
  relUsersAndAccounts: any[] = [];

  optionStatusSelected: any;
  justification: string = '';
  disabledButton: boolean = false;

  constructor(
    private MonitoringCatalogService: MonCatalogService, 
    private _authGuardService: authGuardService,
    private messageService: MessageService,
      private confirmationService: ConfirmationService 
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
    ];
  }

  getActualRequests() {
    this.MonitoringCatalogService.getActualRequests(this.token?.access_token)
      .subscribe((response: any) => {
        if (response.valido === 1) {
          this.actualRequests = response.result;
          this.loading = false;
        } else {
          console.error("Error getting requests:", response.message);
          this.loading = false;
        }
      });
  }

  getStatusAuthorizations() {
    this.MonitoringCatalogService.getStatusAuthorizations(this.token?.access_token)
      .subscribe((response: any) => {
        if (response.valido === 1) {
          this.StatusAuthorizations = response.result;
        } else {
          console.error("Error getting status authorizations:", response.message);
        }
      });
  }

  getConfigUsersAndAccounts() {
    this.MonitoringCatalogService.getConfigUsersAndAccounts(this.token?.access_token)
      .subscribe((response: any) => {
        if (response.valido === 1) {
          this.relUsersAndAccounts = response.result;
        } else {
          console.error("Error getting config:", response.message);
        }
      });
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
    
    if (config.IdUserFinancialEvaluator && config.IdUserFinancialEvaluator > 0) {
      roles.push('Financial Evaluator');
    }
    if (config.IDUser && config.IDUser > 0) {
      roles.push('Manager');
    }
    if (config.IdUsertechnicaldirector && config.IdUsertechnicaldirector > 0) {
      roles.push('Technical Director');
    }
    
    return roles.length > 0 ? roles : ['Financial Evaluator', 'Manager'];
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
            order: 1
          });
        });
      } else {
        allRequiredRoles.forEach((role: string) => {
          circles.push({
            tooltip: `${role} - Approved`,
            statusClass: 'status-approved',
            order: 1
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
              order: 1
            });
          }
        });
        if (lastVoter) {
          circles.push({
            tooltip: `${lastVoter} - Rejected`,
            statusClass: 'status-negate',
            order: 2
          });
        }
        
      } else if (votedRoles.length === 2) {
        const approvedRole = votedRoles.find((role: string) => role !== lastVoter);
        const pendingRoles = allRequiredRoles.filter((role: string) => !votedRoles.includes(role));
        
        if (approvedRole) {
          circles.push({
            tooltip: `${approvedRole} - Approved`,
            statusClass: 'status-approved',
            order: 1
          });
        }
        
        if (lastVoter) {
          circles.push({
            tooltip: `${lastVoter} - Rejected`,
            statusClass: 'status-negate',
            order: 2
          });
        }
        
        pendingRoles.forEach((role: string) => {
          circles.push({
            tooltip: `${role} - Pending`,
            statusClass: 'status-pending',
            order: 3
          });
        });
        
      } else if (votedRoles.length === 1) {
        circles.push({
          tooltip: `${votedRoles[0]} - Rejected`,
          statusClass: 'status-negate',
          order: 2
        });
        
        allRequiredRoles.forEach((role: string) => {
          if (!votedRoles.includes(role)) {
            circles.push({
              tooltip: `${role} - Pending`,
              statusClass: 'status-pending',
              order: 3
            });
          }
        });
      }
      
    } else if (statusMatch) {
      votedRoles.forEach((role: string) => {
        circles.push({
          tooltip: `${role} - Approved`,
          statusClass: 'status-approved',
          order: 1
        });
      });
      
      allRequiredRoles.forEach((role: string) => {
        if (!votedRoles.includes(role)) {
          circles.push({
            tooltip: `${role} - Pending`,
            statusClass: 'status-pending',
            order: 3
          });
        }
      });
      
    } else {
      allRequiredRoles.forEach((role: string) => {
        circles.push({
          tooltip: `${role} - Pending`,
          statusClass: 'status-pending',
          order: 3
        });
      });
    }
    
    circles.sort((a, b) => a.order - b.order);
    return circles;
  }

  isUserAuthorizedToEvaluate(request: any): boolean {
    const currentUserId = this.token?.userId;
    
    if (!currentUserId) return false;
    
    const config = this.relUsersAndAccounts.find(ua => 
      (request.LedgerType === 'Capex' && ua.idcapexsubaccount === request.idsubaccount) ||
      (request.LedgerType === 'Opex' && ua.idopexsubaccount === request.idsubaccount)
    );
    
    if (!config) return false;
    
    return config.IDUser === currentUserId || 
           config.IdUsertechnicaldirector === currentUserId || 
           config.IdUserFinancialEvaluator === currentUserId;
  }

  showDialog(request?: any) {
    this.selectedRequest = request;
    this.visible = true;
    this.canUserEdit = this.isUserAuthorizedToEvaluate(request);
    
    if (request) {
      this.loadTransactionDetails(request.Idactualreviewrequest);
      this.loadgetHistoryActualRequest(request.Idactualreviewrequest);
    }
  }

  hideDialog() {
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
        console.error("Error loading history:", response.message);
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
        console.error("Error loading transactions:", response.message);
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

  saveChanges() {
    if (this.disabledButton) return;

    if (!this.optionStatusSelected || !this.justification) {
      return this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Option and Justification are required.'
      });
    }

    const catchUsersValidateByAccount = this.relUsersAndAccounts.find(ua => 
      ua.idcapexsubaccount === this.requestInfo?.Newidcapexsubaccount || 
      ua.idopexsubaccount === this.requestInfo?.Newidopexsubaccount
    );
    
    if (!catchUsersValidateByAccount) {
      return this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No users assigned to validate this account.'
      });
    }

    this.disabledButton = true;

    let typeOfAutho = catchUsersValidateByAccount.IdUsertechnicaldirector > 0 ? 2 : 1;

    let data = {
      Idactualreviewrequest: this.selectedRequest?.Idactualreviewrequest,
      iduserautho: this.token?.userId,
      idstatusautho: this.optionStatusSelected,
      AuthorizationComment: this.justification,
      typeOfAutho: typeOfAutho,
    };
    
    this.MonitoringCatalogService.setAuthotizationRequest(data, this.token?.access_token)
      .subscribe((response: any) => {
        if (response.valido === 1) {
          if (response.result[0].result.includes("Error")) {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: response.result[0].result
            });
          } else {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Changes saved successfully.'
            });
          }
          this.hideDialog();
          this.getActualRequests();
        } else {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'An error occurred while saving changes.'
          });
        }
        this.disabledButton = false;
      });
  }

  isValidStatus(status: number): string {
    switch (status) {
      case 1:
        return 'status-approved';
      case 2:
      case 3:
        return 'status-negate';
      default:
        return '';
    }
  }
  confirmDeleteRequest(event: Event) {
    this.confirmationService.confirm({
      target: event.target ? event.target : undefined,
      message: 'Are you sure you want to delete this record?',
      header: 'Confirm deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRequest();
      }
    });
  }

  deleteRequest() {
    if (this.disabledButton) return;

    this.disabledButton = true;

    const data = {
      Idactualreviewrequest: this.selectedRequest?.Idactualreviewrequest
    };

    console.log('Deleting request:', data);
    
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Request deleted successfully.'
    });
    
    this.hideDialog();
    this.getActualRequests();
    this.disabledButton = false;
  }
}