import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { HistoryRequests, HistoryActualRequests, TransactionDetails } from 'src/app/interfaces/Monitor/requests.interface';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-history-actu-exp-un-rev',
  templateUrl: './history-actu-exp-un-rev.component.html',
  styleUrls: ['./history-actu-exp-un-rev.component.scss']
})
export class HistoryActuExpUnRevComponent {
  @ViewChild('dt1') dt1!: Table;
  
  handleGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dt1.filterGlobal(input.value, 'contains');
  }
  token: any;
  historyRequest: HistoryRequests[] = [];
  loading: boolean = true;
  visible: boolean = false;
  historyActualRequests: HistoryActualRequests[] = [];
  selectedRequest: any;
  loadingModalData: boolean = false;
  
  requestInfo: TransactionDetails | null = null;
  transactionDetails: TransactionDetails[] = [];
  loadingTransactions: boolean = false;

  constructor(
    private MonitoringCatalogService: MonCatalogService, 
    private _authGuardService: authGuardService,
  ){
    this.token = this._authGuardService.getToken();
    this.getHistoryRequests();
  }

  getHistoryRequests() {
    this.loading = true;
    this.MonitoringCatalogService.getHistoryRequests(this.token?.access_token)
      .subscribe(
        (response: any) => {
          if (response && response.valido === 1) {
            this.historyRequest = response.result || [];
          } else {
            this.historyRequest = [];
          }
          this.loading = false;
        },
        (error: any) => {
          console.error("Error getting history requests:", error);
          this.historyRequest = [];
          this.loading = false;
        }
      );
  }

  showDialog(request?: any) {
    this.selectedRequest = request;
    this.visible = true;
    this.loadingModalData = true;
    
    if (request && request.Idactualreviewrequest) {
      this.loadTransactionDetails(request.Idactualreviewrequest);
      this.loadgetHistoryActualRequest(request.Idactualreviewrequest);
    } else {
      console.error('Idactualreviewrequest not found');
      this.loadingModalData = false;
    }
  }

  hideDialog() {
    this.visible = false;
    this.selectedRequest = undefined;
    this.transactionDetails = [];
    this.requestInfo = null;
    this.historyActualRequests = [];
    this.loadingModalData = false;
    this.loadingTransactions = false;
  }

  loadTransactionDetails(idActualReviewRequest: number) {
    this.loadingTransactions = true;
    this.MonitoringCatalogService.getTransactionsDetailsByID(
      idActualReviewRequest, 
      this.token?.access_token
    ).subscribe(
      (response: any) => {
        if (response.valido === 1 && response.result.length > 0) {
          this.transactionDetails = response.result;
          this.requestInfo = response.result[0];
        } else {
          this.transactionDetails = [];
          this.requestInfo = null;
        }
        this.loadingTransactions = false;
        this.checkLoadingComplete();
      },
      (error: any) => {
        console.error("Error loading transactions:", error);
        this.transactionDetails = [];
        this.requestInfo = null;
        this.loadingTransactions = false;
        this.checkLoadingComplete();
      }
    );
  }

  loadgetHistoryActualRequest(idActualReviewRequest: number) {
    this.MonitoringCatalogService.getHistoryActualRequest(
      idActualReviewRequest, 
      this.token?.access_token
    ).subscribe(
      (response: any) => {
        if (response.valido === 1) {
          this.historyActualRequests = response.result;
        } else {
          this.historyActualRequests = [];
        }
        this.checkLoadingComplete();
      },
      (error: any) => {
        console.error("Error loading history:", error);
        this.historyActualRequests = [];
        this.checkLoadingComplete();
      }
    );
  }

  checkLoadingComplete() {
    if (!this.loadingTransactions) {
      this.loadingModalData = false;
    }
  }

  getTotalAmount(): number {
    return this.transactionDetails.reduce((sum, t) => sum + (t.Original_Amount_USD || 0), 0);
  }
  
  getTotalTransactions(): number {
    return this.transactionDetails.length > 0 
      ? this.transactionDetails[0].TotalTransacciones 
      : 0;
  }

  getStatusClass(idstatusautho: number): string {
    switch (idstatusautho) {
      case 1:
      case 2:
        return 'status-approved';
      case 3:
        return 'status-negate';
      default:
        return '';
    }
  }
}