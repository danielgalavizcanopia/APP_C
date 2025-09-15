import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-canopia-involved-users',
  templateUrl: './CanopiaInvolvedUsers.component.html',
  styleUrls: ['./CanopiaInvolvedUsers.component.css'],
})
export class CanopiaInvolvedUsersComponent {

  token: any;

  visibleDialog!: boolean;
  showDialog(){
    this.visibleDialog = true;
  }
  
  hideDialog(){
    this.visibleDialog = false;
  }

  constructor(
    public _authGuardService: authGuardService,
    private _fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){
    this.token = this._authGuardService.getToken();
  }
}
