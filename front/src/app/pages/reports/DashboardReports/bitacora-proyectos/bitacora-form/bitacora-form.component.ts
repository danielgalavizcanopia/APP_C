// import { DatePipe } from '@angular/common';
// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
// import { Bitacora } from 'src/app/interfaces/Bitacora/Bitacora.interface';
// import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
// import { BitacoraService } from 'src/app/services/Bitacora/Bitacora.service';
// import { BitacoraCatalogsService } from 'src/app/services/Bitacora/bitacora-catalogs.service';
// import { ObservableService } from 'src/app/services/Observables/observableProject.service';
// import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
// import { ProductService } from 'src/app/services/product.service';
// import { TextareaPatternValidator } from 'src/app/services/validators/validators.service';
// import { regex } from 'src/app/util/regex';

// @Component({
//   selector: 'app-bitacora-form',
//   templateUrl: './bitacora-form.component.html',
//   styleUrls: ['./bitacora-form.component.scss']
// })
// export class BitacoraFormComponent {
//   token: any;
//   uploadedFiles: any;

//   proyectoSelected: Projects | null = null;
//   evidenceFormVisible: boolean = false; 
//   evidenceDetails: boolean = false;
  
//   @Input() formModalVisible: boolean = false;
//   @Output() formModalVisibleChange = new EventEmitter<boolean>();
//   @Output() onModalClose = new EventEmitter<void>();

//   HitosProcess: any[] = [];
//   CategoriaEvidencia: any[] = [];
//   TipoEvidencia: any[] = [];

//   BitacoraForm!: FormGroup;
//   idBitacora: number = 0;
//   bitacoraSelected!: Bitacora;
//   evidenceSelected: any;
//   userValidate!: boolean;
//   sidebarVisible: boolean = false;
//   validateSaveButton: boolean = false;
//   evidencesV: boolean = false;
  
//   loadedEvidences: any[] = [];

//   changeUserValidation(){
//     this.userValidate = !this.userValidate;
//   }

//   constructor(private productService: ProductService,
//     private confirmationService: ConfirmationService,
//     private messageService: MessageService, 
//     readonly serviceObsProject$: ObservableService,
//     public _authGuardService: authGuardService,
//     private bitacoraCatalogsService: BitacoraCatalogsService,
//     private bitacoraService: BitacoraService,
//     private _fb: FormBuilder,
//     private datepipe: DatePipe,
//     private route: ActivatedRoute,
//     private router: Router,

//   ){
//     this.token = this._authGuardService.getToken();
    
//     this.initFormulario();
//     this.getHitosProcess();
//     this.observaProjectSelected();
//     this.route.params.subscribe(params => {
//       this.idBitacora = params['id'];
//       if(this.idBitacora){
//         this.onBitacoraSelected();
//         this.formModalVisible = true;
//         this.formModalVisibleChange.emit(this.formModalVisible);
//       }
//     });
//   }

//   showFormModal() {
//     this.formModalVisible = true;
//     this.formModalVisibleChange.emit(this.formModalVisible);
//   }

//   hideFormModal() {
//     this.formModalVisible = false;
//     this.formModalVisibleChange.emit(this.formModalVisible);
//     this.onModalClose.emit();
    
//     if(this.idBitacora) {
//       this.router.navigate(['/Project-log']);
//     }
    
//     this.resetForm();
//   }

//   resetForm() {
//     this.BitacoraForm.reset();
//     this.evidences.clear();
//     this.relEvidences.clear();
//     this.loadedEvidences = [];
//     this.evidenceFormVisible = false;
//     this.evidenceSelected = null;
//     this.idBitacora = 0;
//     this.bitacoraSelected = undefined!;
//     this.uploadedFiles = null;
//   }

//   onBitacoraSelected(){
//     this.bitacoraService.getBitacoraByID(this.idBitacora, this.token?.access_token).subscribe((resp: any) =>{
//       if(resp.valido == 1){
//         this.bitacoraSelected = resp.result[0];
//         this.getEvidenciasByBitacora();
//         this.onPatchBitacoraForm();
//       }
//     });
//   }

//   onPatchBitacoraForm(){
//     if(this.bitacoraSelected.IDHitoProceso){
//       this.getCategoriaEvidencia(this.bitacoraSelected.IDHitoProceso)
//     }
    
//     this.BitacoraForm.patchValue({
//       fecha_registro: this.bitacoraSelected.fecha_registro,
//       fecha_evento: this.datepipe.transform(this.bitacoraSelected.fecha_evento,'yyyy-MM-dd'),
//       Descripcion_evento: this.bitacoraSelected.Descripcion_evento,
//       agreements: this.bitacoraSelected.agreements,
//       DecisionsRequired: this.bitacoraSelected.DecisionsRequired,
//       IDHitoProceso: this.bitacoraSelected.IDHitoProceso,
//       blogTitle: this.bitacoraSelected.blogTitle,
//     });
//   }

//   observaProjectSelected() {
//     this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
//       if(project){
//         this.proyectoSelected = project;
//       }
//     });
//   }

//   openLinkEvidence(url: string) {
//     window.open(url , '_blank');
//   }

//   initFormulario(){
//     this.BitacoraForm = this._fb.group({
//       idprojects: [''],
//       fecha_registro: [],
//       fecha_evento: ['', [Validators.required]],
//       Descripcion_evento: ['',[Validators.required, TextareaPatternValidator]],
//       agreements: ['',[Validators.required, TextareaPatternValidator]],
//       DecisionsRequired: ['',[Validators.required, TextareaPatternValidator]],
//       IDHitoProceso: ['', [Validators.required]],
//       blogTitle: ['',[Validators.required, Validators.pattern(regex.textAndNumbers)]],
      
//         newEvidence: this._fb.group({
//         IDCategoriaEvidencia: ['', [Validators.required]], 
//         IDTipoEvidencia: ['', [Validators.required]],
//         IDHitoProceso: [],
//         link_evidencia: ['',[Validators.required, Validators.pattern(regex.link2)]],
//         Observaciones: [''],
//       }),

//       rel_evidences_Json: this._fb.array([]),
//       evidences_Json: this._fb.array([]),
//     });
//   }

//   get evidences(): FormArray {
//     return this.BitacoraForm.get('evidences_Json') as FormArray;
//   }

//   get relEvidences(): FormArray {
//     return this.BitacoraForm.get('rel_evidences_Json') as FormArray;
//   }

//   get newEvidence(): FormGroup {
//     return this.BitacoraForm.get('newEvidence') as FormGroup;
//   }

//   addEvidence() {
//     if(this.BitacoraForm.get('IDHitoProceso')?.invalid){
//       return this.messageService.add({ 
//         severity: 'error', 
//         summary: 'Milestone Required', 
//         detail: 'Please select a Milestone first'
//       });
//     }

//     if(!this.newEvidence.valid){
//       this.evidencesV = true;
//       return this.messageService.add({ 
//         severity: 'error', 
//         summary: 'Fields Required', 
//         detail: 'All evidence fields are required'
//       });
//     }

//     this.relEvidences.push(this._fb.group({
//       IDCategoriaEvidencia: [this.newEvidence.value.IDCategoriaEvidencia],
//       IDTipoEvidencia: [this.newEvidence.value.IDTipoEvidencia],
//       IDHitoProceso: [this.BitacoraForm.value.IDHitoProceso],
//     }));

//     this.evidences.push(this._fb.group({
//       link_evidencia: [this.newEvidence.value.link_evidencia],
//       datos_adjuntos: [null],
//       IDUserCreate: [this.token?.userId],
//       idareas: [this.token?.permissions[0]?.idareas || 0],
//       Observaciones: [this.newEvidence.value.Observaciones || null],
//     }));

//     this.evidencesV = false;
//     this.newEvidence.reset();
    
//     this.messageService.add({ 
//       severity: 'success', 
//       summary: 'Evidence Added', 
//       detail: 'Evidence added successfully'
//     });
//   }

//   removeEvidence(index: number) {
//     this.evidences.removeAt(index);
//     this.relEvidences.removeAt(index);
//   }

//   onUpload(event: any) {
//     for(let file of event.files) {
//         this.uploadedFiles = file;
//     }
//   }

//   onClear(){
//     this.uploadedFiles = null;
//   }

//   getHitosProcess(){
//     this.bitacoraCatalogsService.getHitosProcess(this.token?.access_token).subscribe((response: any) => {
//       if(response.valido === 1){
//           this.HitosProcess = response.result;
//       } else {
//           console.error("No se pudo traer la información de getHitosProcess", response.message)
//       }
//     })
//   }

//   getCategoriaEvidencia(IDHitoProceso: number){
//     this.bitacoraCatalogsService.getCategoriaEvidencia(IDHitoProceso, this.token?.access_token).subscribe((response: any) => {
//       if(response.valido === 1){
//           this.CategoriaEvidencia = response.result;
//           this.TipoEvidencia = [];
//       } else {
//           console.error("No se pudo traer la información de getCategoriaEvidencia", response.message)
//       }
//     })
//   }

//   getEvidenciasByBitacora(){
//     this.bitacoraService.getEvidenciasByBitacora(this.idBitacora, this.token?.access_token).subscribe((response: any) => {
//       if(response.valido === 1){
//         this.loadedEvidences = response.result;
//       } else {
//           console.error("No se pudo traer la información de getEvidenciasByBitacora", response.message)
//       }
//     })
//   }

//   getTipoEvidencia(IDCategoriaEvidencia: number){
//     this.bitacoraCatalogsService.getTipoEvidencia(IDCategoriaEvidencia, this.token?.access_token).subscribe((response: any) => {
//       if(response.valido === 1){
//           this.TipoEvidencia = response.result;
//       } else {
//           console.error("No se pudo traer la información de getTipoEvidencia", response.message)
//       }
//     })
//   }

//   onEvidenceSelected(evidence: any){
//     this.evidenceSelected = evidence;
    
//     if(this.evidenceSelected?.IDCategoriaEvidencia){
//       this.getTipoEvidencia(this.evidenceSelected?.IDCategoriaEvidencia)
//       this.evidenceFormVisible = true;
//     }

//     this.newEvidence.patchValue({
//       IDCategoriaEvidencia: this.evidenceSelected?.IDCategoriaEvidencia,
//       IDTipoEvidencia: this.evidenceSelected?.IDTipoEvidencia,
//       link_evidencia: this.evidenceSelected?.link_evidencia,
//       Observaciones: this.evidenceSelected?.Observaciones,
//     });
    
//     this.evidenceDetails = true
//   }

//   isEvidenceSelected(evidence: any): boolean{
//     return this.evidenceSelected === evidence;
//   }

//   updateBitacora(){
//     let data = {
//       idevidencia: this.evidenceSelected?.idevidencia ? this.evidenceSelected?.idevidencia : 0,
//       idbitacorarelevidencia: this.evidenceSelected?.idbitacorarelevidencia ? this.evidenceSelected?.idbitacorarelevidencia : 0,
//       link_evidencia: this.newEvidence.value.link_evidencia ? this.newEvidence.value.link_evidencia : null,
//       IDUserCreate: 0,
//       IDUserModify: this.token?.userId,
//       idareas: this.token?.permissions[0]?.idareas || 0,
//       Observaciones: this.newEvidence.value.Observaciones ? this.newEvidence.value.Observaciones : null,
//       idbitacora: this.idBitacora,
//       IDCategoriaEvidencia: this.newEvidence.value.IDCategoriaEvidencia ? this.newEvidence.value.IDCategoriaEvidencia : null,
//       IDTipoEvidencia: this.newEvidence.value.IDTipoEvidencia ? this.newEvidence.value.IDTipoEvidencia : null,
//       IDHitoProceso: this.BitacoraForm.value.IDHitoProceso ? this.BitacoraForm.value.IDHitoProceso : null,
//     }

//     this.bitacoraService.updateEvidencia(data, this.uploadedFiles, this.token?.access_token).subscribe((resp: any) => {
//       if(resp.valido == 1){
//         this.messageService.add({ 
//           severity: 'success', 
//           summary: 'Save Successfully', 
//           detail: "Evidence updated successfully!"
//         });
//         this.resetEvidenceFields();
//         this.evidenceSelected = null;
//         this.getEvidenciasByBitacora();
//       }
//     })
//   }

//   resetEvidenceFields(){
//     this.newEvidence.reset();
//     this.uploadedFiles = null;
//     this.evidenceFormVisible = false;
//     this.evidenceDetails = false;
//   }

//   downloadFile(fileName: string): void {
//     this.bitacoraService.getDocumentBitacora(fileName).subscribe((response: any) => {
//       const url = window.URL.createObjectURL(response);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     }, error => {
//       console.error('Error descargando el archivo', error);
//     });
//   }

//   getCategoryName(idCategoria: number): string {
//     const category = this.CategoriaEvidencia.find(c => c.Id_CategoriaEvidencia === idCategoria);
//     return category ? category.NombreCategoríaLargo : '';
//   }

//   getTypeName(idTipo: number): string {
//     const type = this.TipoEvidencia.find(t => t.IDTipoEvidencia === idTipo);
//     return type ? type.DescripcionEvidencia : '';
//   }

//   confirm1() {
//     if(this.evidences.length === 0 && !this.idBitacora) {
//       this.confirmationService.confirm({
//         message: 'Are you sure that you want to proceed without save any evidence?',
//         icon: 'pi pi-exclamation-triangle',
//         accept: () => {
//           this.saveBitacora();
//         },
//         reject: (type: any) => {
//           switch (type) {
//             case ConfirmEventType.REJECT:
//               this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'You have cancelled' });
//               break;
//             case ConfirmEventType.CANCEL:
//               this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
//               break;
//           }
//         }
//       });
//     } else {
//       this.saveBitacora();
//     }
//   }

//   saveBitacora(){
//     this.clearValidatorsFormGroups(this.BitacoraForm, 'newEvidence');
//     if(!this.BitacoraForm.valid){
//       return this.messageService.add({ 
//         severity: 'error', 
//         summary: 'Invalid form', 
//         detail: "All fields are required"
//       });
//     }

//     if(this.validateSaveButton){
//       return;
//     }


//     let data = {
//       idbitacora: this.idBitacora ? this.idBitacora : 0,
//       idprojects: this.proyectoSelected?.idprojects,
//       fecha_evento: this.datepipe.transform(this.BitacoraForm.value.fecha_evento, 'yyyy-MM-dd'),
//       Descripcion_evento: this.BitacoraForm.value.Descripcion_evento,
//       agreements: this.BitacoraForm.value.agreements,
//       DecisionsRequired: this.BitacoraForm.value.DecisionsRequired,
//       IDHitoProceso: this.BitacoraForm.value.IDHitoProceso,
//       blogTitle: this.BitacoraForm.value.blogTitle,
//       rel_evidences_Json: this.BitacoraForm.value.rel_evidences_Json,
//       evidences_Json: this.BitacoraForm.value.evidences_Json,
//     }
//     console.log('Data a enviar:', data);

//     this.validateSaveButton = true;

//     this.bitacoraService.setBitacoraProject(data, null, this.token?.access_token)
//       .subscribe((response: any) => {
//         if(response.valido == 1){
//           this.messageService.add({ 
//             severity: 'success', 
//             summary: 'Save Successfully', 
//             detail: "Log and evidences saved!"
//           });
//           this.validateSaveButton = false;
//           this.hideFormModal();
//         } else {
//           this.validateSaveButton = false;
//           this.messageService.add({ 
//             severity: 'error', 
//             summary: 'Error', 
//             detail: response.message || "Please, try again"
//           });
//         }
//       }, (error: any) => {
//         this.validateSaveButton = false;
//         this.messageService.add({ 
//           severity: 'error', 
//           summary: 'Error', 
//           detail: 'An error occurred while saving'
//         });
//       });
//   }

//   clearValidatorsFormGroups(parent: FormGroup, childGroupName: string): void {
//     const childGroup = parent.get(childGroupName) as FormGroup;

//     if (!childGroup) {
//       return;
//     }

//     Object.keys(childGroup.controls).forEach(key => {
//       const control = childGroup.get(key);
//       control?.clearValidators();
//       control?.updateValueAndValidity();
//     });
//   }

//   isValidateNumber(value: any): boolean {
//     return !isNaN(value) && value !== null && value !== '';
//   }

//   validateEvidence(idEvidence: number, event: any){
//     let conditionalIdUser = event.checked
//     let data = {
//       idevidencia: idEvidence,
//       conditional: conditionalIdUser,
//     }

//     this.bitacoraService.setValidateEvidence(data, this.token?.access_token).subscribe((resp: any) => {
//       if(resp.valido == 1){
//         this.messageService.add({ 
//           severity: 'success', 
//           summary: 'Save Successfully', 
//           detail: "Validate is saved!"
//         });
//         this.getEvidenciasByBitacora();
//       }
//     });
//   }
// }