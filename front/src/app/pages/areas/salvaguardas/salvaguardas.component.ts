import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { Salvaguarda } from 'src/app/interfaces/Salvaguardas/Salvaguarda.interface';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { SalvaguardaCatalogsService } from 'src/app/services/Salvaguardas/salvaguardas.catalogs.service';
import { SalvaguardasService } from 'src/app/services/Salvaguardas/salvaguardas.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { regex } from 'src/app/util/regex';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-salvaguardas',
  templateUrl: './salvaguardas.component.html',
  styleUrls: ['./salvaguardas.component.scss']
})
export class SalvaguardasComponent {

  token: any;
  permissions: any[] = [];
  enablebutton: boolean = false;

  cities: any[] = [
    { name: 'Press', code: 1 },
    { name: 'Negative', code: 0 },

  ];
  selectedCity!: City;
  date!: Date;

  proyectoSelected: Projects | null = null;
  SalvaguardaSelected: Salvaguarda | null = null;
  SalvaguardaForm!: FormGroup;
  biodiversity: any[] = [];
  hs: any[] = [];
  HumanRights: any[] = [];
  IndigenousPeople: any[] = [];
  LeadSafeGuards: any[] = [];
  NegativeHS: any[] = [];
  SafeguardNHapproach: any[] = [];
  ShareHoldersEngagement: any[] = [];
  SocialCommunityNH: any[] = [];
  StatusSafeguard: any[] = [];
  formValidate!: boolean;
  booleanoActivo: boolean = false;
  buttonlabel: string = "Create";

  toggleFormulario() {
    this.booleanoActivo = !this.booleanoActivo;
    if (this.booleanoActivo) {
      this.SalvaguardaForm.disable();
    } else {
      this.SalvaguardaForm.enable();
    }
  }
  constructor(public _authGuardService: authGuardService,
    readonly serviceObsProject$: ObservableService,
    private _fb: FormBuilder,
    private messageService: MessageService,
    private datepipe: DatePipe,
    private salvaguardCatalogService: SalvaguardaCatalogsService,
    private salvaguardasService: SalvaguardasService){
      this.token = this._authGuardService.getToken();

      this.initFormulario();
      this.getbiodiversity();
      this.geths();
      this.getHumanRights();
      this.getIndigenousPeople();
      this.getLeadSafeGuards();
      this.getNegativeHS();
      this.getSafeguardNHapproach();
      this.getShareHoldersEngagement();
      this.getSocialCommunityNH();
      this.getStatusSafeguard();
      this.observaProjectSelected();

  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.getSalvaguardaSelected();
      } else {

      }
    });
  }

  initFormulario(){
    this.SalvaguardaForm = this._fb.group({
      Idsafeguards: ['',[]],
      Idproject: ['',[]],
      Leads: ['',[Validators.required]],
      Statussafeguards: ['',[Validators.required]],
      LastPPTtoProjectCounterPart: ['',[Validators.required, Validators.pattern(regex.link2)]],
      SafeguardsNoHarmApproach: ['',[Validators.required]],
      SocialCommunityNoHarm: ['',[Validators.required]],
      ShareholdersEngagement: ['',[Validators.required]],
      PressNegative: ['',[Validators.required]],
      Biodiversity: ['',[Validators.required]],
      HumanRights: ['',[Validators.required]],
      IndigenousPeople: ['',[Validators.required]],
      HS: ['',[Validators.required]],
      NegativeEHS: ['',[Validators.required]],
      ProjectCoordinator: ['',[Validators.required, Validators.pattern(regex.OnlyText)]],
      ProjectCoordinatorTerm: ['',[Validators.required]],
      NotesSafeguardsTeam: ['',[]],
    });

    this.toggleFormulario();
    this.validatePermissions();
  }

  validatePermissions(){
    this.permissions = this.token?.permissions;
    if(!this.permissions.find(x=>x.idareas == 1 || x.idareas == 8 || x.idareas == 9)) {
      this.SalvaguardaForm.disable();
      this.enablebutton = true;
    }
  }

  getSalvaguardaSelected(){
    this.salvaguardasService.getSalvaguardas(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.SalvaguardaSelected = response.result[0];
          this.SalvaguardaForm.reset()
          this.patchSalvaguardaSelected();
          if(this.SalvaguardaSelected) this.buttonlabel = "Update";
      } else {
          console.error("No se pudo traer la información de getmrvSelected", response.message)
      }
    })
  }

  getbiodiversity(){
    this.salvaguardCatalogService.getbiodiversity(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.biodiversity = response.result;
        } else {
            console.error("No se pudo traer la información de getbiodiversity", response.message)
        }
    })
  }
  geths(){
    this.salvaguardCatalogService.geths(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.hs = response.result;
        } else {
            console.error("No se pudo traer la información de geths", response.message)
        }
    })
  }
  getHumanRights(){
    this.salvaguardCatalogService.getHumanRights(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.HumanRights = response.result;
        } else {
            console.error("No se pudo traer la información de getHumanRights", response.message)
        }
    })
  }
  getIndigenousPeople(){
    this.salvaguardCatalogService.getIndigenousPeople(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.IndigenousPeople = response.result;
        } else {
            console.error("No se pudo traer la información de getIndigenousPeople", response.message)
        }
    })
  }
  getLeadSafeGuards(){
    this.salvaguardCatalogService.getLeadSafeGuards(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.LeadSafeGuards = response.result;
        } else {
            console.error("No se pudo traer la información de getLeadSafeGuards", response.message)
        }
    })
  }
  getNegativeHS(){
    this.salvaguardCatalogService.getNegativeHS(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.NegativeHS = response.result;
        } else {
            console.error("No se pudo traer la información de getNegativeHS", response.message)
        }
    })
  }
  getSafeguardNHapproach(){
    this.salvaguardCatalogService.getSafeguardNHapproach(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.SafeguardNHapproach = response.result;
        } else {
            console.error("No se pudo traer la información de getSafeguardNHapproach", response.message)
        }
    })
  }
  getShareHoldersEngagement(){
    this.salvaguardCatalogService.getShareHoldersEngagement(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.ShareHoldersEngagement = response.result;
        } else {
            console.error("No se pudo traer la información de getShareHoldersEngagement", response.message)
        }
    })
  }
  getSocialCommunityNH(){
    this.salvaguardCatalogService.getSocialCommunityNH(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.SocialCommunityNH = response.result;
        } else {
            console.error("No se pudo traer la información de getSocialCommunityNH", response.message)
        }
    })
  }
  getStatusSafeguard(){
    this.salvaguardCatalogService.getStatusSafeguard(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.StatusSafeguard = response.result;
        } else {
            console.error("No se pudo traer la información de getStatusSafeguard", response.message)
        }
    })
  }


  patchSalvaguardaSelected(){
    this.SalvaguardaForm.patchValue({
      Leads: this.LeadSafeGuards.find(x=>x.leadsafeguards == this.SalvaguardaSelected?.Leads)?.Idleadsafeguards,
      Statussafeguards: this.StatusSafeguard.find(x=>x.Statussafeguards == this.SalvaguardaSelected?.Statussafeguards)?.Idstatussafeguards,
      LastPPTtoProjectCounterPart: this.SalvaguardaSelected?.LastPPTtoProjectCounterPart,
      SafeguardsNoHarmApproach: this.SafeguardNHapproach.find(x=>x.SafeguardsNoHarmApproach == this.SalvaguardaSelected?.SafeguardsNoHarmApproach)?.IdsafeguardsNoHarmApproach,
      SocialCommunityNoHarm: this.SocialCommunityNH.find(x=>x.SocialCommunityNoHarm == this.SalvaguardaSelected?.SocialCommunityNoHarm)?.IdSocialCommunityNoHarm,
      ShareholdersEngagement: this.ShareHoldersEngagement.find(x=>x.ShareholdersEngagement == this.SalvaguardaSelected?.ShareholdersEngagement)?.idShareholdersEngagement,
      PressNegative: this.cities.find(x=>x.code == this.SalvaguardaSelected?.PressNegative)?.code,
      Biodiversity: this.biodiversity.find(x=>x.Biodiversity == this.SalvaguardaSelected?.Biodiversity)?.IdBiodiversity,
      HumanRights: this.HumanRights.find(x=>x.HumanRights == this.SalvaguardaSelected?.HumanRights)?.IdHumanRights,
      IndigenousPeople: this.IndigenousPeople.find(x=>x.IndigenousPeople == this.SalvaguardaSelected?.IndigenousPeople)?.IdIndigenousPeople,
      HS: this.hs.find(x=>x.HS == this.SalvaguardaSelected?.HS)?.IdHS,
      NegativeEHS: this.NegativeHS.find(x=>x.NegativeEHS == this.SalvaguardaSelected?.NegativeEHS)?.IdNegativeEHS,
      ProjectCoordinator: this.SalvaguardaSelected?.ProjectCoordinator,
      ProjectCoordinatorTerm: this.datepipe.transform(this.SalvaguardaSelected?.ProjectCoordinatorTerm,'yyyy-MM-dd'),
      NotesSafeguardsTeam: this.SalvaguardaSelected?.NotesSafeguardsTeam,
    });
  }

  saveSalvaguarda(){
    if(!this.SalvaguardaForm.valid){
      this.formValidate = true;
      return this.messageService.add({ severity: 'error', summary: 'Invalid form', detail: "All fields is required"});
    }

    this.formValidate = false;

    let data = {
      Idsafeguards: this.SalvaguardaSelected?.Idsafeguards ? this.SalvaguardaSelected?.Idsafeguards : 0,
      Idproject: this.proyectoSelected?.idprojects,
      Leads: this.SalvaguardaForm.value.Leads,
      Statussafeguards: this.SalvaguardaForm.value.Statussafeguards,
      LastPPTtoProjectCounterPart: this.SalvaguardaForm.value.LastPPTtoProjectCounterPart,
      SafeguardsNoHarmApproach: this.SalvaguardaForm.value.SafeguardsNoHarmApproach,
      SocialCommunityNoHarm: this.SalvaguardaForm.value.SocialCommunityNoHarm,
      ShareholdersEngagement: this.SalvaguardaForm.value.ShareholdersEngagement,
      PressNegative: this.SalvaguardaForm.value.PressNegative,
      Biodiversity: this.SalvaguardaForm.value.Biodiversity,
      HumanRights: this.SalvaguardaForm.value.HumanRights,
      IndigenousPeople: this.SalvaguardaForm.value.IndigenousPeople,
      HS: this.SalvaguardaForm.value.HS,
      NegativeEHS: this.SalvaguardaForm.value.NegativeEHS,
      ProjectCoordinator: this.SalvaguardaForm.value.ProjectCoordinator,
      ProjectCoordinatorTerm: this.datepipe.transform(this.SalvaguardaForm.value.ProjectCoordinatorTerm,'yyyy-MM-dd'),
      NotesSafeguardsTeam: this.SalvaguardaForm.value.NotesSafeguardsTeam,
    }


    this.salvaguardasService.setSalvaguardas(data, this.token?.access_token).subscribe((response: any) => {
      if(response.result[0]?.Idsafeguards){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
        this.getSalvaguardaSelected();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
      }
    });
  }
  
}
