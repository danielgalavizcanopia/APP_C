import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CCInvolvedSelected, EvidencesByIncidence, HistoryIncidenceStatus, Incidences } from 'src/app/interfaces/Incidence/Incidences.interfaces';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { IncidenceCatalogsServices } from 'src/app/services/Incidences/Incidence-catalogs.service';
import { IncidenceService } from 'src/app/services/Incidences/Incidence.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { regex } from 'src/app/util/regex';

@Component({
  selector: 'app-incidences',
  templateUrl: './Incidences.component.html',
  styleUrls: ['./Incidences.component.scss'],
})
export class IncidencesComponent {
  @ViewChild('dt1') dt1!: Table;
  data!: Event;
  
  handleGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dt1.filterGlobal(input.value, 'contains');
  }

  loading: boolean = true;
  loadingStatus: boolean = true;
  loadingEvidence: boolean = true;
  visible: boolean = false;
  visibleMessage: boolean = false;
  options: any;
  token: any;
  proyectoSelected: Projects | null = null;
  
  IncidenceForm!: FormGroup;
  disableButton: boolean = false;
  disableEvidenceButton: boolean = false;
  disableStatusIButton: boolean = false;
  SILsInvolvedDeleted: any[] = [];
  CCInvolvedDeleted: any[] = [];
  CInvolved: CCInvolvedSelected[] = [];
  SILadd: boolean = false;
  usuarioName: string = '';
  hideSIL(){
    this.SILadd = false;
    this.usuarioName = '';
  }
  EvidenceForm!: FormGroup;
  formE: boolean = false;
  formV: boolean = false;
  InvolvedSIL: any[] = [];
  Incidentimpact: any[] = [];
  IncidencesType: any[] = [];
  canopiaUsers: any[] = [];
  statusIndicenceOptions: any[] = [];
  projectManagers: any[] = [];
  logs: any[] = [];
  statusIncidenceSelected: any;
  descriptionIncidence: any;
  Incidences: Incidences[] = [];
  HistoryIncidenceStatus: HistoryIncidenceStatus[] = [];
  EvidencesByIncidence: EvidencesByIncidence[] = []
  IncidenceSelected: Incidences | null = null;
  IncidenceStatus!: any;

  showDialog(){
    this.visible = true;
    this.loadingEvidence = false;
  }
  hideDialog(){
    this.disableButton = false;
    this.disableEvidenceButton = false;
    this.visible = false;
    this.IncidenceForm.reset();
    this.EvidenceForm.reset();
    this.IncidenceForm.enable();
    this.IncidenceSelected = null;
    this.IncidenceStatus = '';
    this.formV = false;
    this.EvidencesByIncidence = [];
  }

  hideDialogMessage(){
    this.disableStatusIButton = false;
    this.visibleMessage = false;
    this.statusIncidenceSelected = '';
    this.descriptionIncidence = '';
    this.formV = false;
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  constructor(
    public _authGuardService: authGuardService,
    readonly serviceObsProject$: ObservableService,
    private datepipe: DatePipe,
    private incidenceCatalogService: IncidenceCatalogsServices,
    private indicenceService: IncidenceService,
    private _fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){
    this.initFormulario();
    this.token = this._authGuardService.getToken();
    this.getInvolvedSIL();
    this.getincidentimpact();
    this.getIncidenceType();
    this.getCanopiaUsers();
    this.getStatusIncidence();
    this.getUserProManager();
    this.observaProjectSelected();
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.getIndicencesByProject();
        this.getLogByIdProject()
      } else {

      }
    });
  }

  openLinkEvidence(url: string) {
    window.open(url , '_blank');
  }

  initFormulario(){
    this.IncidenceForm = this._fb.group({
      IdIncidence: [],
      UserReporting: [,[Validators.required]],
      incidenceType: [,[Validators.required]],
      idprojects: [],
      DateIncidence: [,[Validators.required]] ,
      LocationIncidence: [,[Validators.required]],
      IdIncidentImpact: [,[Validators.required]], 
      ForestryOwner: [,[Validators.required]],
      IdInvolvedSIL: [,[Validators.required]],
      CCinvolved: [,[Validators.required]],
      OthersInvolved: [,[Validators.required]],
      IncidenceCauses: [,[Validators.required, Validators.pattern(regex.textarea)]], 
      IncidenceDescription: [,[Validators.required, Validators.pattern(regex.textarea)]], 
      ImmediateActions: [,[Validators.required, Validators.pattern(regex.textarea)]], 
      Impact: [,[Validators.required, Validators.pattern(regex.textarea)]], 
      ForestryOwnerRequirements: [,[Validators.required, Validators.pattern(regex.textarea)]], 
      SILRequirements: [,[Validators.required, Validators.pattern(regex.textarea)]], 
      DateSuggestedAttention: [,[Validators.required]],
      idbitacora: [,], 
      Idusuariosname: [,[Validators.required]], 
      notifyTo: [,[Validators.required]], 
    });

    this.EvidenceForm = this._fb.group({
        IdIncidence: [],
        EvidenceName: ['',[Validators.required, Validators.pattern(regex.textAndNumbers)]],
        EvidenceLink: ['',[Validators.required, Validators.pattern(regex.link2)]],
        AttachedFiles: [],
    });
  }

  getInvolvedSIL(){
    this.incidenceCatalogService.getInvolvedSIL(this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.InvolvedSIL = response.result;
      } else {
          console.error("No se pudo traer la información de getInvolvedSIL", response.message)
      }
    })
  }

  getincidentimpact(){
    this.incidenceCatalogService.getincidentimpact(this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.Incidentimpact = response.result;
      } else {
          console.error("No se pudo traer la información de getincidentimpact", response.message)
      }
    })
  }

  getIncidenceType(){
    this.incidenceCatalogService.getIncidenceType(this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.IncidencesType = response.result;
      } else {
          console.error("No se pudo traer la información de getincidentimpact", response.message)
      }
    })
  }

  getCanopiaUsers(){
    this.incidenceCatalogService.getCanopiaUsers(this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.canopiaUsers = response.result;
      } else {
          console.error("No se pudo traer la información de getincidentimpact", response.message)
      }
    })
  }

  getStatusIncidence(){
    this.incidenceCatalogService.getStatusIncidence(this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.statusIndicenceOptions = response.result;
      } else {
          console.error("No se pudo traer la información de getincidentimpact", response.message)
      }
    })
  }

  getUserProManager(){
    this.incidenceCatalogService.getUserProManager(this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.projectManagers = response.result;
      } else {
          console.error("No se pudo traer la información de getUserProManager", response.message)
      }
    })
  }

  getLogByIdProject(){
    this.incidenceCatalogService.getLogByIdProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.logs = response.result;
      } else {
          console.error("No se pudo traer la información de getincidentimpact", response.message)
      }
    })
  }

  getIndicencesByProject(){
    this.indicenceService.getIndicencesByProject(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.Incidences = response.result;
          this.loading = false;
      } else {
          console.error("No se pudo traer la información de getIndicencesByProject", response.message)
      }
    })
  }

  getCanopiaInvolvedByIncidence(idIncidence: number = 0){
    this.indicenceService.getCanopiaInvolvedByIncidence(idIncidence, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.CInvolved = response.result;
          let valuesOptions = [];
          for(let i = 0; i < this.CInvolved.length; i++){
            let ods = this.CInvolved[i];

            valuesOptions.push(this.canopiaUsers.find(x => x.Idusuariosname == ods.IdCanopiaInvolved))
          }
          this.IncidenceForm.patchValue({
            CCinvolved: valuesOptions,
          })
      } else {
          console.error("No se pudo traer la información de getCanopiaInvolvedByIncidence", response.message)
      }
    })
  }

  onSelectionCCSChange(event: any) {
    if(this.IncidenceSelected){
      const currentSelection = event.value; // Valores actuales seleccionados
      const removedOptions = this.canopiaUsers.filter(
        value => !currentSelection.some((selected: any) => selected.Idusuariosname === value.Idusuariosname)
      );
  
      this.CCInvolvedDeleted = removedOptions;
      console.log("CANOPIA INVOLVED SELECTED", this.CCInvolvedDeleted);
    }
  }

  onRowSelected(Incidence: Incidences, type: number){
    this.IncidenceSelected = Incidence;

    if(type == 1){
      this.onPatchIncidenceForm();
      this.getEvidencesByIncidence(this.IncidenceSelected.IdIncidence);
      this.visible = true;
    } 
  
    if(type == 2){
      this.getHistoryIncidence(this.IncidenceSelected.IdIncidence);
      this.visibleMessage = true;
    }

    if(type == 3){
      this.onPatchIncidenceForm();
      this.getEvidencesByIncidence(this.IncidenceSelected.IdIncidence);
      this.IncidenceForm.disable();
      this.visible = true;
    }
  }

  onPatchIncidenceForm(){

    this.getCanopiaInvolvedByIncidence(this.IncidenceSelected?.IdIncidence)
    this.IncidenceForm.patchValue({
      UserReporting: this.IncidenceSelected?.UserReporting,
      incidenceType: this.IncidenceSelected?.IdincidenceType,
      idprojects: this.IncidenceSelected?.idprojects,
      DateIncidence: this.datepipe.transform(this.IncidenceSelected?.DateIncidence,'yyyy-MM-dd'),
      LocationIncidence: this.IncidenceSelected?.LocationIncidence,
      IdIncidentImpact: this.IncidenceSelected?.IdIncidentImpact,
      ForestryOwner: this.IncidenceSelected?.ForestryOwner,
      IdInvolvedSIL: this.IncidenceSelected?.IdInvolvedSIL,
      CCinvolved: this.IncidenceSelected?.CCinvolved,
      OthersInvolved: this.IncidenceSelected?.OthersInvolved,
      IncidenceCauses: this.IncidenceSelected?.IncidenceCauses,
      IncidenceDescription: this.IncidenceSelected?.IncidenceDescription,
      ImmediateActions: this.IncidenceSelected?.ImmediateActions,
      Impact: this.IncidenceSelected?.Impact,
      ForestryOwnerRequirements: this.IncidenceSelected?.ForestryOwnerRequirements,
      SILRequirements: this.IncidenceSelected?.SILRequirements,
      DateSuggestedAttention: this.datepipe.transform(this.IncidenceSelected?.DateSuggestedAttention,'yyyy-MM-dd'),
      idbitacora: this.IncidenceSelected?.idbitacora,
      Idusuariosname: this.IncidenceSelected?.Idusuariosname,
      notifyTo: this.IncidenceSelected?.IdUserNotifyTo,
    });

    this.IncidenceStatus = this.IncidenceSelected?.StatusName;
  }

  getHistoryIncidence(idIncidence:number){
    this.loadingStatus = true;
    this.indicenceService.getHistoryStatus(idIncidence, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.HistoryIncidenceStatus = response.result;
          this.loadingStatus = false;
      } else {
          console.error("No se pudo traer la información de getInvolvedSIL", response.message)
      }
    })
  }

  getEvidencesByIncidence(idIncidence:number = 0){
    if(idIncidence == 0 || !idIncidence){
      this.loadingEvidence = false;
      return;
    }
    this.loadingStatus = true;
    this.indicenceService.getEvidencesByIncidence(idIncidence, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.EvidencesByIncidence = response.result;
          this.loadingEvidence = false;
      } else {
          console.error("No se pudo traer la información de getInvolvedSIL", response.message)
      }
    })
  }

  saveIncidence(){
    if(this.disableButton){
      return;
    }
    
    if(!this.IncidenceForm.valid){
      this.formV = true;
      return this.messageService.add({ severity: 'error', summary: 'Incidence Error', detail: 'All fields is required'});
    }

    let CCToSave = this.IncidenceForm.value.CCinvolved;

    let CCFinal = []
    /** LOGICA PARA EL ARMADO DE LOS QUE SERÁN ELIMINADOS */
    if(this.IncidenceSelected){
      if(this.CCInvolvedDeleted.length != 0){
        for(let odsdel of this.CCInvolvedDeleted){ // se modificarán a los parametros nuevos
          CCFinal.push({
            IdincidenceRelCanopiaInvolved: odsdel.IdincidenceRelCanopiaInvolved,
            IdIncidence: this.IncidenceSelected ? this.IncidenceSelected.IdIncidence : 0,
            Idusuariosname: odsdel.Idusuariosname,
            p_Status: 0
          })
        }
      }
    }

    /** LOGICA DE LOS QUE SERÁN AÑADIDOS */
    if(CCToSave && CCToSave.length != 0){
      for(let ccsave of CCToSave){
        let findId = this.canopiaUsers ? this.canopiaUsers.find(x => x.Idusuariosname == ccsave.Idusuariosname)?.Idactividad_rel_odss : null;
        CCFinal.push({
          IdincidenceRelCanopiaInvolved: findId ? findId : 0,
          IdIncidence: this.IncidenceSelected ? this.IncidenceSelected.IdIncidence : 0,
          Idusuariosname: ccsave.Idusuariosname,
          p_Status: 1
        })
        findId = null;
      }
    }

    this.disableButton = true;

    let data = {
      IdIncidence: this.IncidenceSelected ? this.IncidenceSelected.IdIncidence : 0,
      UserReporting: this.IncidenceForm.value.UserReporting,
      incidenceType: this.IncidenceForm.value.incidenceType,
      idprojects: this.proyectoSelected?.idprojects,
      DateIncidence: this.datepipe.transform(this.IncidenceForm.value.DateIncidence,'yyyy-MM-dd'),
      LocationIncidence: this.IncidenceForm.value.LocationIncidence,
      IdIncidentImpact: this.IncidenceForm.value.IdIncidentImpact,
      ForestryOwner: this.IncidenceForm.value.ForestryOwner,
      IdInvolvedSIL: this.IncidenceForm.value.IdInvolvedSIL,
      // CCinvolved: this.IncidenceForm.value.CCinvolved,
      OthersInvolved: this.IncidenceForm.value.OthersInvolved,
      IncidenceCauses: this.IncidenceForm.value.IncidenceCauses,
      IncidenceDescription: this.IncidenceForm.value.IncidenceDescription,
      ImmediateActions: this.IncidenceForm.value.ImmediateActions,
      Impact: this.IncidenceForm.value.Impact,
      ForestryOwnerRequirements: this.IncidenceForm.value.ForestryOwnerRequirements,
      SILRequirements: this.IncidenceForm.value.SILRequirements,
      DateSuggestedAttention: this.datepipe.transform(this.IncidenceForm.value.DateSuggestedAttention, 'yyyy-MM-dd'),
      idbitacora: this.IncidenceForm.value.idbitacora,
      Idusuariosname: this.IncidenceForm.value.Idusuariosname,
      notifyTo: this.IncidenceForm.value.notifyTo,
      CanopiaInvolved: CCFinal,
    }

    this.indicenceService.setIncidences(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        const idIncidenceGenerated = resp.result[0].IdIncidence
        if(!data.IdIncidence){
          this.saveEvidences(1, 0, idIncidenceGenerated)
        }
        this.disableButton = false;
        this.hideDialog();
        this.getIndicencesByProject();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Incidence save successfully!'});
      } else {
        this.disableButton = false;
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  saveSIL(){
    if(!this.usuarioName){
      return this.messageService.add({ severity: 'error', summary: 'Incidence Error', detail: 'All fields is required'});
    }

    let data = {
      IdInvolvedSIL: 0,
      InvolvedName: this.usuarioName,
    }

    this.indicenceService.setInvolvedSIL(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.hideSIL();
        this.getInvolvedSIL();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SIL saved successfully!'});
      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  saveStatus(){
    if(this.disableStatusIButton){
      return;
    }
    if(!this.statusIncidenceSelected || !this.descriptionIncidence){
      this.formV = true;
      return this.messageService.add({ severity: 'error', summary: 'Incidence Error', detail: 'All fields is required'});
    }
  
    this.disableStatusIButton = true;

    let data = {
      IdIncidence: this.IncidenceSelected?.IdIncidence,
      Idstatusreporteoactividades: this.statusIncidenceSelected,
      StatusDescription: this.descriptionIncidence
    }


    this.indicenceService.setIncidenceStatus(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.disableStatusIButton = false;

        this.hideDialogMessage();
        this.getIndicencesByProject();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Incidence save successfully!'});
      } else {
        this.disableStatusIButton = false;

        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  confirm(event: any, idEvidence: number) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.saveEvidences(0, idEvidence)
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
}

  saveEvidences(status: number, idEvidence: number = 0, idIncidence: number = 0){
    if(this.disableEvidenceButton){
      return;
    }

    if(!this.EvidenceForm.valid && status == 1){
      this.formE = true;
      return this.messageService.add({ severity: 'error', summary: 'Incidence Error', detail: 'All fields is required'});
    }

    this.formE = false;

    let data = {
      IdIncidenceEvidence: status == 1 ? 0 : idEvidence,
      IdIncidence: this.IncidenceSelected?.IdIncidence || idIncidence,
      EvidenceLink: this.EvidenceForm.value.EvidenceLink,
      nameevidence: this.EvidenceForm.value.EvidenceName,
      status: status,
    }

    this.disableEvidenceButton = true;

    this.indicenceService.setEvidencesByIncidences(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.EvidenceForm.reset();
        this.disableEvidenceButton = false;
        this.getEvidencesByIncidence(this.IncidenceSelected?.IdIncidence);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Evidences save successfully!'});
      } else {
        this.disableEvidenceButton = false;
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  exportIncidencesXLSX(){
    this.indicenceService.downloadBenefitMonitorExcel(this.proyectoSelected?.idprojects, this.token?.access_token)
  }

  exportGeneralIncidencesXLSX(){
    this.indicenceService.downloadGeneralIncidences(this.token?.access_token)
  }
}