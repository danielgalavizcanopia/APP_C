import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { ReportingPeriods } from 'src/app/interfaces/ReportingPeriods/RP.interface';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ReportingPeriodsService } from 'src/app/services/ReportingPeriods/ReportingP.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';

@Component({
  selector: 'app-reporting-periods-form',
  templateUrl: './reporting-periods-form.component.html',
  styleUrls: ['./reporting-periods-form.component.scss']
})
export class ReportingPeriodsFormComponent {

  verifiers: any[] = [];
  rpnumbers: any[] = [];
  token: any;
  RPForm!: FormGroup;
  proyectoSelected: Projects | null = null;
  idRPSelected: number = 0;
  editEnable: boolean = false;
  RPSelected!: ReportingPeriods;
  disableRPnumber: boolean = false;
  minDate: Date;
  sidebarVisible: boolean = false;
  constructor(private messageService: MessageService, 
    readonly serviceObsProject$: ObservableService,
    public _authGuardService: authGuardService,
    private _fb: FormBuilder,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private reportingPeriodService: ReportingPeriodsService,
    private RPcatalogsService: RPCatalogsService
  ){

    this.token = this._authGuardService.getToken();

    this.getverifier();
    this.getRPnumber();
    this.initFormulario();
    this.observaProjectSelected();
    this.route.params.subscribe(params => {
      this.idRPSelected = params['id'];
      if(this.idRPSelected){
        /** CARGADO DE FORMULARIO */
        this.editEnable = true;
        this.onRPSelected();
      } else {
        this.editEnable = false;

      }
    });

    this.minDate = new Date(2022, 0, 1); // Enero es el mes 0
  }


  initFormulario(){
    this.RPForm = this._fb.group({

      id_reporting_period: [''],
      RP_ID: ['', [Validators.required]],
      Folio_Project: [''],
      idprojects: [''],
      Component_ProjectName: [''],
      RP_Number: [''],
      Project_Aggregated: [''],
      id_StatusReporting: [''],
      id_Programme: [''],
      id_Group: [''],
      Verifier: [''],
      id_Type_Registration_Route: [''],
      Monitoring_Start: [''],
      Monitoring_St_Status: [''],
      Monitoring_End: [''],
      Monitorin_End_Status: [''],
      CMW_Monitoring_Vol: [''],
      Reporting_period_start: ['', [Validators.required]],
      RP_st_status: [''],
      RPEnd: ['', [Validators.required]],
      RP_end_status: [''],
      Calculated_Volume: ['', [Validators.required]],
      Ve_St: [''],
      Verification_Start_Status: [''],
      Verification_End: [''],
      Verification_End_Status: [''],
      VerificationVol: [''],
      Issuance_Start: [''],
      Issuance_Start_Status: [''],
      Issuance_End: [''],
      Issuance_End_tatus: [''],
      Issuance_Vol: [''],
      RP_total: ['']
    });

    this.RPForm.get('id_Type_Registration_Route')?.disable();
  }

  observaProjectSelected(){
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
      } else {

      }
    });
  }

  onRPSelected(){
    this.reportingPeriodService.getReportingPeriodsbyID(this.idRPSelected, this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.RPSelected = await resp.result[0];
        if(this.RPSelected){
          this.onPatchRPForm();
        }
      }
    });
  }

  getverifier(){
    this.RPcatalogsService.getverifier( this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.verifiers = resp.result;
      }
    });
  }

  getRPnumber(){
    this.RPcatalogsService.getRPnumber( this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.rpnumbers = resp.result;
      }
    });
  }

  onPatchRPForm(){
    this.RPForm.patchValue({
      id_reporting_period: this.RPSelected?.idreporting_period,
      RP_ID: this.RPSelected?.idrpnumber,
      Folio_Project: this.RPSelected?.Folio_Project,
      idprojects: this.RPSelected?.idprojects,
      Component_ProjectName: this.RPSelected?.Component_ProjectName,
      // RP_Number: this.RPSelected?.RP_Number,
      Project_Aggregated: this.RPSelected?.Project_Aggregated,
      id_StatusReporting: this.RPSelected?.id_StatusReporting,
      id_Programme: this.RPSelected?.id_Programme,
      id_Group: this.RPSelected?.id_Group,
      Verifier: this.RPSelected?.Idverifier,
      // Verifier: this.verifiers.find(x=>x.Idverifier == this.RPSelected?.Verifier)?.Idverifier,
      id_Type_Registration_Route: this.RPSelected?.id_Type_Registration_Route,
      Monitoring_Start: this.RPSelected?.Monitoring_Start ? new Date(this.RPSelected?.Monitoring_Start) : '',
      Monitoring_St_Status: this.RPSelected?.Monitoring_St_Status,
      Monitoring_End: this.RPSelected?.Monitoring_End ? new Date(this.RPSelected?.Monitoring_End) : '',
      Monitorin_End_Status: this.RPSelected?.Monitorin_End_Status,
      CMW_Monitoring_Vol: this.RPSelected?.CMW_Monitoring_Vol,
      Reporting_period_start: this.RPSelected?.Reporting_period_start ? new Date(this.RPSelected?.Reporting_period_start) : '',
      RP_st_status: this.RPSelected?.RP_st_status,
      RPEnd: this.RPSelected?.Reporting_period_end ? new Date(this.RPSelected?.Reporting_period_end) : '',
      RP_end_status: this.RPSelected?.RP_end_status,
      Calculated_Volume: this.RPSelected?.Calculated_Volume,
      Ve_St: this.RPSelected?.Ve_St ? new Date(this.RPSelected?.Ve_St) : '',
      Verification_Start_Status: this.RPSelected?.Verification_Start_Status,
      Verification_End: this.RPSelected?.Verification_End ? new Date(this.RPSelected?.Verification_End) : '',
      Verification_End_Status: this.RPSelected?.Verification_End_Status,
      VerificationVol: this.RPSelected?.VerificationVol,
      Issuance_Start: this.RPSelected?.Issuance_Start ? new Date(this.RPSelected?.Issuance_Start) : '',
      Issuance_Start_Status: this.RPSelected?.Issuance_Start_Status,
      Issuance_End: this.RPSelected?.Issuance_End ? new Date(this.RPSelected?.Issuance_End) : '',
      Issuance_End_tatus: this.RPSelected?.Issuance_End_tatus,
      Issuance_Vol: this.RPSelected?.Issuance_Vol,
      IDreportingperiodsvolumeyears: this.RPSelected?.IDreportingperiodsvolumeyears ? this.RPSelected?.IDreportingperiodsvolumeyears : 0
    });
    
    this.RPForm.get('RP_ID')?.disable();
    // this.disableRPnumber = true;
  }

  saveRP(){
    if(!this.RPForm.valid){
      return this.messageService.add({ severity: 'error', summary: 'Invalid Activity', detail: "All fields is required"});
    }

    let data = {
      id_reporting_period: this.RPSelected?.idreporting_period ? this.RPSelected?.idreporting_period : 0,
      RP_ID: this.RPSelected?.idrpnumber ? this.RPSelected?.idrpnumber : this.RPForm.value.RP_ID,
      Folio_Project: this.proyectoSelected?.Folio_project,
      idprojects: this.proyectoSelected?.idprojects,
      Component_ProjectName: this.proyectoSelected?.ProjectName,
      RP_Number: this.RPForm.value.RP_ID,
      Project_Aggregated: this.proyectoSelected?.Aggregation,
      id_StatusReporting: 1,
      id_Programme: 1,
      id_Group: 1,
      Verifier: this.RPForm.value.Verifier ? this.RPForm.value.Verifier : null,
      id_Type_Registration_Route: 1,
      Monitoring_Start: this.RPForm.value.Monitoring_Start ? this.RPForm.value.Monitoring_Start : null,
      Monitoring_St_Status: this.RPForm.value.Monitoring_St_Status,
      Monitoring_End: this.RPForm.value.Monitoring_End ? this.RPForm.value.Monitoring_End : null,
      Monitorin_End_Status: this.RPForm.value.Monitorin_End_Status,
      CMW_Monitoring_Vol: this.RPForm.value.CMW_Monitoring_Vol ? this.RPForm.value.CMW_Monitoring_Vol : 0,
      Reporting_period_start: this.RPForm.value.Reporting_period_start,
      RP_st_status: this.RPForm.value.RP_st_status ? this.RPForm.value.RP_st_status : 'Pending',
      RPEnd: this.RPForm.value.RPEnd,
      RP_end_status: this.RPForm.value.RP_end_status ? this.RPForm.value.RP_end_status : 'Pending',
      Calculated_Volume: this.RPForm.value.Calculated_Volume,
      Ve_St: this.RPForm.value.Ve_St ? this.RPForm.value.Ve_St : null,
      Verification_Start_Status: this.RPForm.value.Verification_Start_Status,
      Verification_End: this.RPForm.value.Verification_End ? this.RPForm.value.Verification_End : null,
      Verification_End_Status: this.RPForm.value.Verification_End_Status,
      VerificationVol: this.RPForm.value.VerificationVol ? this.RPForm.value.VerificationVol : 0,
      Issuance_Start: this.RPForm.value.Issuance_Start ? this.RPForm.value.Issuance_Start : null,
      Issuance_Start_Status: this.RPForm.value.Issuance_Start_Status,
      Issuance_End: this.RPForm.value.Issuance_End ? this.RPForm.value.Issuance_End : null,
      Issuance_End_tatus: this.RPForm.value.Issuance_End_tatus,
      Issuance_Vol: this.RPForm.value.Issuance_Vol ? this.RPForm.value.Issuance_Vol : 0,
      IDreportingperiodsvolumeyears: this.RPSelected?.IDreportingperiodsvolumeyears ? this.RPSelected?.IDreportingperiodsvolumeyears : 0
    }

    this.reportingPeriodService.setReportingPeriods(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
        this.router.navigate(['/Reporting-periods'])
      } else {
        this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
      }
    })
  }

}
