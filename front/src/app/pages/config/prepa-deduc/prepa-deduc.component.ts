import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SettlementCatalogsService } from 'src/app/services/settlement/settlement-catalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-prepa-deduc',
  templateUrl: './prepa-deduc.component.html',
  styleUrls: ['./prepa-deduc.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class PrepaDeducComponent implements OnInit {

  prepaymentDeductions: any[] = [];
  visible: boolean = false;
  prepaymentForm!: FormGroup;
  isEditMode: boolean = false;
  currentRecord: any = null;
  token: any;

  constructor(
    private settlementCatalogsService: SettlementCatalogsService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public _authGuardService: authGuardService  
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.token = this._authGuardService.getToken();
    
    if (this.token && this.token.access_token) {
      console.log('Token valid, loading data...');
      this.loadPrePaymentDeductions();
    } else {
      console.log('No valid token found');
      this.messageService.add({
        severity: 'warn',
        summary: 'Authentication Required',
        detail: 'Please login first to access this feature'
      });
    }
  }

  initForm() {
    this.prepaymentForm = this.fb.group({
      Idprepaymentdeduction: [null],
      Descripprepaymentdeduction: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  loadPrePaymentDeductions() {
    this.settlementCatalogsService.getPrePaymentDeductions(this.token?.access_token).subscribe({
      next: (resp: any) => {
        if (resp.valido === 1) {
          this.prepaymentDeductions = resp.result;
        } else {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'error loading' 
          });
        }
      },
      error: (error) => {
        console.error('Error loading prepayment deductions:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error connecting to the server' 
        });
      }
    });
  }

  showDialog() {
    this.isEditMode = false;
    this.currentRecord = null;
    this.prepaymentForm.reset();
    this.visible = true;
  }

  editRecord(record: any) {
    this.isEditMode = true;
    this.currentRecord = record;
    this.prepaymentForm.patchValue({
      Idprepaymentdeduction: record.Idprepaymentdeduction,
      Descripprepaymentdeduction: record.Descripprepaymentdeduction
    });
    this.visible = true;
  }

  saveRecord() {
    if (this.prepaymentForm.valid) {
      const formData = this.prepaymentForm.value;
      
      if (!this.isEditMode) {
        formData.Idprepaymentdeduction = 0;
      }

      this.settlementCatalogsService.setPrePaymentDeductions(formData, this.token?.access_token).subscribe({
        next: (resp: any) => {
          if (resp.valido === 1) {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'success', 
              detail: this.isEditMode ? 'Registry updated successfully' : 'Registry created successfully' 
            });
            this.visible = false;
            this.loadPrePaymentDeductions(); 
            this.prepaymentForm.reset();
          } else {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'The record could not be saved' 
            });
          }
        },
        error: (error) => {
          console.error('Error saving record:', error);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Error saving record' 
          });
        }
      });
    } else {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Required Fields', 
        detail: 'complete all required fields' 
      });
    }
  }

  confirmDelete(event: any, record: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure you want to delete this record?',
      header: 'Confirm deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(record);
      } 
    });
    }
    deleteRecord(record: any) {
        const deleteData = {
            Idprepaymentdeduction: record.Idprepaymentdeduction,
            Descripprepaymentdeduction: "", 
        };

        this.settlementCatalogsService.setPrePaymentDeductions(deleteData, this.token?.access_token).subscribe({
            next: (resp: any) => {
            if(resp.valido == 1){
                this.messageService.add({ 
                severity: 'success', 
                summary: 'success', 
                detail: "Registry deleted successfully"
                });
                this.loadPrePaymentDeductions();
                this.cancelDialog()
            } else {
                this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: "The record could not be deleted"
                });
            }
            },
            error: (error: any) => {
            console.error('Error deleting record:', error);
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error deleting record' 
            });
            }
        });
    }

  cancelDialog() {
    this.visible = false;
    this.prepaymentForm.reset();
    this.currentRecord = null;
    this.isEditMode = false;
  }
}