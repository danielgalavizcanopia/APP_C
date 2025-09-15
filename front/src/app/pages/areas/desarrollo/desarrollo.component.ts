import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Desarrollo } from 'src/app/interfaces/desarrollo/desarrollo.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { desarrolloService } from 'src/app/services/Desarrollo/desarrollo.service';
import { DesarrolloCtService } from 'src/app/services/Desarrollo/desarrolloCt.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';


@Component({
  selector: 'app-desarrollo',
  templateUrl: './desarrollo.component.html',
  styleUrls: ['./desarrollo.component.scss']
})
export class DesarrolloComponent {

  LicencesPermits: any[] = [];
  LeadDesarrollo: any[] = [];
  DevelopmentStatus: any[] = [];
  Registry: any[] = [];
  Methodology: any[] = [];
  Confidenceoffrontcost: any[] = [];
  CBAcalculatorversion: any[] = [];
  Confidenceofcreditingactivityarea: any[] = [];
  Projectcondition: any[] = [];
  ERScalculatorversion: any[] = [];
  Mercuriaddstatus: any[] = [];
  Estimatepermanence: any[] = [];
  Estimateleakeage: any[] = [];
  Estimatedmrvrequirements: any[] = [];
  Registrationroute: any[] = [];
  proyectoSelected: Projects | null = null;
  desarrolloForm!: FormGroup;
  desarrolloSelected!: Desarrollo;
  token: any;
  permissions: any[] = [];
  enablebutton: boolean = false;
  formValidate!: boolean;

  constructor(private _desarrolloCtService: DesarrolloCtService, private _fb: FormBuilder, public _authGuardService: authGuardService,
    readonly serviceObsProject$: ObservableService, private _desarrolloService: desarrolloService, private messageService: MessageService,){
    this.token = this._authGuardService.getToken();

    this.getLicencesPermits();
    this.getLeadDesarrollo();
    this.getDevelopmentStatus();
    this.getRegistrationroute();
    this.getRegistry();
    this.getMethodology();
    this.getConfidenceoffrontcost();
    this.getCBAcalculatorversion();
    this.getConfidenceofcreditingactivityarea();
    this.getProjectcondition();
    this.getERScalculatorversion();
    this.getMercuriaddstatus();
    this.getEstimatepermanence();
    this.getEstimateleakeage();
    this.getEstimatedmrvrequirements();

    this.initFormulario();
    this.observaProjectSelected();

  }

  initFormulario(){
    this.desarrolloForm = this._fb.group({
      Iddesarrollo: [],
      Idproject: [],
      Description: [,[Validators.required]], 
      UnderlyingActivities: [,[Validators.required]], 
      IdLicensesPermits: [,[Validators.required]], 
      IdleadDesarrollo: [,[Validators.required]], 
      IdDevelopmentStatus: [,[Validators.required]],
      idprogramme: [,[Validators.required]], 
      RegistrationRoute: [,[Validators.required]], 
      Idmethodology: [,[Validators.required]], 
      Credittype: [,[Validators.required]],
      IdConfidenceOfFrontCost: [,[Validators.required]], 
      IdCBACalculatorVersion: [,[Validators.required]],
      CBAFileReference: [,[Validators.required]], 
      ProjectIRR: [,[Validators.required]], 
      ProjectAreaHA: [,[Validators.required]], 
      ActivityAreaHa: [], 
      IdConfidenceofCreditingActivityArea: [,[Validators.required]], 
      IdProjectCondition: [,[Validators.required]], 
      ApprovedByCounterPartProject: ['',[Validators.required]], 
      Expectec2ndCreditInPeriod: ['',[Validators.required]], 
      IdERsCalculatorVersion: [,[Validators.required]], 
      IdMercuriaDDStatus: [,[Validators.required]], 
      DDPack: [,[Validators.required]], 
      DDPacktoMeSubmission: ['',[Validators.required]], 
      IdEstimatePermanence: [,[Validators.required]], 
      IdEstimateLeakeAge: [,[Validators.required]], 
      EstimatedReversalRisk: [,[Validators.required]], 
      IdEstimatedMRVRequirements: [,[Validators.required]], 
      EstimateSampleSize: [,[Validators.required]], 
      TotalCert10YrsTCO2: [,[Validators.required]], 
      DevelopmentTeamNotes: [,[Validators.required]],
      2022: [],
      2023: [],
      2024: [],
      2025: [],
      2026: [],
      2027: [],
      2028: [],
      2029: [],
      2030: [],
      2031: [],
      2032: [],
      2033: [],
      2034: [],
      2035: [],
      2036: [],
      2037: [],
      2038: [],
      2039: [],
      2040: [],
      2041: [],
      2042: [],
      2043: [],
      2044: [],
      2045: [],
      2046: [],
      2047: [],
      2048: [],
      2049: [],
      2050: [],
      2051: [],
      2052: []
    });

    this.validatePermissions();
  }

  validatePermissions(){
    this.permissions = this.token?.permissions;
    if(!this.permissions.find(x=>x.idareas == 1 || x.idareas == 5|| x.idareas == 9)) {
      this.desarrolloForm.disable();
      this.enablebutton = true;
    }
  }

  getLicencesPermits(){
    this._desarrolloCtService.getLicencesPermits(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.LicencesPermits = await resp.result;
      }
    })
  }
  getLeadDesarrollo(){
    this._desarrolloCtService.getLeadDesarrollo(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.LeadDesarrollo = await resp.result;
      }
    })
  }
  getDevelopmentStatus(){
    this._desarrolloCtService.getDevelopmentStatus(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.DevelopmentStatus = await resp.result;
      }
    })
  }
  getRegistry(){
    this._desarrolloCtService.getRegistry(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.Registry = await resp.result;
      }
    })
  }
  getMethodology(){
    this._desarrolloCtService.getMethodology(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.Methodology = await resp.result;
      }
    })
  }
  getConfidenceoffrontcost(){
    this._desarrolloCtService.getConfidenceoffrontcost(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.Confidenceoffrontcost = await resp.result;
      }
    })
  }
  getCBAcalculatorversion(){
    this._desarrolloCtService.getCBAcalculatorversion(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.CBAcalculatorversion = await resp.result;
      }
    })
  }
  getConfidenceofcreditingactivityarea(){
    this._desarrolloCtService.getConfidenceofcreditingactivityarea(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.Confidenceofcreditingactivityarea = await resp.result;
      }
    })
  }
  getProjectcondition(){
    this._desarrolloCtService.getProjectcondition(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.Projectcondition = await resp.result;
      }
    })
  }
  getERScalculatorversion(){
    this._desarrolloCtService.getERScalculatorversion(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.ERScalculatorversion = await resp.result;
      }
    })
  }
  getMercuriaddstatus(){
    this._desarrolloCtService.getMercuriaddstatus(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.Mercuriaddstatus = await resp.result;
      }
    })
  }
  getEstimatepermanence(){
    this._desarrolloCtService.getEstimatepermanence(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.Estimatepermanence = await resp.result;
      }
    })
  }
  getEstimateleakeage(){
    this._desarrolloCtService.getEstimateleakeage(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.Estimateleakeage = await resp.result;
      }
    })
  }
  getEstimatedmrvrequirements(){
    this._desarrolloCtService.getEstimatedmrvrequirements(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.Estimatedmrvrequirements = await resp.result;
      }
    })
  }

  getRegistrationroute(){
    this._desarrolloCtService.getRegistrationroute(this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.Registrationroute = await resp.result;
      }
    })
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe(async (project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        await this.getDesarrolloByProject();
      } else {

      }
    });
  }

  getDesarrolloByProject(){
    this._desarrolloService.getDesarrolloByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.desarrolloSelected = resp.result[0];
        this.onDesarrolloSelected()
      }
    })
  }

  onDesarrolloSelected(){
    this.desarrolloForm.patchValue({
      Description: this.desarrolloSelected?.Description,
      UnderlyingActivities: this.desarrolloSelected?.UnderlyingActivities,
      IdLicensesPermits: this.desarrolloSelected?.IdLicensesPermits,
      IdleadDesarrollo: this.desarrolloSelected?.IdleadDesarrollo,
      IdDevelopmentStatus: this.desarrolloSelected?.IdDevelopmentStatus,
      idprogramme: this.desarrolloSelected?.idprogramme,
      RegistrationRoute: this.Registrationroute.find(x=>x.id_registrationRoute == this.desarrolloSelected?.id_registrationRoute)?.id_registrationRoute,
      Idmethodology: this.desarrolloSelected?.Idmethodology,
      Credittype: this.desarrolloSelected?.Credittype,
      IdConfidenceOfFrontCost: this.desarrolloSelected?.IdConfidenceOfFrontCost,
      IdCBACalculatorVersion: this.desarrolloSelected?.IdCBACalculatorVersion,
      CBAFileReference: this.desarrolloSelected?.CBAFileReference,
      ProjectIRR: this.desarrolloSelected?.ProjectIRR,
      ProjectAreaHA: this.desarrolloSelected?.ProjectAreaHA,
      ActivityAreaHa: this.desarrolloSelected?.ActivityAreaHa,
      IdConfidenceofCreditingActivityArea: this.desarrolloSelected?.IdConfidenceofCreditingActivityArea,
      IdProjectCondition: this.desarrolloSelected?.IdProjectCondition,
      ApprovedByCounterPartProject: this.desarrolloSelected?.ApprovedByCounterPartProject ? new Date(this.desarrolloSelected?.ApprovedByCounterPartProject) : '',
      Expectec2ndCreditInPeriod: this.desarrolloSelected?.Expectec2ndCreditInPeriod ? new Date(this.desarrolloSelected?.Expectec2ndCreditInPeriod) : '',
      IdERsCalculatorVersion: this.desarrolloSelected?.IdERsCalculatorVersion,
      IdMercuriaDDStatus: this.desarrolloSelected?.IdMercuriaDDStatus,
      DDPack: this.desarrolloSelected?.DDPack,
      DDPacktoMeSubmission: this.desarrolloSelected?.DDPacktoMeSubmission ? new Date(this.desarrolloSelected?.DDPacktoMeSubmission) : '',
      IdEstimatePermanence: this.desarrolloSelected?.IdEstimatePermanence,
      IdEstimateLeakeAge: this.desarrolloSelected?.IdEstimateLeakeAge,
      EstimatedReversalRisk: this.desarrolloSelected?.EstimatedReversalRisk,
      IdEstimatedMRVRequirements: this.desarrolloSelected?.IdEstimatedMRVRequirements,
      EstimateSampleSize: this.desarrolloSelected?.EstimateSampleSize,
      TotalCert10YrsTCO2: this.desarrolloSelected?.TotalCert10YrsTCO2,
      DevelopmentTeamNotes: this.desarrolloSelected?.DevelopmentTeamNotes,
      2022: this.desarrolloSelected?.[2022],
      2023: this.desarrolloSelected?.[2023],
      2024: this.desarrolloSelected?.[2024],
      2025: this.desarrolloSelected?.[2025],
      2026: this.desarrolloSelected?.[2026],
      2027: this.desarrolloSelected?.[2027],
      2028: this.desarrolloSelected?.[2028],
      2029: this.desarrolloSelected?.[2029],
      2030: this.desarrolloSelected?.[2030],
      2031: this.desarrolloSelected?.[2031],
      2032: this.desarrolloSelected?.[2032],
      2033: this.desarrolloSelected?.[2033],
      2034: this.desarrolloSelected?.[2034],
      2035: this.desarrolloSelected?.[2035],
      2036: this.desarrolloSelected?.[2036],
      2037: this.desarrolloSelected?.[2037],
      2038: this.desarrolloSelected?.[2038],
      2039: this.desarrolloSelected?.[2039],
      2040: this.desarrolloSelected?.[2040],
      2041: this.desarrolloSelected?.[2041],
      2042: this.desarrolloSelected?.[2042],
      2043: this.desarrolloSelected?.[2043],
      2044: this.desarrolloSelected?.[2044],
      2045: this.desarrolloSelected?.[2045],
      2046: this.desarrolloSelected?.[2046],
      2047: this.desarrolloSelected?.[2047],
      2048: this.desarrolloSelected?.[2048],
      2049: this.desarrolloSelected?.[2049],
      2050: this.desarrolloSelected?.[2050],
      2051: this.desarrolloSelected?.[2051],
      2052: this.desarrolloSelected?.[2052],
    });

  }

  save(){
    if(!this.desarrolloForm.valid){
      this.formValidate = true;
      return this.messageService.add({ severity: 'error', summary: 'Invalid form', detail: "All fields is required"});
    }

    this.desarrolloForm.patchValue({
      Iddesarrollo: this.desarrolloSelected?.Iddesarrollo ? this.desarrolloSelected?.Iddesarrollo : 0,
      Idproject: this.proyectoSelected?.idprojects ? this.proyectoSelected?.idprojects : 0,
    })

    this.formValidate = false;

    this._desarrolloService.setDesarrolloAndCRT(this.desarrolloForm.value, this.token?.access_token).subscribe(async (resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
        await this.getDesarrolloByProject();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
      }
    })


  }
}
