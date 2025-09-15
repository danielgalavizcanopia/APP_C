  import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Bitacora } from 'src/app/interfaces/Bitacora/Bitacora.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { BitacoraService } from 'src/app/services/Bitacora/Bitacora.service';
import { BitacoraCatalogsService } from 'src/app/services/Bitacora/bitacora-catalogs.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ProductService } from 'src/app/services/product.service';
import { TextareaPatternValidator } from 'src/app/services/validators/validators.service';
import { regex } from 'src/app/util/regex';

@Component({
  selector: 'app-bitacora-form',
  templateUrl: './bitacora-form.component.html',
  styleUrls: ['./bitacora-form.component.scss']
})
export class BitacoraFormComponent {
  token: any;
  uploadedFiles: any;

  proyectoSelected: Projects | null = null;
  evidenceForm: boolean = false;
  evidenceDetails: boolean = false;

  onDisplayEvidenceForm(){
    this.evidenceForm = !this.evidenceForm
  }

  HitosProcess: any[] = [];
  CategoriaEvidencia: any[] = [];
  TipoEvidencia: any[] = [];

  BitacoraForm!: FormGroup;
  idBitacora: number = 0;
  bitacoraSelected!: Bitacora;
  evidences: any[] = [];
  evidenceSelected: any;
  userValidate!: boolean;
  sidebarVisible: boolean = false;
  validateSaveButton: boolean = false;

  changeUserValidation(){
    this.userValidate = !this.userValidate;
  }

  constructor(private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService, 
    readonly serviceObsProject$: ObservableService,
    public _authGuardService: authGuardService,
    private bitacoraCatalogsService: BitacoraCatalogsService,
    private bitacoraService: BitacoraService,
    private _fb: FormBuilder,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,

  ){
    this.token = this._authGuardService.getToken();
    
    this.initFormulario();
    this.getHitosProcess();
    this.observaProjectSelected();
    this.route.params.subscribe(params => {
      this.idBitacora = params['id'];
      if(this.idBitacora){
        /** CARGADO DE FORMULARIO */
        // this.editEnable = true;
        this.onBitacoraSelected()
      } else {
        // this.idBitacora = false;
      }
    });
  }

  onBitacoraSelected(){
    this.bitacoraService.getBitacoraByID(this.idBitacora, this.token?.access_token).subscribe((resp: any) =>{
      if(resp.valido == 1){
        this.bitacoraSelected = resp.result[0];
        this.getEvidenciasByBitacora();
        this.onPatchBitacoraForm();
      }
    });
  }

  onPatchBitacoraForm(){
   
    if(this.bitacoraSelected.IDHitoProceso){
      this.getCategoriaEvidencia(this.bitacoraSelected.IDHitoProceso)
    }
    if(this.bitacoraSelected.IDCategoriaEvidencia){
      this.getTipoEvidencia(this.bitacoraSelected.IDCategoriaEvidencia)
      this.evidenceForm = true;
    }
    // getTipoEvidencia
    this.BitacoraForm.patchValue({
      fecha_registro: this.bitacoraSelected.fecha_registro,
      fecha_evento: this.datepipe.transform(this.bitacoraSelected.fecha_evento,'yyyy-MM-dd'),
      Descripcion_evento: this.bitacoraSelected.Descripcion_evento,
      agreements: this.bitacoraSelected.agreements,
      DecisionsRequired: this.bitacoraSelected.DecisionsRequired,
      IDHitoProceso: this.bitacoraSelected.IDHitoProceso,
      blogTitle: this.bitacoraSelected.blogTitle,
      IDTipoEvidencia: '',
      link_evidencia: '',
      datos_adjuntos: '',
      IDUserCreate: '',
      DateCreate: '',
      IDUserArea: '',
      Observaciones: '',
    });
  }
  

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
      } else {

      }
    });
  }

  openLinkEvidence(url: string) {
    window.open(url , '_blank');
  }

  initFormulario(){
    this.BitacoraForm = this._fb.group({
      idprojects: [''],
      fecha_registro: [],
      fecha_evento: [[Validators.required]],
      Descripcion_evento: ['',[Validators.required, TextareaPatternValidator]],
      agreements: ['',[Validators.required, TextareaPatternValidator]],
      DecisionsRequired: ['',[Validators.required, TextareaPatternValidator]],
      IDCategoriaEvidencia: [],
      IDTipoEvidencia: [],
      IDHitoProceso: [],
      blogTitle: ['',[Validators.required, Validators.pattern(regex.textAndNumbers)]],
      link_evidencia: [,[Validators.pattern(regex.link2)]],
      datos_adjuntos: [],
      IDUserCreate: [],
      DateCreate: [],
      IDUserArea: [],
      Observaciones: [],
    });
  }
  onUpload(event: any) {
    for(let file of event.files) {
        this.uploadedFiles = file;
    }
  }

  onClear(){
    this.uploadedFiles = null;
  }

  
  getHitosProcess(){
    this.bitacoraCatalogsService.getHitosProcess(this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.HitosProcess = response.result;
      } else {
          console.error("No se pudo traer la información de getHitosProcess", response.message)
      }
    })
  }

  getCategoriaEvidencia(IDHitoProceso: number){
    this.bitacoraCatalogsService.getCategoriaEvidencia(IDHitoProceso, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.CategoriaEvidencia = response.result;
          if(this.bitacoraSelected.IDHitoProceso){
            this.BitacoraForm.patchValue({IDCategoriaEvidencia: this.CategoriaEvidencia.find(x=>x.Id_CategoriaEvidencia == this.bitacoraSelected.IDCategoriaEvidencia)?.Id_CategoriaEvidencia})
          }
          this.TipoEvidencia = [];
      } else {
          console.error("No se pudo traer la información de getCategoriaEvidencia", response.message)
      }
    })
  }

  getEvidenciasByBitacora(){
    this.bitacoraService.getEvidenciasByBitacora(this.idBitacora, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.evidences = response.result;
      } else {
          console.error("No se pudo traer la información de getEvidenciasByBitacora", response.message)
      }
    })
  }

  getTipoEvidencia(IDCategoriaEvidencia: number){
    this.bitacoraCatalogsService.getTipoEvidencia(IDCategoriaEvidencia, this.token?.access_token).subscribe((response: any) => {
      if(response.valido === 1){
          this.TipoEvidencia = response.result;
          if(this.bitacoraSelected.IDCategoriaEvidencia){
            this.BitacoraForm.patchValue({IDTipoEvidencia: this.TipoEvidencia.find(x=>x.IDTipoEvidencia == this.bitacoraSelected.IDTipoEvidencia)?.IDTipoEvidencia})
          }
      } else {
          console.error("No se pudo traer la información de getTipoEvidencia", response.message)
      }
    })
  }

  onEvidenceSelected(evidence: any){


    this.evidenceSelected = evidence;
    
    if(this.evidenceSelected?.IDCategoriaEvidencia){
      this.getTipoEvidencia(this.evidenceSelected?.IDCategoriaEvidencia)
      // this.evidenceForm = true;
    }

    this.BitacoraForm.patchValue({
      IDCategoriaEvidencia: this.evidenceSelected?.IDCategoriaEvidencia,
      IDTipoEvidencia: this.evidenceSelected?.IDTipoEvidencia,
      link_evidencia: this.evidenceSelected?.link_evidencia,
      Observaciones: this.evidenceSelected?.Observaciones,
    });
    /** CUANDO SE HAGA EL GUARDADO SE CAMBIA A FALSO
     * SE VACÍARÁ EL EVIDENCESELECTED, Y SE LIMPIARAN LOS CONTROLES
     */
    this.evidenceForm = true
    this.evidenceDetails = true
  }

  isEvidenceSelected(evidence: any): boolean{
    return this.evidenceSelected === evidence;
  }

  downloadFile(fileName: string): void {
    this.bitacoraService.getDocumentBitacora(fileName).subscribe((response: any) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error descargando el archivo', error);
    });
  }

  confirm1() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed without save any evidence?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.saveBitacora();
        },
        reject: (type: any) => {
            switch (type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'You have cancelled' });
                    break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                    break;
            }
        }
    });
  }

  saveBitacora(){
    if(!this.BitacoraForm.valid){
      return this.messageService.add({ severity: 'error', summary: 'Invalid form', detail: "All fields is required"});
    }

    if(this.validateSaveButton){
      return;
    }

    let data = {
      idbitacora: this.idBitacora ? this.idBitacora : 0,
      idprojects: this.proyectoSelected?.idprojects,
      fecha_registro: this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
      fecha_evento: this.datepipe.transform(this.BitacoraForm.value.fecha_evento, 'yyyy-MM-dd'),
      Descripcion_evento: this.BitacoraForm.value.Descripcion_evento,
      agreements: this.BitacoraForm.value.agreements,
      DecisionsRequired: this.BitacoraForm.value.DecisionsRequired,
      IDCategoriaEvidencia: this.BitacoraForm.value.IDCategoriaEvidencia ? this.BitacoraForm.value.IDCategoriaEvidencia : null,
      IDTipoEvidencia: this.BitacoraForm.value.IDTipoEvidencia ? this.BitacoraForm.value.IDTipoEvidencia : null,
      IDHitoProceso: this.BitacoraForm.value.IDHitoProceso ? this.BitacoraForm.value.IDHitoProceso : null,
      blogTitle: this.BitacoraForm.value.blogTitle ? this.BitacoraForm.value.blogTitle : null,
      link_evidencia: this.BitacoraForm.value.link_evidencia ? this.BitacoraForm.value.link_evidencia : null,
      DateCreate: this.BitacoraForm.value.DateCreate ? this.BitacoraForm.value.DateCreate : null,
      IDUserArea: this.BitacoraForm.value.IDUserArea ? this.BitacoraForm.value.IDUserArea : null,
      Observaciones: this.BitacoraForm.value.Observaciones ? this.BitacoraForm.value.Observaciones : null,
    }

    this.validateSaveButton = true;

    this.bitacoraService.setBitacoraProject(data, this.uploadedFiles ,this.token?.access_token).subscribe((response: any) => {
      if(response.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
        this.resetFilesFields();
        this.validateSaveButton = false;
        this.router.navigate(['/Reports'])
        // this.router.navigate(['/Project-log'])
      } else {
        this.validateSaveButton = false;
        this.messageService.add({ severity: 'error', summary: 'Was an error', detail: "Please, try again"});
      }
    });
  }

  updateBitacora(){
    /** VALIDACION CON LOS CAMPOS RELACIONADOS A LA EVIDENCIA */
    let data = {
      idevidencia: this.evidenceSelected?.idevidencia ? this.evidenceSelected?.idevidencia : 0,
      idbitacorarelevidencia: this.evidenceSelected?.idbitacorarelevidencia ? this.evidenceSelected?.idbitacorarelevidencia : 0,
      link_evidencia: this.BitacoraForm.value.link_evidencia ? this.BitacoraForm.value.link_evidencia : null,
      IDUserCreate: 0,
      IDUserModify: this.token?.userId,
      // IDUserValidate: this.userValidate ? this.token?.userId : 1,
      idareas: this.token?.permissions[0]?.idareas || 0,
      Observaciones: this.BitacoraForm.value.Observaciones ? this.BitacoraForm.value.Observaciones : null,
      idbitacora: this.idBitacora,
      IDCategoriaEvidencia: this.BitacoraForm.value.IDCategoriaEvidencia ? this.BitacoraForm.value.IDCategoriaEvidencia : null,
      IDTipoEvidencia: this.BitacoraForm.value.IDTipoEvidencia ? this.BitacoraForm.value.IDTipoEvidencia : null,
      IDHitoProceso: this.BitacoraForm.value.IDHitoProceso ? this.BitacoraForm.value.IDHitoProceso : null,
      //aqui va el nuevo param
    }

    this.bitacoraService.updateEvidencia(data, this.uploadedFiles, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
        this.resetFilesFields();
        this.evidenceSelected = null;
        this.getEvidenciasByBitacora();
      }
    })
  }


  isValidateNumber(value: any): boolean {
    return !isNaN(value) && value !== null && value !== '';
  }

  validateEvidence(idEvidence: number, event: any){
    let conditionalIdUser = event.checked
    let data = {
      idevidencia: idEvidence,
      conditional: conditionalIdUser,
    }

    this.bitacoraService.setValidateEvidence(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "Validate is saved!"});
        this.getEvidenciasByBitacora();
      }
    });
  }

  



  resetFilesFields(){
    this.BitacoraForm.get('IDCategoriaEvidencia')?.reset();
    this.BitacoraForm.get('IDTipoEvidencia')?.reset();
    this.BitacoraForm.get('link_evidencia')?.reset();
    this.BitacoraForm.get('Observaciones')?.reset();
    this.uploadedFiles = null;
  }
}
