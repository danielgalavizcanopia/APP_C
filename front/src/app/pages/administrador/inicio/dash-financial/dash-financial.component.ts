import { Component, ViewChild } from '@angular/core';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ActualRequest, HistoryActualRequests, TransactionDetails } from 'src/app/interfaces/Monitor/requests.interface';
import { Table } from 'primeng/table';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

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
  loadingModalData: boolean = false;
  allVotesRejected: boolean = false;

  private readonly VOTING_ORDER: { [key: string]: number } = {
    'Manager': 1,
    'TechnicalDirector': 2,
    'FinancialEvaluator': 3
  };

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
        console.log('Actual requests response:', response);
        if (response.valido === 1) {
          this.actualRequests = this.filterRequestsByUserRole(response.result);
          this.sortRequestsByEditability();
          this.loading = false;
        } else {
          console.error("Error getting requests:", response.message);
          this.loading = false;
        }
      });
  }

filterRequestsByUserRole(requests: any[]): any[] {
  const currentUserId = this.token?.userId;
  
  if (!currentUserId) {
    console.log('No user ID found, showing no requests');
    return [];
  }

  const filteredRequests = requests.filter(request => {
    if (request.iduserrequest === currentUserId) {
      return true;
    }

    const config = this.relUsersAndAccounts.find(ua => 
      (request.LedgerType === 'Capex' && ua.idcapexsubaccount === request.idsubaccount) ||
      (request.LedgerType === 'Opex' && ua.idopexsubaccount === request.idsubaccount)
    );

    if (!config) {
      return false; 
    }

    const isManager = config.IDUser === currentUserId;
    const isTechnicalDirector = config.IdUsertechnicaldirector === currentUserId;
    const isFinancialEvaluator = config.IdUserFinancialEvaluator === currentUserId;

    return isManager || isTechnicalDirector || isFinancialEvaluator;
  });

  return filteredRequests;
}

  getStatusAuthorizations() {
    this.MonitoringCatalogService.getStatusAuthorizations(this.token?.access_token)
      .subscribe((response: any) => {
        console.log('Status authorizations response:', response);
        if (response.valido === 1) {
          this.StatusAuthorizations = response.result;
        } else {
          console.error("Error getting status authorizations:", response.message);
        }
      });
  }

  get filteredStatusAuthorizations() {
    return this.StatusAuthorizations.filter(status => {
      const statusName = status.StatusName?.toLowerCase();
      return statusName !== 'pending';
    });
  }

  getConfigUsersAndAccounts() {
    this.MonitoringCatalogService.getConfigUsersAndAccounts(this.token?.access_token)
      .subscribe((response: any) => {
        console.log('Config users and accounts response:', response);
        if (response.valido === 1) {
          this.relUsersAndAccounts = response.result;
          this.getActualRequests();
        } else {
          console.error("Error getting config:", response.message);
          this.loading = false;
        }
      });
  }

  sortRequestsByEditability() {
    if (this.actualRequests.length > 0 && this.relUsersAndAccounts.length > 0) {
      this.actualRequests = this.actualRequests.sort((a: any, b: any) => {
        const canEditA = this.isUserAuthorizedToEvaluate(a);
        const canEditB = this.isUserAuthorizedToEvaluate(b);
        
        if (canEditA && !canEditB) return -1;
        if (!canEditA && canEditB) return 1;
        return 0;
      });
    }
  }

  getAllRolesForSubAccount(request: any): string[] {
    if (request.Idruleset === 1) {
      return ['Manager', 'FinancialEvaluator'];
    } else if (request.Idruleset === 2) {
      return ['Manager', 'TechnicalDirector', 'FinancialEvaluator'];
    }
    
    const config = this.relUsersAndAccounts.find(ua => {
      const matchCapex = request.LedgerType === 'Capex' && ua.idcapexsubaccount === request.idsubaccount;
      const matchOpex = request.LedgerType === 'Opex' && ua.idopexsubaccount === request.idsubaccount;
      return matchCapex || matchOpex;
    });
    
    if (!config) {
      return ['Manager', 'TechnicalDirector', 'FinancialEvaluator'];
    }
    
    const roles: string[] = [];
    
    if (config.IDUser && config.IDUser > 0) {
      roles.push('Manager');
    }
    
    if (config.IdUsertechnicaldirector && config.IdUsertechnicaldirector > 0) {
      roles.push('TechnicalDirector');
    }
    
    if (config.IdUserFinancialEvaluator && config.IdUserFinancialEvaluator > 0) {
      roles.push('FinancialEvaluator');
    }
    
    return roles.length > 0 ? roles : ['Manager', 'FinancialEvaluator'];
  }

  getCurrentUserRole(request: any): string | null {
    const currentUserId = this.token?.userId;
    if (!currentUserId) return null;
    
    const config = this.relUsersAndAccounts.find(ua => 
      (request.LedgerType === 'Capex' && ua.idcapexsubaccount === request.idsubaccount) ||
      (request.LedgerType === 'Opex' && ua.idopexsubaccount === request.idsubaccount)
    );
    
    if (!config) return null;
    
    if (config.IDUser === currentUserId) return 'Manager';
    if (config.IdUsertechnicaldirector === currentUserId) return 'TechnicalDirector';
    if (config.IdUserFinancialEvaluator === currentUserId) return 'FinancialEvaluator';
    
    return null;
  }

  havePreviousRolesVoted(request: any, currentRole: string): boolean {
    const allRequiredRoles = this.getAllRolesForSubAccount(request);
    const currentRoleOrder = this.VOTING_ORDER[currentRole];
    
    if (currentRoleOrder === 1) {
      return true;
    }
    
    for (const role of allRequiredRoles) {
      const roleOrder = this.VOTING_ORDER[role];
      
      if (roleOrder < currentRoleOrder) {
        const roleVote = request[role];
        if (!roleVote || roleVote === null) {
          return false;
        }
      }
    }
    
    return true;
  }

  getNextRoleToVote(request: any): string | null {
    const allRequiredRoles = this.getAllRolesForSubAccount(request);
    
    const sortedRoles = allRequiredRoles.sort((a, b) => {
      const orderA = this.VOTING_ORDER[a] || 999;
      const orderB = this.VOTING_ORDER[b] || 999;
      return orderA - orderB;
    });
    
    for (const role of sortedRoles) {
      const roleVote = request[role];
      if (!roleVote || roleVote === null) {
        return role;
      }
    }
    
    return null;
  }

  getStatusCircles(request: any): any[] {
    const circles: any[] = [];
    
    const allRequiredRoles = this.getAllRolesForSubAccount(request);
    const currentRound = request.current_round || 1;
    
    const allVotedRejected = request.CurrentStatusDescription === 'Pending' && 
      allRequiredRoles.every(role => request[role] === 'Rejected');
    
    if (request.CurrentStatusDescription === 'Approved') {
      allRequiredRoles.forEach((role: string) => {
        circles.push({
          tooltip: `${role} - Approved`,
          statusClass: 'status-approved',
          order: this.VOTING_ORDER[role] || 999
        });
      });
    } 
    else if (request.CurrentStatusDescription === 'Rechazed' || allVotedRejected) {
      allRequiredRoles.forEach((role: string) => {
        const roleVote = request[role];
        
        if (roleVote === 'Approved') {
          circles.push({
            tooltip: `${role} - Approved`,
            statusClass: 'status-approved',
            order: this.VOTING_ORDER[role] || 999
          });
        } else if (roleVote === 'Rejected') {
          circles.push({
            tooltip: `${role} - Rejected`,
            statusClass: 'status-negate',
            order: this.VOTING_ORDER[role] || 999
          });
        } else {
          circles.push({
            tooltip: `${role} - Pending`,
            statusClass: 'status-pending',
            order: this.VOTING_ORDER[role] || 999
          });
        }
      });
    } 
    else {
      const nextRole = this.getNextRoleToVote(request);
      
      allRequiredRoles.forEach((role: string) => {
        const roleVote = request[role];
        
        if (roleVote === 'Approved') {
          circles.push({
            tooltip: `${role} - Approved`,
            statusClass: 'status-approved',
            order: this.VOTING_ORDER[role] || 999
          });
        } else if (roleVote === 'Rejected') {
          circles.push({
            tooltip: `${role} - Rejected`,
            statusClass: 'status-negate',
            order: this.VOTING_ORDER[role] || 999
          });
        } else if (role === nextRole && currentRound === 1) {
          circles.push({
            tooltip: `${role} - Next to Vote`,
            statusClass: 'status-pending',
            order: this.VOTING_ORDER[role] || 999
          });
        } else {
          const pendingLabel = currentRound > 1 ? 'Can Vote' : 'Pending';
          circles.push({
            tooltip: `${role} - ${pendingLabel}`,
            statusClass: 'status-pending',
            order: this.VOTING_ORDER[role] || 999
          });
        }
      });
    }
    
    circles.sort((a, b) => a.order - b.order);
    return circles;
  }

  isUserAuthorizedToEvaluate(request: any): boolean {
    if (request.CurrentStatusDescription === 'Approved' || 
        request.CurrentStatusDescription === 'Rechazed') {
      return false;
    }
    
    const currentUserId = this.token?.userId;
    if (!currentUserId) {
      return false;
    }
    
    const config = this.relUsersAndAccounts.find(ua => 
      (request.LedgerType === 'Capex' && ua.idcapexsubaccount === request.idsubaccount) ||
      (request.LedgerType === 'Opex' && ua.idopexsubaccount === request.idsubaccount)
    );
    
    if (!config) {
      return false;
    }
    
    const userRole = this.getCurrentUserRole(request);
    if (!userRole) {
      return false;
    }

    if (request.CurrentStatusDescription === 'Pending') {
      const allRequiredRoles = this.getAllRolesForSubAccount(request);
      const allVotedRejected = allRequiredRoles.every(role => {
        const roleVote = request[role];
        return roleVote === 'Rejected';
      });
      
      if (allVotedRejected) {
        return false;
      }
    }

    const currentRound = (request as any).current_round || 1;
    
    if (currentRound === 1) {
      const nextRole = this.getNextRoleToVote(request);
      
      if (nextRole !== userRole) {
        return false;
      }
      
      const previousVoted = this.havePreviousRolesVoted(request, userRole);
      return previousVoted && request.CurrentStatusDescription === 'Pending';
    }
    
    return request.CurrentStatusDescription === 'Pending';
  }



  showDialog(request?: any) {
    this.selectedRequest = request;
    this.canUserEdit = this.isUserAuthorizedToEvaluate(request);
    
    if (request && request.CurrentStatusDescription === 'Pending') {
      const allRequiredRoles = this.getAllRolesForSubAccount(request);
      this.allVotesRejected = allRequiredRoles.every(role => request[role] === 'Rejected');
    } else {
      this.allVotesRejected = false;
    }
    
    this.visible = true;
    this.loadingModalData = true;
    
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
    this.loadingModalData = false;
    this.allVotesRejected = false; 
  }

  enableResendRequest() {
    const userRole = this.getCurrentUserRole(this.selectedRequest);
    
    if (!userRole) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'You are not authorized to resend this request.'
      });
      return;
    }
    
    this.canUserEdit = true;
    this.allVotesRejected = false; 
    
    this.messageService.add({ 
      severity: 'info', 
      summary: 'Resend Mode', 
      detail: 'You can now submit a new vote for this request.'
    });
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
      this.checkLoadingComplete();
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
      this.checkLoadingComplete();
    });
  }

  checkLoadingComplete() {
    if (!this.loadingTransactions && this.historyActualRequests.length >= 0) {
      this.loadingModalData = false;
    }
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

    const userRole = this.getCurrentUserRole(this.selectedRequest);
    if (!userRole) {
      return this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'You are not authorized to evaluate this request.'
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

    const selectedRequestAny = this.selectedRequest as any;
    let typeOfAutho = selectedRequestAny.Idruleset || 
                      (catchUsersValidateByAccount.IdUsertechnicaldirector > 0 ? 2 : 1);

    let data = {
      Idactualreviewrequest: this.selectedRequest?.Idactualreviewrequest,
      iduserautho: this.token?.userId,
      idstatusautho: this.optionStatusSelected,
      AuthorizationComment: this.justification,
      typeOfAutho: typeOfAutho,
    };
    

    
    this.MonitoringCatalogService.setAuthotizationRequest(data, this.token?.access_token)
      .subscribe(
        (response: any) => {
          
          if (response.valido === 1) {
            const resultMessage = response.result?.[0]?.result;
            
            if (resultMessage && resultMessage.includes("Error")) {
              this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: resultMessage
              });
              this.disabledButton = false;
            } else {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Success', 
                detail: 'Changes saved successfully.'
              });
              this.hideDialog();
              
              setTimeout(() => {
                this.getActualRequests();
                this.disabledButton = false;
              }, 500);
            }
          } else {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: response.message || 'An error occurred while saving changes.'
            });
            this.disabledButton = false;
          }
        },
        (error: any) => {
          
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: error.error?.message || 'An error occurred while saving changes.'
          });
          this.disabledButton = false;
        }
      );
  }

  isValidStatus(status: number): string {
    switch (status) {
      case 1:
      case 2:
        return 'status-approved';
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

    this.MonitoringCatalogService.setDeletePendingRequests(data, this.token?.access_token)
      .subscribe(
        (response: any) => {
          if (response.valido === 1) {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Request deleted successfully.'
            });
            this.hideDialog();
            this.getActualRequests();
          } else {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: response.message || 'An error occurred while deleting the request.'
            });
          }
          this.disabledButton = false;
        },
        (error: any) => {
          console.error('Error deleting request:', error);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Was an error, please, try again'
          });
          this.disabledButton = false;
        }
      );
  }
}