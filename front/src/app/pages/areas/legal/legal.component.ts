import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Legal } from 'src/app/interfaces/Legal/Legal.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { LegalCatalogsService } from 'src/app/services/Legal/legal-catalogs.service';
import { LegalService } from 'src/app/services/Legal/legal.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { TextareaPatternValidator } from 'src/app/services/validators/validators.service';
import { regex } from 'src/app/util/regex';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent {

  token: any;
  permissions: any[] = [];
  enablebutton: boolean = false;

  cities: any[] = [
    { name: 'Yes', code: 1 },
    { name: 'No', code: 0 },
  ];
  selectedCity!: City;
  date!: Date;

  proyectoSelected: Projects | null = null;
  legalSelected!: Legal
  LeadLegal: any[] = [];
  DDSattus: any[] = [];
  MEKYCStatus: any[] = [];
  ProyectosLegal: any[] = [];
  
  legalForm!: FormGroup;
  formValidate!: boolean;
  booleanoActivo: boolean = false;
  buttonlabel: string = "Create";

  toggleFormulario() {
    this.booleanoActivo = !this.booleanoActivo;
    if (this.booleanoActivo) {
      this.legalForm.disable();
    } else {
      this.legalForm.enable();
    }
  }

  constructor(
    readonly serviceObsProject$: ObservableService,
    private legalServices: LegalService,
    private legalCatServices: LegalCatalogsService,
    private _fb: FormBuilder,
    public _authGuardService: authGuardService,
    private messageService: MessageService,
    private datepipe: DatePipe,
  ){
    this.token = this._authGuardService.getToken();
    this.initFormulario();
    this.observaProjectSelected()
    this.getLeadLegal()
    this.getDDSattus()
    this.getMEKYCStatus()
    // this.getProyectosLegal()
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.legalForm.reset()/** DESPUES SE EJECUTA EL GET QUE LLENA EL FORM */
        this.getlegalSelected(); /** SE EJECUTA PARA TRAER LOS DATOS DEL PROYECTO SELECCIONADO */
      } else {

      }
    });
  }



  initFormulario(){
    this.legalForm = this._fb.group({
      LegaID: [''],
      idproject: [''],
      idleadlegal: ['',[Validators.required]],
      idlegalDDStatus: ['',[Validators.required]],
      LolSignedDate: ['',[Validators.required]],
      KYCCompleted: [''],
      CBRequestedRAN: ['',[Validators.required]],
      CBCompleted: ['',[Validators.required]],
      ERPASignedDate: ['',[Validators.required]],
      Buyer: ['',[Validators.pattern(regex.OnlyText)]],
      ProjectAgregator: ['',[Validators.required]],
      ProjectDevelopment: ['',[Validators.required]],
      ProjectCoordinator: ['',[Validators.pattern(regex.OnlyText)]],
      ProjectCoordinatorTerm: ['',[Validators.required]],
      SpecificConditionsPrescendent: ['',[TextareaPatternValidator]],
      KYCtoMESubmission: ['',[Validators.required]],
      KYC: ['',[Validators.pattern(regex.link2)]],
      IDMeKYCStatus: ['',[Validators.required]],
      NotesLegalTEam: ['',[]],
    });

    this.toggleFormulario();
    this.validatePermissions();
  }

  validatePermissions(){
    this.permissions = this.token?.permissions;
    if(!this.permissions.find(x=>x.idareas == 1 || x.idareas == 2|| x.idareas == 9)) {
      this.legalForm.disable();
      this.enablebutton = true;
    }
  }

  getlegalSelected(){
    this.legalServices.getLegal(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.legalSelected = response.result[0];
          /** se ejecutará dentro el patchvalue */
          this.patchLegalForm();
          if(this.legalServices) {
            this.buttonlabel = "Update";
            this.legalForm.get('LolSignedDate')?.disable();
            this.legalForm.get('CBRequestedRAN')?.disable();
            this.legalForm.get('ERPASignedDate')?.disable();
            this.legalForm.get('ProjectCoordinatorTerm')?.disable();
            this.legalForm.get('KYCtoMESubmission')?.disable();
          }

      } else {
          console.error("No se pudo traer la información de getlegalSelected", response.message)
      }
    })
  }

  ifExistUserModify(){
    if(this.legalSelected.idUserModify){
      this.legalForm.get('LolSignedDate')?.disable();
      this.legalForm.get('CBRequestedRAN')?.disable();
      this.legalForm.get('ERPASignedDate')?.disable();
      this.legalForm.get('ProjectCoordinatorTerm')?.disable();
      this.legalForm.get('KYCtoMESubmission')?.disable();
    } else {
      this.legalForm.get('LolSignedDate')?.enable();
      this.legalForm.get('CBRequestedRAN')?.enable();
      this.legalForm.get('ERPASignedDate')?.enable();
      this.legalForm.get('ProjectCoordinatorTerm')?.enable();
      this.legalForm.get('KYCtoMESubmission')?.enable();
    }
  }

  getLeadLegal(){
    this.legalCatServices.getLeadLegal(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.LeadLegal = response.result;
        } else {
            console.error("No se pudo traer la información de getLeadLegal", response.message)
        }
    })
  }
  getDDSattus(){
    this.legalCatServices.getDDSattus(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.DDSattus = response.result;
        } else {
            console.error("No se pudo traer la información de getDDSattus", response.message)
        }
    })
  }
  getMEKYCStatus(){
    this.legalCatServices.getMEKYCStatus(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.MEKYCStatus = response.result;
        } else {
            console.error("No se pudo traer la información de getMEKYCStatus", response.message)
        }
    })
  }

  patchLegalForm(){
    this.legalForm.patchValue({
      idleadlegal: this.legalSelected.idleadlegal,//this.LeadLegal.find(x=>x.Leadlegal == this.legalSelected.Leads)?.Idleadlegal,
      idlegalDDStatus: this.legalSelected.idlegalDDStatus, //this.DDSattus.find(x=>x.legalDDStatus == this.legalSelected.status)?.IDlegalDDStatus,
      LolSignedDate: this.datepipe.transform(this.legalSelected.LolSignedDate,'yyyy-MM-dd'),
      KYCCompleted: this.legalSelected.KYCCompleted,
      CBRequestedRAN: this.datepipe.transform(this.legalSelected.CBRequestedRAN,'yyyy-MM-dd'),
      CBCompleted: this.cities.find(x => x.code == this.legalSelected.CBCompleted)?.code,
      ERPASignedDate: this.datepipe.transform(this.legalSelected.ERPASignedDate,'yyyy-MM-dd'),
      Buyer: this.legalSelected.Buyer,
      ProjectAgregator: this.proyectoSelected?.Aggregation,
      ProjectDevelopment: this.legalSelected.ProjectDevelopment,
      ProjectCoordinator: this.legalSelected.ProjectCoordinator,
      ProjectCoordinatorTerm: this.datepipe.transform(this.legalSelected.ProjectCoordinatorTerm,'yyyy-MM-dd'),
      SpecificConditionsPrescendent: this.legalSelected.SpecificConditionsPrescendent,
      KYCtoMESubmission: this.datepipe.transform(this.legalSelected.KYCtoMESubmission,'yyyy-MM-dd'),
      KYC: this.legalSelected.KYC,
      IDMeKYCStatus: this.legalSelected.IDMeKYCStatus,//this.MEKYCStatus.find(x=>x.MeKYCStatus == this.legalSelected.MeKYCStatus)?.IDMeKYCStatus,
      NotesLegalTEam: this.legalSelected.NotesLegalTEam,
    });
    this.ifExistUserModify();
  }

  saveLegal(){
    if(!this.legalForm.valid){
      this.formValidate = true;
      return this.messageService.add({ severity: 'error', summary: 'Invalid form', detail: "All fields is required"});
    }
      this.formValidate = false;
    let data = {
      LegaID: this.legalSelected?.LegaID ? this.legalSelected?.LegaID : 0,
      idproject: this.proyectoSelected?.idprojects,
      idleadlegal: this.legalForm.value.idleadlegal,
      idlegalDDStatus: this.legalForm.value.idlegalDDStatus,
      LolSignedDate: this.datepipe.transform(this.legalForm.value.LolSignedDate, 'yyyy-MM-dd'),
      KYCCompleted: this.legalForm.value.KYCCompleted,
      CBRequestedRAN: this.datepipe.transform(this.legalForm.value.CBRequestedRAN, 'yyyy-MM-dd'),
      CBCompleted: this.legalForm.value.CBCompleted,
      ERPASignedDate: this.datepipe.transform(this.legalForm.value.ERPASignedDate, 'yyyy-MM-dd'),
      Buyer: this.legalForm.value.Buyer,
      ProjectAgregator: this.legalForm.value.ProjectAgregator,
      ProjectDevelopment: this.legalForm.value.ProjectDevelopment,
      ProjectCoordinator: this.legalForm.value.ProjectCoordinator,
      ProjectCoordinatorTerm: this.datepipe.transform(this.legalForm.value.ProjectCoordinatorTerm, 'yyyy-MM-dd'),
      SpecificConditionsPrescendent: this.legalForm.value.SpecificConditionsPrescendent,
      KYCtoMESubmission: this.datepipe.transform(this.legalForm.value.KYCtoMESubmission, 'yyyy-MM-dd'),
      KYC: this.legalForm.value.KYC,
      IDMeKYCStatus: this.legalForm.value.IDMeKYCStatus,
      NotesLegalTEam: this.legalForm.value.NotesLegalTEam,
    }

    this.legalServices.setLegal(data, this.token?.access_token).subscribe((response: any) => {
      if(response.result[0]?.LegaID){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
        this.getlegalSelected()
      } else {
        this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
      }
    });
  }

  
}
