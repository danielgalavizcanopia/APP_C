import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SettlementCatalogsService } from 'src/app/services/settlement/settlement-catalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-adjustment-type',
  templateUrl: './adjustment-type.component.html',
  styleUrls: ['./adjustment-type.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AdjustmentTypeComponent implements OnInit {

  adjustmentTypes: any[] = [];
  visible: boolean = false;
  adjustmentTypeForm!: FormGroup;
  isEditMode: boolean = false;
  currentRecord: any = null;
  token: any;
  
  isLoading: boolean = true;

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
      this.loadAdjustmentTypes();
    } else {
      this.isLoading = false; 
      this.messageService.add({
        severity: 'warn',
        summary: 'Authentication Required',
        detail: 'Please login first to access this feature'
      });
    }
  }

  initForm() {
    this.adjustmentTypeForm = this.fb.group({
      Idtypeadjustment: [null],
      ShortDesc_type_adjustment: ['', [Validators.required, Validators.maxLength(100)]],
      LargeDesc_type_adjustment: ['', [Validators.required, Validators.maxLength(500)]],
      status: [true]
    });
  }

  loadAdjustmentTypes() {
    this.isLoading = true; 
    
    this.settlementCatalogsService.getTypeAdjustments(this.token?.access_token).subscribe({
      next: (resp: any) => {
        this.isLoading = false; 
        
        if (resp.valido === 1) {
          this.adjustmentTypes = resp.result || []; 
        } else {
          this.adjustmentTypes = []; 
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Error loading data' 
          });
        }
      },
      error: (error) => {
        this.isLoading = false; 
        this.adjustmentTypes = []; 
        
        console.error('Error loading adjustment types:', error);
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
    this.adjustmentTypeForm.reset({
      Idtypeadjustment: null,
      ShortDesc_type_adjustment: '',
      LargeDesc_type_adjustment: '',
      status: true
    });
    this.visible = true;
  }

  editRecord(record: any) {
    this.isEditMode = true;
    this.currentRecord = record;
    this.adjustmentTypeForm.patchValue({
      Idtypeadjustment: record.Idtypeadjustment,
      ShortDesc_type_adjustment: record.ShortDesc_type_adjustment,
      LargeDesc_type_adjustment: record.LargeDesc_type_adjustment,
      status: record.status === 1
    });
    this.visible = true;
  }

  saveRecord() {
    if (this.adjustmentTypeForm.valid) {
      const formData = this.adjustmentTypeForm.value;
      
      if (!this.isEditMode) {
        formData.Idtypeadjustment = 0;
      }

      formData.status = formData.status ? 1 : 0;

      this.settlementCatalogsService.setTypeAdjustment(formData, this.token?.access_token).subscribe({
        next: (resp: any) => {
          if (resp.valido === 1) {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: this.isEditMode ? 'Registry updated successfully' : 'Registry created successfully' 
            });
            this.visible = false;
            this.loadAdjustmentTypes(); 
            this.adjustmentTypeForm.reset();
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
        detail: 'Complete all required fields' 
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
      Idtypeadjustment: record.Idtypeadjustment,
      ShortDesc_type_adjustment: record.ShortDesc_type_adjustment,
      LargeDesc_type_adjustment: record.LargeDesc_type_adjustment,
      status: 0
    };

    this.settlementCatalogsService.setTypeAdjustment(deleteData, this.token?.access_token).subscribe({
      next: (resp: any) => {
        if(resp.valido == 1){
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: "Registry deleted successfully"
          });
          this.loadAdjustmentTypes(); 
          this.cancelDialog();
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
    this.adjustmentTypeForm.reset();
    this.currentRecord = null;
    this.isEditMode = false;
  }
}