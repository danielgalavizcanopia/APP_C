import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ActivityData } from 'src/app/interfaces/implementation/Implementation.interface';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { ImplementationCatalogsService } from 'src/app/services/Implementacion/Implementacion-catalogs.service';
import { ImplementacionService } from 'src/app/services/Implementacion/Implementacion.service';
import { MonCatalogService } from 'src/app/services/MonitoringProjects/MonCatalog.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { ProductService } from 'src/app/services/product.service';
import { RPCatalogsService } from 'src/app/services/ReportingPeriods/RPCatalogs.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { CapexOpexAccountsService } from 'src/app/services/Tools/CapexOpexAccounts.service';
import { TextareaPatternValidator } from 'src/app/services/validators/validators.service';
import { regex } from 'src/app/util/regex';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

interface City {
  name: string;
  code: number;
}

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent {

  @ViewChild('dt1') dt1!: Table;
  
  handleGlobalFilter(event: any): void {
    const input = event.target as HTMLInputElement;
    this.dt1.filterGlobal(input.value, 'contains');
  }
  idRPSelected: any;

  private subs!: Subscription;

  url: string = environment.url
  token: any;
  products!: any[];
  cities: City[];
  selectedActivities: any[] = [];
  selectedCopyActivities: any[] = [];
  activitiesByReport: any[] = [];
  items!: MenuItem[];
  itemsButton!: MenuItem[];
  activeIndex: number = 0;

  onActiveIndexChange(event: any) {
    this.activeIndex = event; 
  }
  proyectoSelected: Projects | null = null;
  
  visible: boolean = false;
  visibleConfirm: boolean = false;
  visibleCopy: boolean = false;

  showVisible(){
    this.addItem()
    this.addReporteo()
    this.visible = true;
  }

  hideVisible(){
    this.visible = false;
    this.visibleCopy = false;
    this.activityForm.reset();
    this.activityForm.get('p_idrpnumber')?.enable();
    this.IndCuantitativos.clear();
    this.Reporteo.clear();
    this.onClear();
    this.activitySelected = undefined!;
    this.indicadoresCuantitativosByActividad = [];
    this.metricaLabel = [];
    this.formValidate = false;
    this.OdsDeleted = [];
    this.activateCopyActivity = false;
    this.selectedCopyActivities = [];
    this.isActiveRPfield = false
  }

  showConfirmVisible(){
    if(!this.RPselected){
      return this.messageService.add({ severity: 'error', summary: 'RP Number Required', detail: 'Please select a RP Number to generate the Annual Plan'});
    }

    this.visibleConfirm = true;
  }

  hideConfirmVisible(){
    this.activeIndex = 0;
    this.visibleConfirm = false;
    this.RPselected = null;
    this.selectedActivities = [];
    this.selectedActivities = [];
    this.activitiesByReport = [];
    this.selectedCopyActivities.length = 0;
    this.getActivitiesData();
  }

  onUpload(event: any) {
    for(let file of event.files) {
        this.uploadedFiles = file;
    }
  }

  onClear(){
    this.uploadedFiles = null;
  }

  RPselected: any;
  description: any;

  activities: any[] = [];
  filteredActivities: any[] = [];
  totalCost: number = 0;
  activitySelected!: ActivityData;
  activityDuplicated!: ActivityData;
  activityData!: ActivityData;
  activityForm!: FormGroup;
  formValidate!: boolean;
  typeAccounts: number = 1;
  rpnumbers!: any[];
  activitiesCt!: any[];
  SOPs!: any[];
  Metricas!: any[];
  CuentasCapex!: any[];
  CuentasOpex!: any[];
  Coordinadores!: any[];
  ejecutorCampo!: any[];
  evaluador!: any[];
  seguimiento!: any[];
  supervisores!: any[];
  usuarioName: string = '';
  indicadorName: string = '';
  validacionesSt!: any[];
  IndicadoresCuantitativos!: any[];
  IndicadoresCuantitativosKPI!: any[];
  Ods!: any[];
  odsSelected: string = '';
  indicadoresCuantitativosByActividad!: any[];
  OdsByActividad!: any[];
  OdsDeleted: any[] = [];
  ValoresIndicadoresCuant!: any[];
  MetricaSelected: any[] = [];
  validacionSelected: any;
  idgenerated: any;
  uploadedFiles: any;
  metricaLabel: any[] = [];
  loading: boolean = false;
  disableButton: boolean = false;
  disablePlanButton: boolean = false;

  seguimientoadd: boolean = false;
  hideseguimiento(){
    this.seguimientoadd = false;
    this.usuarioName = '';
  }

  indicadorcuantitativoadd: boolean = false;

  hideindicadorcuantiv(){
    this.indicadorcuantitativoadd = false;
    this.indicadorName = '';
  }

  coordinadoradd: boolean = false;
  hidecoordinador(){
    this.coordinadoradd = false;
    this.usuarioName = ''
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  filter(value: string, callback: Function) {
    
    callback(value); // Aplica el filtro automáticamente
  }

  catchValue(event: any){
    this.calculateTotal(event);
  }

  totalFilter!: any;

  activateCopyActivity: boolean = false;
  onDuplicateActivity() {
    if(this.selectedCopyActivities.length > 0 && this.selectedCopyActivities.length < 2) {
      const activity: ActivityData = this.selectedCopyActivities[0];
      this.activateCopyActivity = true;
      this.visibleCopy = true;
      this.onRowSelected(activity);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Copy error', detail: 'Please select an activity to copy'});
    }
  }

  isActiveRPfield: boolean = false;
  searchText: string = '';
  activitiesOriginal: any[] = [];

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
    private _fb: FormBuilder, private _implementacionService: ImplementacionService,  public _authGuardService: authGuardService,
        private MonitoringCatalogService: MonCatalogService, private RPcatalogsService: RPCatalogsService, private _implementationCatalogsService: ImplementationCatalogsService,
    private readonly serviceObsProject$: ObservableService,
    private router: Router, private cd: ChangeDetectorRef
  ) {

    this.token = this._authGuardService.getToken();
    this.observaProjectSelected();

    this.getRPnumber();
    this.getCtActivities();
    this.getMetricas();
    this.getCuentasCapex();
    this.getCuentasOpex();
    this.getOds();
    this.getSOPs();
    this.getCoordinadores();
    this.getejecutorCampo();
    this.getevaluador();
    this.getseguimiento();
    this.getsupervisores();
    this.getStatusValidacion();
    this.getIndicadoresCuantitativos();
    // this.getIndicadoresCuantitativosByKPI();

    this.cities = [
      { name: 'Capex Accounts', code: 1 },
      { name: 'Opex Accounts', code: 2 },
    ];

    this.items = [
      {
          label: 'Initial Data',
      },
      {
          label: 'Select Activities',
      },
      {
          label: 'Preview',
      },
    ];

    this.itemsButton = [
        {
        label: 'New Activity',
        icon: 'pi pi-plus',
        command: () => {
          this.showVisible();
        }
      },
        {
        label: 'Generate Annual Plan',
        icon: 'pi pi-file',
        command: () => {
          this.showConfirmVisible();
        }
      },
      {
        label: 'Download Draft',
        icon: 'pi pi-file-excel',
        command: () => {
          this.downloadExcelDraft();
        }
      },
      {
        label: 'Copy Activity',
        icon: 'pi pi-copy',
        command: () => {
          this.onDuplicateActivity();
        }
      }
    ]

    this.initFormulario();

    /** actualiza cuando viene señal del update de activities de los padis */
    this.subs = this.serviceObsProject$.refreshPADI$.subscribe(() => {
      this.getActivitiesData();
    });
  }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.getActivitiesData();
        this.RPselected = null;
      } else {
      }
    });
  } 

  initFormulario(){ 
    this.activityForm = this._fb.group({
      p_IdActividaddata: [],
      p_idactivitiesprojects: [,[Validators.required]],
      p_idrpnumber: [,[Validators.required]],
      p_objetivo: [,[Validators.required, TextareaPatternValidator]],
      p_Idsop: [,[Validators.required]],
      p_fechaPeriodostart: [,[Validators.required]],
      p_fechaPeriodoend: [,[Validators.required]],
      p_Estimado: [,[Validators.required]],
      p_Ca_o_pex: [,[Validators.required]],
      p_Ods: [],
      p_idopexsubaccount: [],
      p_idcapexsubaccount: [],
      p_Cualitativos: [,[Validators.required, TextareaPatternValidator]],
      p_linkdelarchivo: [],
      p_UserEjecutordeCampo: [,[Validators.required]],
      p_IDUserCoordinador: [,[Validators.required]],
      p_IDUserSeguimiento: [,[Validators.required]],
      p_UserSupervisor: [,[Validators.required]],
      p_IDUserEvaluador: [,[Validators.required]],
      /** FORM ARRAY */
      IndCuantitativos: this._fb.array([],),
      Reporteo: this._fb.array([],)
    })
    this.activityForm.reset();
  }

  get IndCuantitativos() : FormArray {
    return this.activityForm.get('IndCuantitativos') as FormArray;
  }

  get Reporteo() : FormArray {
    return this.activityForm.get('Reporteo') as FormArray;
  }

  addItem() {
      this.IndCuantitativos.push(this._fb.group({
          idactividadrel: [],
          indicadorId: ['',[Validators.required]],
          cantidad: [0,[Validators.required]],
          metrica: ['',[Validators.required]],
      }));
  }

  removeItem(index: number) {
    const controlToRemove = this.IndCuantitativos.at(index);

    if (controlToRemove) {
      controlToRemove.clearValidators();
      controlToRemove.updateValueAndValidity();
    }
    
    this.IndCuantitativos.removeAt(index);
  }

  addReporteo() {
    this.Reporteo.push(this._fb.group({
        Idactividadreporting: [],
        quien: ['', [Validators.required]],
        como: ['', [Validators.required]],
        cuando: ['', [Validators.required]],
    }));
  }

  removeReporteo(index: number) {
      this.Reporteo.removeAt(index);
  }

  getRPnumber(){
    this.RPcatalogsService.getRPnumber( this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.rpnumbers = resp.result;
      }
    });
  }

  getCtActivities(){
    this._implementationCatalogsService.getCtActivities(this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.activitiesCt = resp.result;
      }
    });
  }

  getSOPs(){
    this._implementationCatalogsService.getSOPs(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
      this.SOPs = resp.result;
      }
    });
  }

  getMetricas(){
    this.MonitoringCatalogService.getMetricas(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.Metricas = response.result;
        } else {
            console.error("No se pudo traer la información de getMetricas", response.message)
        }
    })
  }

  getCuentasCapex(){
    this._implementationCatalogsService.getCapexSubAccounts(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.CuentasCapex = response.result;
        } else {
            console.error("No se pudo traer la información de getCuentasCapex", response.message)
        }
    })
  }

  getCuentasOpex(){
    this._implementationCatalogsService.getOpexSubAccounts(this.token?.access_token).subscribe((response: any) => {
        if(response.valido === 1){
            this.CuentasOpex = response.result;
        } else {
            console.error("No se pudo traer la información de getCuentasOpex", response.message)
        }
        })
  }

  getCoordinadores(){
    this._implementationCatalogsService.getCoordinadores(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.Coordinadores = resp.result;
      }
    });
  }

  getejecutorCampo(){
    this._implementationCatalogsService.getejecutorCampo(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.ejecutorCampo = resp.result;
      }
    });
  }

  getevaluador(){
    this._implementationCatalogsService.getevaluador(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.evaluador = resp.result;
      }
    });
  }

  getseguimiento(){
    this._implementationCatalogsService.getseguimiento(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.seguimiento = resp.result;
      }
    });
  }

  getsupervisores(){
    this._implementationCatalogsService.getsupervisores(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.supervisores = resp.result;
      }
    });
  }

  getStatusValidacion(){
    this._implementationCatalogsService.getStatusValidacion(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.validacionesSt = resp.result;
      }
    });
  }

  getIndicadoresCuantitativos(){
    this._implementationCatalogsService.getIndicadoresCuantitativos(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.IndicadoresCuantitativos = resp.result;
      }
    });
  }

  getIndicadoresCuantitativosByKPI(){
    this._implementationCatalogsService.getIndicadoresCuantitativosByKPI(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.IndicadoresCuantitativosKPI = resp.result;
      }
    });
  }

  getOds(){
    this._implementationCatalogsService.getOds(this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.Ods = resp.result;
      }
    });
  }

  filtradoMetrica(value: any ,i: number){
    this.MetricaSelected[i] = this.IndicadoresCuantitativosKPI.find(x=>x.Idcuantitativo == value);
    this.IndCuantitativos.controls[i].patchValue({metrica: this.MetricaSelected[i].Idmetrica})
    this.metricaLabel.push({Metrica: this.Metricas.find(x=>x.Idmetrica == this.MetricaSelected[i].Idmetrica)?.Metrica})
  }

  getActivitiesData(){
    this.loading = true; 
    this._implementacionService.getActivitiesData(this.proyectoSelected?.idprojects ,this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.activities = resp.result;
        this.filteredActivities = this.getFilteredActivities(this.RPselected, this.searchText);
        this.loading = false
        this.calculateTotal(this.idRPSelected);
        // this.activities = this.copyFilteredActivities();
        this.selectedCopyActivities = [];
        this.selectedAll = false;
        // this.activities = [...this.activitiesOriginal];
      }
    });
  }
 
  getIndicadoresCuantitativosByActividad(idActividad: number){
    this._implementacionService.getIndicadoresCuantitativosByActividad(idActividad, this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.indicadoresCuantitativosByActividad = resp.result;
        for(let i = 0; i < this.indicadoresCuantitativosByActividad.length; i++){
          let indicador = this.indicadoresCuantitativosByActividad[i];

          this.metricaLabel.push({Metrica: this.Metricas.find(x=>x.Idmetrica == indicador.Idmetrica)?.Metrica});

          this.IndCuantitativos.push(this._fb.group({
            idactividadrel: [indicador.Idactividadrelcuantitativo],
            indicadorId: [indicador.Idcuantitativo,[Validators.required]],
            cantidad: [indicador.estimado,[Validators.required]],
            metrica: [indicador.Idmetrica]
          }))
        }
      }
    });
  }

  getOdsByActividad(idActividad: number){
    this._implementacionService.getOdsByActividad(idActividad, this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.OdsByActividad = resp.result;
        let valuesOptions = [];
        for(let i = 0; i < this.OdsByActividad.length; i++){
          let ods = this.OdsByActividad[i];

          valuesOptions.push(this.Ods.find(x => x.Idglobalgoals == ods.Idglobalgoals))
        }
        this.activityForm.patchValue({
          p_Ods: valuesOptions,
        })
      }
    })
  }

  getReporteoByActividad(idActividad: number){
    this._implementacionService.getReporteoByActividad(idActividad, this.token.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        let reporteos = resp.result;
        for(let reporteo of reporteos){
          const fechaInicio = new Date(reporteo.ReportingCuando)
          this.Reporteo.push(this._fb.group({
            Idactividadreporting: [reporteo.Idactividadreporting],
            quien: [reporteo.ReportingQuien, [Validators.required]],
            como: [reporteo.ReportingComo, [Validators.required]],
            cuando: [fechaInicio, [Validators.required]],
          }))
        }
      }
    });
  }

  typeAccountSelected(event: any){
    if(event.value == 1){
      this.activityForm.get('p_idopexsubaccount')?.removeValidators([Validators.required])
      this.activityForm.get('p_idopexsubaccount')?.reset()
      this.activityForm.get('p_idcapexsubaccount')?.setValidators([Validators.required])
      this.activityForm.get('p_idcapexsubaccount')?.updateValueAndValidity()
      this.typeAccounts = 1;
    }

    if(event.value == 2){
      this.activityForm.get('p_idcapexsubaccount')?.removeValidators([Validators.required])
      this.activityForm.get('p_idcapexsubaccount')?.reset()
      this.activityForm.get('p_idopexsubaccount')?.setValidators([Validators.required])
      this.activityForm.get('p_idopexsubaccount')?.updateValueAndValidity()
      this.typeAccounts = 2;
    }

  }

  catchODS(event: any){
    if(event?.value){
      this.odsSelected = this.Ods.find(x => x.Idglobalgoals === event?.value)?.LargeDescriptionODSs
    } else {
      this.odsSelected = '';
    }

  }

  onStatusSelected(Activity: ActivityData){
    this.activitySelected = Activity;
  }

  onRowSelected(Activity: ActivityData){
    this.activitySelected = Activity; // DEFINO LA ACTIVIDAD SELECCIONADA

    const fechaInicio = new Date(this.activitySelected?.actividaddatestart);
    const fechaFin = new Date(this.activitySelected?.actividaddateend);

    if(this.activateCopyActivity){ // VALIDO SI SE ESTA COPIANDO UNA ACTIVIDAD
      this.visibleCopy = true;
      this.activityForm.get('p_idrpnumber')?.enable();
      this.activitySelected.IdActividaddata = 0;
      const value = { value: this.activitySelected.Ca_o_pex}
      this.typeAccountSelected(value); // SELECCIONO EL TIPO DE CUENTA

      this.activityForm.patchValue({
        p_IdActividaddata: this.activitySelected?.IdActividaddata,
        p_idactivitiesprojects: this.activitySelected?.idactivitiesprojects,
        p_objetivo: this.activitySelected?.objetivo,
        p_Idsop: this.activitySelected?.Idsop,
        p_Estimado: this.activitySelected?.EstimadoUSD,
        p_Ca_o_pex: this.activitySelected?.Ca_o_pex,
        p_idopexsubaccount: this.activitySelected?.idopexsubaccount,
        p_idcapexsubaccount: this.activitySelected?.idcapexsubaccount,
        p_Cualitativos: this.activitySelected?.Cualitativos,
        p_linkdelarchivo: this.activitySelected?.linkdelarchivo,
        p_UserEjecutordeCampo: this.activitySelected?.UserEjecutordeCampo,
        p_IDUserCoordinador: this.activitySelected?.IDUserCoordinador,
        p_IDUserSeguimiento: this.activitySelected?.IDUserSeguimiento,
        p_UserSupervisor: this.activitySelected?.UserSupervisor,
        p_IDUserEvaluador: this.activitySelected?.IDUserEvaluador,
      });

      this.addItem()
      this.addReporteo()

    } else { // SI NO SE ESTA COPIANDO UNA ACTIVIDAD, FUNCIONA EL SIMPLE EDIT
      this.activityForm.get('p_idrpnumber')?.disable();
      this.visible = true;
      if(this.activitySelected.Ca_o_pex == 1) this.typeAccounts = 1;
      if(this.activitySelected.Ca_o_pex == 2) this.typeAccounts = 2;
  
      this.getReporteoByActividad(this.activitySelected.IdActividaddata);
      this.getIndicadoresCuantitativosByActividad(this.activitySelected.IdActividaddata);
      this.getOdsByActividad(this.activitySelected.IdActividaddata);
  
      this.activityForm.patchValue({
        p_IdActividaddata: this.activitySelected?.IdActividaddata,
        p_idactivitiesprojects: this.activitySelected?.idactivitiesprojects,
        p_idrpnumber: this.activitySelected?.idrpnumber,
        p_objetivo: this.activitySelected?.objetivo,
        p_Idsop: this.activitySelected?.Idsop,
        p_fechaPeriodostart: fechaInicio,
        p_fechaPeriodoend: fechaFin,
        p_Estimado: this.activitySelected?.EstimadoUSD,
        p_Ca_o_pex: this.activitySelected?.Ca_o_pex,
        p_idopexsubaccount: this.activitySelected?.idopexsubaccount,
        p_idcapexsubaccount: this.activitySelected?.idcapexsubaccount,
        p_Cualitativos: this.activitySelected?.Cualitativos,
        p_linkdelarchivo: this.activitySelected?.linkdelarchivo,
        p_UserEjecutordeCampo: this.activitySelected?.UserEjecutordeCampo,
        p_IDUserCoordinador: this.activitySelected?.IDUserCoordinador,
        p_IDUserSeguimiento: this.activitySelected?.IDUserSeguimiento,
        p_UserSupervisor: this.activitySelected?.UserSupervisor,
        p_IDUserEvaluador: this.activitySelected?.IDUserEvaluador,
      });
    }


  }

  onSelectionChange(event: any) {
    if(this.activitySelected){
      const currentSelection = event.value; // Valores actuales seleccionados
      const removedOptions = this.OdsByActividad.filter(
        value => !currentSelection.some((selected: any) => selected.Idglobalgoals === value.Idglobalgoals)
      );
  
      this.OdsDeleted = removedOptions;
    }
  }

  confirmSave(event: any) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'At this moment, you’re going to switch activity from one RP to another. It will cease to exist and move to the other one. Are you sure you want to continue?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.save();
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
  }

  save(){
    if(!this.activityForm.valid){
      this.formValidate = true;
      return this.messageService.add({ severity: 'error', summary: 'Fields Required', detail: 'All fields is required'});
    }

    if(this.IndCuantitativos.length <= 0){
      return this.messageService.add({ severity: 'error', summary: 'Quantitative Indicators section required', detail: 'Please, add 1 quantitative indicator'});
    }

    if(this.Reporteo.length <= 0){
      return this.messageService.add({ severity: 'error', summary: 'Reporting section required', detail: 'Please, add 1 quantitative reporting'});
    }

    if(this.activateCopyActivity && this.activityForm.value.p_idrpnumber == this.activitySelected.idrpnumber){
      return this.messageService.add({ severity: 'error', summary: 'Copy activity error', detail: 'Please, select a different RP Number to copy the activity'});
    }

    let RPSelected = null;

    if(this.activateCopyActivity){
      RPSelected = this.activityForm.value.p_idrpnumber;
    } else if(this.activitySelected && this.activitySelected.IdActividaddata){
      RPSelected = this.activitySelected.idrpnumber;
    } else {
      RPSelected = this.activityForm.value.p_idrpnumber;
    }

    let odsToSave = this.activityForm.value.p_Ods;
    let odsFinal = []

    if(this.activitySelected){
      if(this.OdsDeleted.length != 0){
        for(let odsdel of this.OdsDeleted){
          odsFinal.push({
            p_Idactividad_rel_odss: odsdel.Idactividad_rel_odss,
            p_IdActividaddata: this.activitySelected ? this.activitySelected.IdActividaddata : 0,
            p_Idglobalgoals: odsdel.Idglobalgoals,
            p_Status: 0
          })
        }
      }
    }

    if(odsToSave && odsToSave.length != 0){
      for(let odssave of odsToSave){
        let findId = this.OdsByActividad ? this.OdsByActividad.find(x => x.Idglobalgoals == odssave.Idglobalgoals)?.Idactividad_rel_odss : null;
        odsFinal.push({
          p_Idactividad_rel_odss: findId ? findId : 0,
          p_IdActividaddata: this.activitySelected ? this.activitySelected.IdActividaddata : 0,
          p_Idglobalgoals: odssave.Idglobalgoals,
          p_Status: 1
        })
        findId = null;
      }
    }

    this.disableButton = true;

    let indicadoresArray = this.IndCuantitativos.value
    let reporteoArray = this.Reporteo.value

    let data = {
      p_IdActividaddata: this.activitySelected ? this.activitySelected.IdActividaddata : 0,
      p_idprojects: this.proyectoSelected ? this.proyectoSelected.idprojects : 0,
      // p_NombreActividad: this.activityForm.value.p_NombreActividad,
      p_idactivitiesprojects: this.activityForm.value.p_idactivitiesprojects,
      p_idrpnumber: this.isActiveRPfield ? this.activityForm.value.p_idrpnumber : RPSelected,
      p_objetivo: this.activityForm.value.p_objetivo,
      p_Idsop: this.activityForm.value.p_Idsop,
      p_fechaPeriodostart: formatDate(this.activityForm.value.p_fechaPeriodostart, 'yyyy-MM-dd', 'es-MX'),
      p_fechaPeriodoend: formatDate(this.activityForm.value.p_fechaPeriodoend, 'yyyy-MM-dd', 'es-MX'),
      p_Estimado: this.activityForm.value.p_Estimado,
      p_Ca_o_pex: this.activityForm.value.p_Ca_o_pex,
      p_idopexsubaccount: this.activityForm.value.p_idopexsubaccount,
      p_idcapexsubaccount: this.activityForm.value.p_idcapexsubaccount,
      p_Cualitativos: this.activityForm.value.p_Cualitativos,
      p_linkdelarchivo: this.activitySelected ? this.activitySelected.linkdelarchivo : '',
      p_UserEjecutordeCampo: this.activityForm.value.p_UserEjecutordeCampo,
      p_IDUserCoordinador: this.activityForm.value.p_IDUserCoordinador,
      p_IDUserSeguimiento: this.activityForm.value.p_IDUserSeguimiento,
      p_UserSupervisor: this.activityForm.value.p_UserSupervisor,
      p_IDUserEvaluador: this.activityForm.value.p_IDUserEvaluador,
      p_status: 1,
      indicadores: indicadoresArray,
      reporteo: reporteoArray,
      ods: odsFinal
    }

    this._implementacionService.setActivitiesData(data, this.uploadedFiles, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.idgenerated = resp.result[0]?.IdActividaddata;
        if(!data.p_IdActividaddata) this.setValidaciones();
        this.getActivitiesData();
        this.disableButton = false;
        this.hideVisible();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Activity save successfully!'});
      } else {
        this.disableButton = false;
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  deleteIndicators(indicator: any){
    if(!indicator.idactividadrel){
      return;
      
    }

    let data = {
      p_Idactividadrelcuantitativo: indicator.idactividadrel,
      p_IdActividaddata: this.activitySelected.IdActividaddata,
      p_Idcuantitativo: indicator.Idcuantitativo,
      p_estimado: indicator.estimado,
      p_Idmetrica: indicator.Idmetrica
    }
    
    this._implementacionService.deleteIndicators(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete Indicator row'});
      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  deleteReporting(indicator: any){
    if(!indicator.Idactividadreporting){
      return;
    }

    let data = {
      p_Idactividadreporting: indicator.Idactividadreporting,
      p_IdActividaddata: this.activitySelected.IdActividaddata,
      p_ReportingQuien: indicator.quien,
      p_ReportingComo: indicator.como,
      p_ReportingCuando: indicator.cuando
    }
    
    this._implementacionService.deleteReporting(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete Reporting row'});
      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  setValidaciones(){

    let idValidacion;
    if(this.activateCopyActivity && this.activitySelected) idValidacion = 0
    else idValidacion = this.activitySelected ? this.activitySelected.Idvalidacion : 0;
    let idActividadData;
    if(this.activateCopyActivity && this.activitySelected) idActividadData = 0
    else idActividadData = this.activitySelected && !this.activateCopyActivity ? this.activitySelected.IdActividaddata : 0;
    
    let data = {
      Idvalidacion: this.activitySelected && this.activitySelected.IdActividaddata ? this.activitySelected.Idvalidacion : idValidacion,
      IdActividaddata: idActividadData ? idActividadData : this.idgenerated,
      IdstatusValidacion: this.validacionSelected != 0 ? this.validacionSelected : 1,     
    }
    this._implementacionService.setValidaciones(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.getActivitiesData();
        this.idgenerated = null;
        this.activitySelected = undefined!;
        this.validacionSelected = undefined!;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Status changed successfully!'});
      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  confirm(event: any, activity: ActivityData, instruction: number) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.disableActivity(activity, instruction)
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
  }
  
  disableActivity(activity: ActivityData, instruction: number){
    let data = {
      p_IdActividaddata: activity.IdActividaddata,
      p_NombreActividad: activity.NombreActividad,
      p_idrpnumber: activity.idrpnumber,
      p_objetivo: activity.objetivo,
      p_Idsop: activity.Idsop,
      p_fechaPeriodostart: activity.actividaddatestart,
      p_fechaPeriodoend: activity.actividaddateend,
      p_Estimado: activity.EstimadoUSD,
      p_Ca_o_pex: activity.Ca_o_pex,
      p_idopexsubaccount: activity.idopexsubaccount,
      p_idcapexsubaccount: activity.idcapexsubaccount,
      p_Cualitativos: activity.Cualitativos,
      p_linkdelarchivo: activity.linkdelarchivo,
      p_UserEjecutordeCampo: activity.UserEjecutordeCampo,
      p_IDUserCoordinador: activity.IDUserCoordinador,
      p_IDUserSeguimiento: activity.IDUserSeguimiento,
      p_UserSupervisor: activity.UserSupervisor,
      p_IDUserEvaluador: activity.IDUserEvaluador,
      p_status: instruction
    }

    this._implementacionService.setActivitiesData(data, this.uploadedFiles, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Activity changed successfully!'});
        this.getActivitiesData();
        this.hideVisible();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  saveIndicadorCuantitativo(){
    if(!this.indicadorName){
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Indicator Name is Required field'});
    }
    if(this.indicadorName.length >= 30){
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Indicator Name is very longer'});
    }

    let data = {
      p_Idcuantitativo: 0,
      p_nombre: this.indicadorName,
    }

    this._implementacionService.setCuantitativos(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Name saved successfully!'});
        this.getIndicadoresCuantitativos();
        this.hideindicadorcuantiv();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })

  }

  saveUsuarioName(positionId: number){
    if(!this.usuarioName){
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User Name is Required field'});
    }

    if(this.usuarioName.length >= 55){
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User Name is very longer'});
    }
    let data = {
      Idusuariosname: 0,
      Name: this.usuarioName,
      Status: 1,
      id_positions: positionId,
    }

    this._implementacionService.setUsuariosName(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Name saved successfully!'});
        if(positionId == 7){
          this.hideseguimiento();
          this.getseguimiento();
        }
        if(positionId == 2){
          this.hidecoordinador();
          this.getCoordinadores();
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  getTotalActivitiesSelected(activities: any[]): any{
    let sumTotal = 0;
    if(activities.length != 0){
      for (let activity of activities){
        sumTotal += parseFloat(activity?.EstimadoUSD)
      }
      return sumTotal
    } else {
      return 0;
    }
  }

  generateAnnualPlan(){
    if(this.selectedCopyActivities.length < 2){
      return this.messageService.add({ severity: 'error', summary: 'None Activities', detail: 'You need select mininum 2 activity to generate Annual Plan'});
    }

    if(!this.description){
      return this.messageService.add({ severity: 'error', summary: 'None Activities', detail: 'Please, add a description'});
    }

    const findOthersRp = this.selectedCopyActivities.find(x => x.idrpnumber != this.RPselected);
    if(findOthersRp){
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You can not select activities from differents RP'});
    }

    const validateApprovedActivities = this.selectedCopyActivities.filter(x => x.IdstatusValidacion != 4);
    if(validateApprovedActivities.length > 0){
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You can not select activities with status approved'});
    }

    let data = {
      p_Idplananual: 0,
      p_name: 'Implementation Annual Plan Draft_' + this.proyectoSelected?.ProjectName,
      p_idrpnumber: this.RPselected,
      p_description: this.description,
      p_Observaciones: '',
      p_status: 1,
      p_idprojects: this.proyectoSelected?.idprojects,
      activities: this.selectedCopyActivities
    }
    
    /** GENERAREMOS EL RESTO DE LA FUNCIÓN */
    this._implementacionService.setPlanAnnual(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        if(resp.idPlanAnnual){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Activity changed successfully!'});
          this.hideConfirmVisible();
          this.disablePlanButton = false;
          this.router.navigate(['/AnnualPlan-preview', resp.idPlanAnnual])
        } else {
          this.hideConfirmVisible();
          this.disablePlanButton = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There is already an approved plan for this RP'});
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: 'Some was wrong, try again'});
      }
    })
  }

  calculateTotal(idrp: any) {
    this.totalCost = 0;
    if(idrp){
        let ArrayActivities = this.activities.filter(x=>x.idrpnumber == idrp);
        for (let row of ArrayActivities) {
          this.totalCost += row.EstimadoUSD;
        }
    } else {
      for (let row of this.activities) {
        this.totalCost += row.EstimadoUSD;
      }
    }
  }

  downloadExcelDraft(){
    if(!this.RPselected){
      return this.messageService.add({ severity: 'error', summary: 'Select RP', detail: 'Please, select RP especific to generate draft'});
    }
    this._implementacionService.downloadExcelDraft(this.proyectoSelected?.idprojects, this.RPselected, this.proyectoSelected?.ProjectName, this.token?.access_token)
  }
  

  copyFilteredActivities(): any[] {
    if (!this.RPselected) return [...this.activities];

    return this.activities
      .map(activity => {
        const filteredSubs = activity.subaccounts.filter((sub: any) => sub.idrpnumber === this.RPselected);
        return filteredSubs.length > 0
          ? { ...activity, subaccounts: filteredSubs }
          : null;
      })
      .filter(a => a !== null);
  }


  getFilteredActivities(rpSelected?: string, searchText?: string): any[] {
    const text = searchText?.toLowerCase().trim() || '';

    return this.activities
      .map(activity => {
        let filteredSubs = activity.subaccounts;
        if (rpSelected) {
          filteredSubs = filteredSubs.filter((sub: any) => sub.idrpnumber === rpSelected);
        }

        if (filteredSubs.length === 0 && rpSelected) {
          return null;
        }

        if (text) {
          const subsByText = filteredSubs.filter((sub: any) =>
            sub.capexsubaccount?.toLowerCase().includes(text) ||
            sub.Actividad?.toLowerCase().includes(text) ||
            sub.opexsubaccount?.toLowerCase().includes(text) ||
            sub.statusvalidacion?.toLowerCase().includes(text)
          );

          const matchesActivity =
            activity.capexsubaccount?.toLowerCase().includes(text) ||
            activity.Actividad?.toLowerCase().includes(text) ||
            activity.opexsubaccount?.toLowerCase().includes(text) ||
            activity.statusvalidacion?.toLowerCase().includes(text);

          if (!matchesActivity && subsByText.length === 0) {
            return null;
          }

          return { ...activity, subaccounts: matchesActivity ? filteredSubs : subsByText };
        }

        // 👇 Si no hay texto, simplemente regresa lo filtrado por RP
        return { ...activity, subaccounts: filteredSubs };
      })
      .filter(a => a !== null);
  }

  getTotalActivities(){
    const totalGeneral = this.filteredActivities.reduce((acc, activity) => {
    const subtotal = activity.subaccounts.reduce((sum: any, sub: any) => sum + sub.EstimadoUSD, 0);
      return acc + subtotal;
    }, 0);

    return totalGeneral;
  }

  onSearchChange() {
    this.filteredActivities = this.getFilteredActivities(this.RPselected, this.searchText);
  }

  selectedAll: boolean = false;

  onHeaderCheckboxToggle(event: any) {
    this.selectedAll = !this.selectedAll;
    if(this.selectedAll){
      this.selectedCopyActivities = this.filteredActivities.flatMap(a => a.subaccounts);
    } else {
      this.selectedCopyActivities = [];
    }

  }

  ngDoCheck() {
    // Sincroniza el estado visual del checkbox del header
    const allSubs = this.activities.flatMap(a => a.subaccounts);
    // this.selectedAll = allSubs.length > 0 && this.selectedCopyActivities.length === allSubs.length;
  }

  enableRPdropdown(){
    this.isActiveRPfield = !this.isActiveRPfield
    if(this.isActiveRPfield){
      this.activityForm.get('p_idrpnumber')?.enable()
    } else {
      this.activityForm.get('p_idrpnumber')?.disable()
    }
  }

  sumTotalsByActivities(Activities: any[]){
    let sum = 0
    for(let activity of Activities){
      sum += activity.EstimadoUSD
    }
    return sum
  }

  isValidStatus(status: string = '') {
    switch (status) {
      case 'Approved':
        return 'm-2 status-finished';
      case 'Pending':
        return 'm-2 status-pending';
      case 'Correction':
        return 'm-2 status-correction';
      case 'Evaluation':
        return 'm-2 status-evaluation';
      case 'Canceled':
        return 'm-2 status-canceled';
      default:
        return ''; // sin clase si no hay match
    }
  }

}
