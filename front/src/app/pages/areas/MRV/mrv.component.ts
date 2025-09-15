import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Mrv } from 'src/app/interfaces/MRV/mrv.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { MRVCatalogsService } from 'src/app/services/MRV/mrv-catalogs.service';
import { MRVService } from 'src/app/services/MRV/mrv.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { regex } from 'src/app/util/regex';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-views-monitor',
  templateUrl: './mrv.component.html',
  styleUrls: ['./mrv.component.scss']
})
export class MRVComponent {
  token: any;
  permissions: any[] = [];
  enablebutton: boolean = false;

  cities: any[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];
  selectedCity!: City;
  date!: Date;

  proyectoSelected: Projects | null = null;
  mrvSelected!: Mrv;
  MrvLead: any[] = [];
  leakeage: any[] = [];
  mrvrequirements: any[] = [];
  permanence: any[] = [];
  statusmrv: any[] = [];

  mrvForm!: FormGroup;

  formValidate!: boolean;
  booleanoActivo: boolean = false;
  buttonlabel: string = "Create";

  toggleFormulario() {
    this.booleanoActivo = !this.booleanoActivo;
    if (this.booleanoActivo) {
      this.mrvForm.disable();
    } else {
      this.mrvForm.enable();
    }
  }

  constructor(
    readonly serviceObsProject$: ObservableService,
    private _fb: FormBuilder,
    private messageService: MessageService,
    private datepipe: DatePipe,
    public _authGuardService: authGuardService,
    private mrvCatalogsService: MRVCatalogsService,
    private mrvService: MRVService
  ){
    this.token = this._authGuardService.getToken();
    this.initFormulario();

    this.getMrvLead()
    this.getleakeage()
    this.getmrvrequirements()
    this.getpermanence()
    this.getstatusmrv()
    this.observaProjectSelected();


  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.getmrvSelected();
      } else {

      }
    });
  }

  getmrvSelected(){
    this.mrvService.getMRV(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.mrvSelected = response.result[0];
          this.onMRVPatchSelected();
          if(this.mrvSelected) this.buttonlabel = "Update";
      } else {
          console.error("No se pudo traer la información de getmrvSelected", response.message)
      }
    })
  }

  initFormulario(){
    this.mrvForm =  this._fb.group({
      Idmrv: [''],
      Idproject: [''],
      IdleadMRV: ['', [Validators.required]],
      IdPermanence: ['', [Validators.required]],
      Idleakeage: ['', [Validators.required]],
      RevesalRisk: ['', [Validators.required]],
      SampleSize: ['', [Validators.required]],
      IdMRVRequirements: ['', [Validators.required]],
      BLInventoryStartDate: ['', [Validators.required]],
      BLInventoryEndDate: ['', [Validators.required]],
      IdMRVStatus: ['', [Validators.required]],
      CommentsofMRV: ['', [Validators.required]],
    });

    this.toggleFormulario()
    this.validatePermissions()
  }

  validatePermissions(){
    this.permissions = this.token?.permissions;
    if(!this.permissions.find(x=>x.idareas == 1 || x.idareas == 6|| x.idareas == 9)) {
      this.mrvForm.disable();
      this.enablebutton = true;
    }
  }

  getMrvLead(){
    this.mrvCatalogsService.getMrvLead(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.MrvLead = response.result;
        } else {
            console.error("No se pudo traer la información de getMrvLead", response.message)
        }
    })
  }

  getleakeage(){
    this.mrvCatalogsService.getleakeage(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.leakeage = response.result;
        } else {
            console.error("No se pudo traer la información de getleakeage", response.message)
        }
    })
  }

  getmrvrequirements(){
    this.mrvCatalogsService.getmrvrequirements(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.mrvrequirements = response.result;
        } else {
            console.error("No se pudo traer la información de getmrvrequirements", response.message)
        }
    })
  }

  getpermanence(){
    this.mrvCatalogsService.getpermanence(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.permanence = response.result;
        } else {
            console.error("No se pudo traer la información de getpermanence", response.message)
        }
    })
  }

  getstatusmrv(){
    this.mrvCatalogsService.getstatusmrv(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.statusmrv = response.result;
        } else {
            console.error("No se pudo traer la información de getstatusmrv", response.message)
        }
    })
  }

  onMRVPatchSelected(){
    this.mrvForm.patchValue({
      Idmrv: this.mrvSelected?.Idmrv,
      Idproject: this.proyectoSelected?.idprojects,
      IdleadMRV: this.MrvLead.find(x=>x.leadMRV == this.mrvSelected?.Leads)?.IdleadMRV,
      IdPermanence: this.permanence.find(x=>x.Permancence == this.mrvSelected?.Permancence)?.IdPermanence,
      Idleakeage: this.leakeage.find(x=>x.Leakeage == this.mrvSelected?.Leakeage)?.Idleakeage,
      RevesalRisk: this.mrvSelected?.RevesalRisk,
      SampleSize: this.mrvSelected?.SampleSize,
      IdMRVRequirements: this.mrvrequirements.find(x=>x.MRVRequirements == this.mrvSelected?.Requirements)?.IdMRVRequirements,
      BLInventoryStartDate: this.datepipe.transform(new Date(this.mrvSelected?.BLInventoryStartDate), 'yyyy-MM-dd'),
      BLInventoryEndDate: this.datepipe.transform(new Date(this.mrvSelected?.BLInventoryEndDate), 'yyyy-MM-dd'),
      IdMRVStatus: this.statusmrv.find(x=>x.StatusMRV == this.mrvSelected?.Status)?.IdStatusMRV,
      CommentsofMRV: this.mrvSelected?.Comments,
    });
  }

  saveMRV(){
    if(!this.mrvForm.valid){
      this.formValidate = true;
      return this.messageService.add({ severity: 'error', summary: 'Invalid form', detail: "All fields is required"});
    }
    this.formValidate = false;

    /** SERVICE INSERT UPDATE */
    let data = {
      Idmrv: this.mrvSelected?.Idmrv ? this.mrvSelected?.Idmrv : 0,
      Idproject: this.proyectoSelected?.idprojects,
      IdleadMRV: this.mrvForm.value.IdleadMRV,
      IdPermanence: this.mrvForm.value.IdPermanence,
      Idleakeage: this.mrvForm.value.Idleakeage,
      RevesalRisk: this.mrvForm.value.RevesalRisk,
      SampleSize: this.mrvForm.value.SampleSize,
      IdMRVRequirements: this.mrvForm.value.IdMRVRequirements,
      BLInventoryStartDate: this.datepipe.transform(this.mrvForm.value.BLInventoryStartDate, 'yyyy-MM-dd'),
      BLInventoryEndDate: this.datepipe.transform(this.mrvForm.value.BLInventoryEndDate, 'yyyy-MM-dd'),
      IdMRVStatus: this.mrvForm.value.IdMRVStatus,
      CommentsofMRV: this.mrvForm.value.CommentsofMRV,
    }

    this.mrvService.setMRV(data, this.token?.access_token).subscribe((response: any) => {
      if(response.result[0]?.Idmrv){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
        this.getmrvSelected();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
      }
    });

  }

}
