import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Catalogleadsig } from 'src/app/interfaces/CatalgosSig/CtProjectArea/CtprojectArea.interface';
import { PedSig } from 'src/app/interfaces/CatalgosSig/PED/PEDSIG.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ActivityAreaService } from 'src/app/services/SIG/ProjectArea/activityarea.service';
import { ctprojectareaService } from 'src/app/services/SIG/ProjectArea/ctprojectarea.service';
import { pedService } from 'src/app/services/SIG/ProjectArea/ped.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { regex } from 'src/app/util/regex';
import { ComponenSigComponent } from '../componen-sig/componen-sig.component';

@Component({
  selector: 'app-componen-ped',
  templateUrl: './componen-ped.component.html',
  styleUrls: ['./componen-ped.component.scss']
})
export class ComponenPedComponent {

  token: any;
  permissions: any[] = [];
  enablebutton: boolean = false;

  PEDInfo!: FormGroup;
  proyectoSelected: Projects | null = null;
  PEDSigSelected!: PedSig;
  /** CATALOG VARIABLES */
  public catalogleadsig !: Catalogleadsig[];

  
  options: any[] = [
    {label: "Si", value: 1},
    {label: "No", value: 0}
  ] 


  ctResultadoPED: any[] = [];
  ctseccionAA: any[] = [];
  poblacionaa: any[] = [];
  ctActivityAG: any[] = [];
  ctEncuestas: any[] = [];
  ctsubSidiosAA: any[] = [];
  ctPendienteAA: any[] = [];
  ctChangeofCoverage: any[] = [];
  ctresultPedAA: any[] = [];
  constructor(
    public _authGuardService: authGuardService,
    private fb: FormBuilder,
    private _ctprojectareaService: ctprojectareaService,
    private activityAreaService: ActivityAreaService,
    readonly serviceObsProject$: ObservableService,
    private _pedService: pedService,
    private messageService: MessageService,
    private _componentSig: ComponenSigComponent
  ){

    this.token = this._authGuardService.getToken();

    this.observaProjectSelected();
    this.validacionProject();
    this.fnCtgleadsig();
    this.getResultadoPED();
    this.getctseccionAA();
    this.getctpoblacionAA();
    this.getctActivityAG();
    this.getctEncuestas();
    this.getctsubSidiosAA();
    this.getctPendienteAA();
    this.getctChangeofCoverage();
    this.getctresultPedAA();


    this.initFormulario();

  }

  initFormulario(){
    this.PEDInfo = this.fb.group({
        idprojects: [this.proyectoSelected?.idprojects],
        IdPED: [0], // este se llena cuando tenga el get
        IdAreaactividad: [1,[]],
        IdResultadoPEDAP: ['',[Validators.required]],
        IncluirANPoADVC: ['',[Validators.required]],
        IncluirPSA: ['',[Validators.required]],
        RequiereQExistaAC: ['',[Validators.required]],
        RequiereSubsidios: ['',[Validators.required]],
        IdSeccionPEDAA: ['',[Validators.required]],
        IdPoblacionAA: ['',[Validators.required]],
        IdActividadAgropecuaria: ['',[Validators.required]],
        IdEncuestas: ['',[Validators.required]],
        IdSubsidiosAA: ['',[Validators.required]],
        IdPendienteAA: ['',[Validators.required]],
        IdCambioCoberturaAA: [0,[Validators.required]],
        IdResultadoPEDAA: ['',[Validators.required]],
        LinkPEDAA: ['',[Validators.required, Validators.pattern(regex.link2)]],
        ObservacionesPEDAA: ['',[Validators.required, Validators.pattern(regex.textarea)]],
        IdLeadSIG: ['']
    });

    this.validatePermissions()
  }

  validatePermissions(){
    this.permissions = this.token?.permissions;
    if(!this.permissions.find(x=>x.idareas == 1 || x.idareas == 7 || x.idareas == 9)) {
      this.PEDInfo.disable();
      this.enablebutton = true;
    }
  }

  fnCtgleadsig(): void {
    this._ctprojectareaService.fngetCatalogleadsig(this.token?.access_token)
      .subscribe(
        (response: any) => {
          // Verifica si la propiedad 'leadsig' existe en la respuesta
          if (response.result && Array.isArray(response.result)) {
            this.catalogleadsig = response.result;
          } else {
            console.error("La propiedad 'leadsig' no está presente en los datos recibidos.");
          }
        },
        error => {
          console.error("Error al obtener leadsig:", error);
        });
  }

    observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.PEDSelected();
      } else {
      }
    });
  }

  validacionProject(){
    this.serviceObsProject$.catchValidation$.subscribe((response: any) => {
      if(response){
      }
    })
  }

  getResultadoPED(){
    this.activityAreaService.getResultAP(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctResultadoPED = response.result;
      } else {
        console.error("La propiedad 'resultpedap' no está presente en los datos recibidos.");
      }
    })
  }

  getctseccionAA(){
    this.activityAreaService.getctseccionAA(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctseccionAA = response.result;
      } else {
        console.error("La propiedad 'seccionaa' no está presente en los datos recibidos.");
      }
    })
  }

  getctpoblacionAA(){
    this.activityAreaService.getctpoblacionAA(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.poblacionaa = response.result;
      } else {
        console.error("La propiedad 'poblacionaa' no está presente en los datos recibidos.");
      }
    })
  }

  getctActivityAG(){
    this.activityAreaService.getctActivityAG(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctActivityAG = response.result;
      } else {
        console.error("La propiedad 'activityAg' no está presente en los datos recibidos.");
      }
    })
  }

  getctEncuestas(){
    this.activityAreaService.getctEncuestas(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctEncuestas = response.result;
      } else {
        console.error("La propiedad 'escuestas' no está presente en los datos recibidos.");
      }
    })
  }

  getctsubSidiosAA(){
    this.activityAreaService.getctsubSidiosAA(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctsubSidiosAA = response.result;
      } else {
        console.error("La propiedad 'subsidioaa' no está presente en los datos recibidos.");
      }
    })
  }

  getctPendienteAA(){
    this.activityAreaService.getctPendienteAA(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctPendienteAA = response.result;
      } else {
        console.error("La propiedad 'pendienteaa' no está presente en los datos recibidos.");
      }
    })
  }

  getctChangeofCoverage(){
    this.activityAreaService.getctChangeofCoverage(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctChangeofCoverage = response.result;
      } else {
        console.error("La propiedad 'cambiocoberturaaa' no está presente en los datos recibidos.");
      }
    })
  }

  getctresultPedAA(){
    this.activityAreaService.getctresultPedAA(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctresultPedAA = response.result;
      } else {
        console.error("La propiedad 'resultadopedaa' no está presente en los datos recibidos.");
      }
    })
  }

  PEDSelected(){
    /** AQUI IRÁ EL GET PENDIENTE PARA TRAER Y RELLENAR EL FORMULARIO */
    this._pedService.getped(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response && response.valido == 1){
        this.PEDSigSelected = response.result[0];
        this.patchPEDSelectedForm();
      }
    })
  }

  patchPEDSelectedForm(){
    this.PEDInfo.patchValue({
      idprojects: this.PEDSigSelected?.IdProjects,
      IdPED: this.PEDSigSelected?.IdPED,
      IdAreaactividad: this.PEDSigSelected?.IdAreaactividad,
      IdResultadoPEDAP: this.ctResultadoPED.find(item => item.IdResultadoPEDAP == this.PEDSigSelected?.IdResultadoPEDAP)?.IdResultadoPEDAP,
      IncluirANPoADVC: this.options.find(item => item.value == this.PEDSigSelected?.IncluirANPoADVC)?.value,
      IncluirPSA: this.options.find(item => item.value == this.PEDSigSelected?.IncluirPSA)?.value,
      RequiereQExistaAC: this.options.find(item => item.value == this.PEDSigSelected?.RequiereQExistaAC)?.value,
      RequiereSubsidios: this.options.find(item => item.value == this.PEDSigSelected?.RequiereSubsidios)?.value,
      IdSeccionPEDAA: this.PEDSigSelected?.IdSeccionPEDAA,
      IdPoblacionAA: this.PEDSigSelected?.IdPoblacionAA,
      IdActividadAgropecuaria: this.PEDSigSelected?.IdActividadAgropecuaria,
      IdEncuestas: this.PEDSigSelected?.IdEncuestas,
      IdSubsidiosAA: this.PEDSigSelected?.IdSubsidiosAA,
      IdPendienteAA: this.PEDSigSelected?.IdPendienteAA,
      IdCambioCoberturaAA: this.PEDSigSelected?.IdCambioCoberturaAA,
      IdResultadoPEDAA: this.PEDSigSelected?.IdResultadoPEDAA,
      LinkPEDAA: this.PEDSigSelected?.LinkPEDAA,
      ObservacionesPEDAA: this.PEDSigSelected?.ObservacionesPEDAA,
      IdLeadSIG: this.PEDSigSelected?.IdLeadSIG,
    })
    this.ruleDropdownFields();
  }
 

 ruleDropdownFields(){
    this.addOrRemoveValidators();

    if(this.PEDInfo.get('IdSeccionPEDAA')?.value == 1){
      this.PEDInfo.get('IdPoblacionAA')?.enable();
      this.PEDInfo.get('IdActividadAgropecuaria')?.enable();
      this.PEDInfo.get('IdEncuestas')?.enable();
      this.PEDInfo.get('IdSubsidiosAA')?.enable();
      this.PEDInfo.get('IdPendienteAA')?.enable();

      this.PEDInfo.get('IdCambioCoberturaAA')?.disable();
    }

    if(this.PEDInfo.get('IdSeccionPEDAA')?.value == 2){
      this.PEDInfo.get('IdPoblacionAA')?.disable();
      this.PEDInfo.get('IdActividadAgropecuaria')?.disable();
      this.PEDInfo.get('IdEncuestas')?.disable();
      this.PEDInfo.get('IdSubsidiosAA')?.disable();
      this.PEDInfo.get('IdPendienteAA')?.disable();
      
      this.PEDInfo.get('IdCambioCoberturaAA')?.enable();

    }

  }

  addOrRemoveValidators(){
    if(this.PEDInfo.get('IdSeccionPEDAA')?.value == 1){
      this.PEDInfo.get('IdPoblacionAA')?.addValidators(Validators.required);
      this.PEDInfo.get('IdActividadAgropecuaria')?.addValidators(Validators.required);
      this.PEDInfo.get('IdEncuestas')?.addValidators(Validators.required);
      this.PEDInfo.get('IdSubsidiosAA')?.addValidators(Validators.required);
      this.PEDInfo.get('IdPendienteAA')?.addValidators(Validators.required);

      this.PEDInfo.get('IdCambioCoberturaAA')?.clearValidators();
    }

    if(this.PEDInfo.get('IdSeccionPEDAA')?.value == 2){
      this.PEDInfo.get('IdPoblacionAA')?.clearValidators();
      this.PEDInfo.get('IdActividadAgropecuaria')?.clearValidators();
      this.PEDInfo.get('IdEncuestas')?.clearValidators();
      this.PEDInfo.get('IdSubsidiosAA')?.clearValidators();
      this.PEDInfo.get('IdPendienteAA')?.clearValidators();

      this.PEDInfo.get('IdCambioCoberturaAA')?.addValidators(Validators.required);

    }
  }

  savePED(){
    if(this.PEDInfo.valid){

      if(!this._componentSig.LeadSelected){
        return this.messageService.add({ severity: 'error', summary: 'SIG error', detail: 'Please. Select a Lead' });
      }
      this.PEDInfo.patchValue({IdLeadSIG: this._componentSig.LeadSelected})

      let dataSend = {
        idprojects: this.proyectoSelected?.idprojects,
        IdPED: this.PEDInfo.value.IdPED ? this.PEDInfo.value.IdPED : 0,
        IdAreaactividad: this.PEDInfo.value.IdAreaactividad ? this.PEDInfo.value.IdAreaactividad : 0,
        IdResultadoPEDAP: this.PEDInfo.value.IdResultadoPEDAP ? this.PEDInfo.value.IdResultadoPEDAP : 0,
        IncluirANPoADVC: this.PEDInfo.value.IncluirANPoADVC ? this.PEDInfo.value.IncluirANPoADVC : 0,
        IncluirPSA: this.PEDInfo.value.IncluirPSA ? this.PEDInfo.value.IncluirPSA : 0,
        RequiereQExistaAC: this.PEDInfo.value.RequiereQExistaAC ? this.PEDInfo.value.RequiereQExistaAC : 0,
        RequiereSubsidios: this.PEDInfo.value.RequiereSubsidios ? this.PEDInfo.value.RequiereSubsidios : 0,
        IdSeccionPEDAA: this.PEDInfo.value.IdSeccionPEDAA ? this.PEDInfo.value.IdSeccionPEDAA : 0,
        IdPoblacionAA: this.PEDInfo.value.IdPoblacionAA ? this.PEDInfo.value.IdPoblacionAA : 3,
        IdActividadAgropecuaria: this.PEDInfo.value.IdActividadAgropecuaria ? this.PEDInfo.value.IdActividadAgropecuaria : 2,
        IdEncuestas: this.PEDInfo.value.IdEncuestas ? this.PEDInfo.value.IdEncuestas : 4,
        IdSubsidiosAA: this.PEDInfo.value.IdSubsidiosAA ? this.PEDInfo.value.IdSubsidiosAA : 4,
        IdPendienteAA: this.PEDInfo.value.IdPendienteAA ? this.PEDInfo.value.IdPendienteAA : 3,
        IdCambioCoberturaAA: this.PEDInfo.value.IdCambioCoberturaAA ? this.PEDInfo.value.IdCambioCoberturaAA : 3,
        IdResultadoPEDAA: this.PEDInfo.value.IdResultadoPEDAA ? this.PEDInfo.value.IdResultadoPEDAA : 0,
        LinkPEDAA: this.PEDInfo.value.LinkPEDAA ? this.PEDInfo.value.LinkPEDAA : 0,
        ObservacionesPEDAA: this.PEDInfo.value.ObservacionesPEDAA ? this.PEDInfo.value.ObservacionesPEDAA : 0,
        IdLeadSIG: this._componentSig.LeadSelected,
      }
      this._pedService.setPED(dataSend, this.token?.access_token).subscribe((response: any ) => {
        if(response.message === "Se guardó correctamente"){
          this.messageService.add({ severity: 'success', summary: 'Save succesfully!', detail: response.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      })
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "All fields is required" });
    }
  }



}
