import { Component } from '@angular/core';

@Component({
  selector: 'app-history-actu-exp-un-rev',
  templateUrl: './history-actu-exp-un-rev.component.html',
  styleUrls: ['./history-actu-exp-un-rev.component.scss']
})
export class HistoryActuExpUnRevComponent {
  actualRequests: any;
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

  getTotalTransactions(){
    return 0;
  }
}
