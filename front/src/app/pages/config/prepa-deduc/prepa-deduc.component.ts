import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SettlementCatalogsService } from 'src/app/services/settlement/settlement-catalogs.service';
import { LocalService } from 'src/app/services/Secret/local.service';

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
    private localService: LocalService
  ) {
    this.initForm();
  }

  ngOnInit() {
    console.log('🔍 ngOnInit started');
    
    // El proyecto usa LocalService que internamente usa sessionStorage
    this.token = this.localService.getJsonValue('token');
    console.log('🔍 Token from LocalService:', this.token);
    
    // Verificaciones adicionales
    const sessionToken = sessionStorage.getItem('token');
    const localToken = localStorage.getItem('token');
    
    console.log('🔍 sessionStorage token:', sessionToken);
    console.log('🔍 localStorage token:', localToken);
    
    // Si no hay token en LocalService, intentar con sessionStorage directamente
    if (!this.token) {
      if (sessionToken) {
        try {
          this.token = JSON.parse(sessionToken);
          console.log('🔍 Using sessionStorage token:', this.token);
        } catch (error) {
          console.error('🔍 Error parsing sessionStorage token:', error);
        }
      }
    }
    
    console.log('🔍 Final token object:', this.token);
    
    // Solo cargar datos si hay token
    if (this.token && this.token.access_token) {
      console.log('🔍 Token valid, loading data...');
      this.loadPrePaymentDeductions();
    } else {
      console.log('🔍 No valid token found');
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
            detail: 'No se pudieron cargar las deducciones de prepago' 
          });
        }
      },
      error: (error) => {
        console.error('Error loading prepayment deductions:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al conectar con el servidor' 
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
              summary: 'Éxito', 
              detail: this.isEditMode ? 'Registro actualizado correctamente' : 'Registro creado correctamente' 
            });
            this.visible = false;
            this.loadPrePaymentDeductions(); 
            this.prepaymentForm.reset();
          } else {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'No se pudo guardar el registro' 
            });
          }
        },
        error: (error) => {
          console.error('Error saving record:', error);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Error al guardar el registro' 
          });
        }
      });
    } else {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Campos Requeridos', 
        detail: 'Por favor complete todos los campos obligatorios' 
      });
    }
  }

  confirmDelete(record: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este registro?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(record);
      }
    });
  }

    deleteRecord(record: any) {
    const deleteData = {
        Idprepaymentdeduction: record.Idprepaymentdeduction,
        Descripprepaymentdeduction: "" 
    };

    this.settlementCatalogsService.setPrePaymentDeductions(deleteData, this.token?.access_token).subscribe({
        next: (resp: any) => {
        if(resp.valido == 1){
            this.messageService.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: "Registro eliminado correctamente"
            });
            this.loadPrePaymentDeductions(); 
        } else {
            this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: "No se pudo eliminar el registro"
            });
        }
        },
        error: (error: any) => {
        console.error('Error deleting record:', error);
        this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Error al eliminar el registro' 
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