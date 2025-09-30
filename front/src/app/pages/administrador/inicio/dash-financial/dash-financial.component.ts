import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { HistoryActualRequests, TransactionDetails } from 'src/app/interfaces/Monitor/requests.interface';

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
  selectedRequest: any = null;
  token: any;
  transactionDetails: TransactionDetails[] = [];
  loadingTransactions: boolean = false;
  requestInfo!: TransactionDetails | null;
  historyActualRequests: HistoryActualRequests[] = [];

  constructor(
    private productService: ProductService,
    private MonitoringCatalogService: MonCatalogService, 
    private _authGuardService: authGuardService 
  ) { 
    this.token = this._authGuardService.getToken(); 
  }

  ngOnInit() {
    this.getActualRequests();
    this.productService.getProductsSmall().then((data) => {
      this.products = data;
    });

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
    this.selectedRequest = null;
    this.transactionDetails = [];
    this.requestInfo = null;
    this.historyActualRequests = [];
  }

  loadgetHistoryActualRequest(idActualReviewRequest: number) {
    this.MonitoringCatalogService.getHistoryActualRequest(
      idActualReviewRequest, 
      this.token?.access_token
    ).subscribe((response: any) => {
      if (response.valido === 1 && response.result.length > 0) {
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
}