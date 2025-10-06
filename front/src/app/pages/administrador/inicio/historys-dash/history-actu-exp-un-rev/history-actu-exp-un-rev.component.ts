import { Component } from '@angular/core';
import { HistoryRequests } from 'src/app/interfaces/Monitor/requests.interface';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-history-actu-exp-un-rev',
  templateUrl: './history-actu-exp-un-rev.component.html',
  styleUrls: ['./history-actu-exp-un-rev.component.scss']
})
export class HistoryActuExpUnRevComponent {

  token: any;
  historyRequest: HistoryRequests[] = [];
  loading: boolean = true;
  visible: boolean = false;
  showDialog(product: any){
    this.visible = true;
  }

  hideDialog(){
    this.visible = false;
  }

  historyMessages: any;
  requestInfo: any;
  transactionDetails: any;
  loadingTransactions: boolean = true;

  constructor(
    private MonitoringCatalogService: MonCatalogService, 
    private _authGuardService: authGuardService,
  ){
    this.token = this._authGuardService.getToken();

    this.getHistoryRequests();
  }

  getTotalTransactions(){
    return 0;
  }

  
  getHistoryRequests() {
    this.MonitoringCatalogService.getHistoryRequests(this.token?.access_token)
      .subscribe((response: any) => {
        if (response.valido === 1) {
          this.historyRequest = response.result;
          this.loading = false;
        } else {
          console.error("Error getting requests:", response.message);
          this.loading = false;
        }
      });
  }
}
