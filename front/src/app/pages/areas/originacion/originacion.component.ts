import { Component,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
import { ProjectUsuarioService } from 'src/app/services/newProject/admin.service';
import { UsuarioService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaComponent } from 'src/app/util/alerta.component';
import { Respuesta } from 'src/app/interfaces/Respuesta.interface';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { Originationtwo } from 'src/app/interfaces/ComponentOrigination/Origination.interface';
import { CatalogosService } from 'src/app/services/catalogs/catalogs.service';
import { regex } from 'src/app/util/regex';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { OriginacionService } from 'src/app/services/originacion/originacion.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-originacion',
  templateUrl: './originacion.component.html',
  styleUrls: ['./originacion.component.scss']
})

export class NewOrigination {
  token: any;
  permissions: any[] = []
  enablebutton: boolean = false;
  recoInfo!:FormGroup; 

  ctLandTernure!: any[];
  ctimplpar!: any[];
  ctprojecttype!: any[];
  ctprogram!: any[];
  ctleadorigi!: any[];
  ctpromoter!: any[];
  ctstatusorigin!: any[];
  ctapprovedbuyer!: any[];
  ctprospecpriority!: any[];
  ctprojectalive!: any[];
  booleanoActivo: boolean = false;
 
  sidebarVisible: boolean = false;
  formValidate!: boolean;

  toggleFormulario() {
    this.booleanoActivo = !this.booleanoActivo;
    if (this.booleanoActivo) {
      this.recoInfo.disable();
    } else {
      this.recoInfo.enable();
      // if(this.isOriginacionSelected) this.recoInfo.get('ERPAApproval')?.disable();
      // else this.recoInfo.get('ERPAApproval')?.enable();
    }
  }

  selectedProject$ = this.serviceObsProject$.selectedProject$;
  proyectoSelected: Projects | null = null;

  isOriginacionSelected!: Originationtwo;
  buttonlabel: string = "Create";
  disableERPA: boolean = false;
  minDate!: Date;
  minDateERPA!: Date;

  constructor(private productService: ProductService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private projectusuarioservice : ProjectUsuarioService, 
    private router                : Router, 
    private usuarioservice        : UsuarioService,
    public _authGuardService: authGuardService,
    private catalogoService: CatalogosService,
    private originacionService: OriginacionService,
    private readonly serviceObsProject$: ObservableService,
    private datepipe: DatePipe) {

      this.token = this._authGuardService.getToken();

      this.getctimplpar();
      this.getctLandtenure();
      this.getctprojecttype();
      this.getctprogram();
      this.getctleadsoriginacion();
      this.getoripromoter();
      this.getstatusorigi();
      this.getctapprovedbuyer();
      this.getctprospecpriority();
      this.getctprojectalive();

      this.formulario();
      /** para saber si ya seleccioné un proyecto */
      this.minDate = new Date();
      const fechaMaxima = new Date();
      fechaMaxima.setMonth(fechaMaxima.getMonth() - 3);
      this.minDateERPA = fechaMaxima;
      this.observaProjectSelected();

     }

  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      if(project){
        this.proyectoSelected = project;
        this.getOriginacionById();
      } else {
      }
    });
  }

  getOriginacionById(){
    this.originacionService.getOriginacion(this.proyectoSelected?.idprojects, this.token?.access_token).subscribe((response: any) => {
      if(response.valido == 1){
        this.buttonlabel = "Update";
        this.isOriginacionSelected = response.origination;
        this.onLoadOriginationSelected();
      } else {
        this.buttonlabel = "Create";
      }
    })
  }

  onLoadOriginationSelected(){
    this.recoInfo.patchValue({
      ProjectCounterpart: this.isOriginacionSelected.ProjectCounterpart,
      ImplementationPartner: this.isOriginacionSelected.idimplemenp, //this.ctimplpar.find(item => item.ImplementationPartner == this.isOriginacionSelected.ImplementationPartner),
      LandTenureType: this.isOriginacionSelected.idlandtenure,//this.ctLandTernure.find(item => item.LandTenureType == this.isOriginacionSelected.LandTenureType),
      ProjectType: this.isOriginacionSelected.idprojecttype,//this.ctprojecttype.find(item => item.ProjecType == this.isOriginacionSelected.ProjecType),
      Program: this.isOriginacionSelected.idprogram,//this.ctprogram.find(item => item.Program == this.isOriginacionSelected.Program),
      OriginationLead: this.isOriginacionSelected.idleadoriginacion,//this.ctleadorigi.find(item => item.Nombre == this.isOriginacionSelected.Nombre),
      OriginationPromoter: this.isOriginacionSelected.idoriginationpromoter,//this.ctpromoter.find(item => item.OriginationPromoter == this.isOriginacionSelected.OriginationPromoter),
      OriginationStatus: this.isOriginacionSelected.idoriginationstatus,//this.ctstatusorigin.find(item => item.OriginationStatus == this.isOriginacionSelected.OriginationStatus),
      ApprovedBuyer: this.isOriginacionSelected.idapprovedbuyer,//this.ctapprovedbuyer.find(x=>x.ApprovedBuyercol == this.isOriginacionSelected.ApprovedBuyercol),
      ProjectApproval: this.datepipe.transform(this.isOriginacionSelected.ProjectApproval,'yyyy-MM-dd'), // -- dudas
      ERPAApproval: this.isOriginacionSelected.ERPAApproval,
      PercentageMktPrice: this.isOriginacionSelected.PercentageMktPrice,
      ProspectPriority: this.isOriginacionSelected.idprospectpriority,//this.ctprospecpriority.find(item => item.ProspecPriority == this.isOriginacionSelected.ProspecPriority),
      ProjectAlive: this.isOriginacionSelected.idprojectalive,//this.ctprojectalive.find(item => item.ProjectAlive == this.isOriginacionSelected.ProjectAlive),
      ExpectedERPASigningDate: this.datepipe.transform(this.isOriginacionSelected.ExpectedERPAAsigningDate, 'yyyy-MM-dd'), // dudas --
      NotesOriginationTeam: this.isOriginacionSelected.NotesOrginationTeam,
      NotesChanges: this.isOriginacionSelected.NotesChanges
    });

    if(this.isOriginacionSelected){
      this.disableERPA = true;
    }
  }

  formulario(){
    this.recoInfo = this.fb.group({
      ProjectCounterpart :['',  [Validators.required, Validators.pattern(regex.withoutMoretwoSpaces)]],
      ImplementationPartner: ['',[Validators.required]],
      LandTenureType: ['',[Validators.required]],
      ProjectType: ['', [Validators.required]],
      Program: ['', [Validators.required]],
      TransactionType: [''],
      OriginationLead: ['', [Validators.required]],
      OriginationPromoter: ['', [Validators.required]],
      OriginationStatus: ['', [Validators.required]],
      ApprovedBuyer: ['', [Validators.required]],
      ProjectApproval: [''],
      ERPAApproval: [''],
      PercentageMktPrice: ['', [Validators.required]],
      ProspectPriority: ['', [Validators.required]],
      ProjectAlive: ['', [Validators.required]],
      ExpectedERPASigningDate: [''],
      ExpectedLOISigningDate: [],
      NotesOriginationTeam: [''],
      NotesChanges: [''],
    });

    this.toggleFormulario();
    this.validatePermissions();
  }


  validatePermissions(){
    this.permissions = this.token?.permissions;
    if(!this.permissions.find(x=>x.idareas == 1 || x.idareas == 4|| x.idareas == 9)) this.enablebutton = true;
  }

  getctimplpar(){
    this.catalogoService.getctimplpar(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctimplpar = response.result;
      } else {
        console.error("La propiedad 'ctLand' no está presente en los datos recibidos.");
      }
    },
    error => {
      console.error("Error al obtener ctLand:", error);
    });
  }

  getctLandtenure(){
    this.catalogoService.getctLandtenure(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctLandTernure = response.result;
      } else {
        console.error("La propiedad 'ctLand' no está presente en los datos recibidos.");
      }
    },
    error => {
      console.error("Error al obtener ctLand:", error);
    });
  }

  getctprojecttype(){
    this.catalogoService.getctprojecttype(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctprojecttype = response.result;
      } else {
        console.error("La propiedad 'PROJECTTYPE' no está presente en los datos recibidos.");
      }
    },
    error => {
      console.error("Error al obtener PROJECTTYPE:", error);
    });
  }

  getctprogram(){
    this.catalogoService.getctprogram(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctprogram = response.result;
      } else {
        console.error("La propiedad 'valueprogram' no está presente en los datos recibidos.");
      }
    },
    error => {
      console.error("Error al obtener valueprogram:", error);
    });
  }

  getctleadsoriginacion(){
    this.catalogoService.getctleadsoriginacion(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctleadorigi = response.result;
      } else {
        console.error("La propiedad 'valueLeadOri' no está presente en los datos recibidos.");
      }
    },
    error => {
      console.error("Error al obtener valueLeadOri:", error);
    });
  }

  getoripromoter(){
    this.catalogoService.getoripromoter(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctpromoter = response.result;
      } else {
        console.error("La propiedad 'valueoripromoter' no está presente en los datos recibidos.");
      }
    },
    error => {
      console.error("Error al obtener valueoripromoter:", error);
    });
  }

  getstatusorigi(){
    this.catalogoService.getstatusorigi(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctstatusorigin = response.result;
      } else {
        console.error("La propiedad 'valueOrigiStatus' no está presente en los datos recibidos.");
      }
    },
    error => {
      console.error("Error al obtener valueOrigiStatus:", error);
    });
  }

  getctapprovedbuyer(){
    this.catalogoService.getctapprovedbuyer(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctapprovedbuyer = response.result;
      } else {
        console.error("La propiedad 'valueApprovedBuyer' no está presente en los datos recibidos.");
      }
    },
    error => {
      console.error("Error al obtener valueApprovedBuyer:", error);
    });
  }

  getctprospecpriority(){
    this.catalogoService.getctprospecpriority(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctprospecpriority = response.result;
      } else {
        console.error("La propiedad 'valueProspecPriority' no está presente en los datos recibidos.");
      }
    },
    error => {
      console.error("Error al obtener valueProspecPriority:", error);
    });
  }

  getctprojectalive(){
    this.catalogoService.getctprojectalive(this.token?.access_token).subscribe((response: any) => {
      if (response.result && Array.isArray(response.result)) {
        this.ctprojectalive = response.result;
      } else {
        console.error("La propiedad 'valueprojectalive' no está presente en los datos recibidos.");
      }
    },
    error => {
      console.error("Error al obtener valueprojectalive:", error);
    });
  }


  addNewOrigintation(){
    if(!this.recoInfo.valid){
      this.formValidate = true;
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'All fields required' })
    }
    this.formValidate = false;
    let dataSend = {
      ProjectID: this.proyectoSelected?.idprojects,
      ProjectCounterpart: this.recoInfo.value.ProjectCounterpart,
      ImplementationPartner: this.recoInfo.value.ImplementationPartner,
      LandTenureType: this.recoInfo.value.LandTenureType,
      ProjectType: this.recoInfo.value.ProjectType,
      Program: this.recoInfo.value.Program,
      OriginationLead: this.recoInfo.value.OriginationLead,
      OriginationPromoter: this.recoInfo.value.OriginationPromoter,
      OriginationStatus: this.recoInfo.value.OriginationStatus,
      ApprovedBuyer: this.recoInfo.value.ApprovedBuyer,
      ProjectApproval: this.recoInfo.value.ProjectApproval,
      ERPAApproval: this.recoInfo.value.ERPAApproval,
      PercentageMktPrice: this.recoInfo.value.PercentageMktPrice, 
      ProspectPriority: this.recoInfo.value.ProspectPriority,
      ProjectAlive: this.recoInfo.value.ProjectAlive,
      ExpectedERPASigningDate: this.recoInfo.value.ExpectedERPASigningDate,
      ExpectedLOISigningDate: this.recoInfo.value.ExpectedLOISigningDate,
      NotesOriginationTeam: this.recoInfo.value.NotesOriginationTeam,
      NotesChanges: this.recoInfo.value.NotesChanges,
    }

    this.originacionService.setOriginacion(dataSend, this.token?.access_token).subscribe(response => {
      if(response.message == "Se guardó correctamente") {
        this.messageService.add({ severity: 'success', summary: 'Save success!', detail: "Save succesfully!" });
        this.getOriginacionById();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
      }
    })
  }

  updateOrigination(){
    if(!this.recoInfo.valid){
      this.formValidate = true;

      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'All fields required' })
    }
    this.formValidate = false;

    let dataSend = {
      IdOriginacion: this.isOriginacionSelected?.IdOriginacion ,
      ProjectID: this.proyectoSelected?.idprojects,
      ProjectCounterpart: this.recoInfo.value.ProjectCounterpart,
      ImplementationPartner: this.recoInfo.value.ImplementationPartner,
      LandTenureType: this.recoInfo.value.LandTenureType,
      ProjectType: this.recoInfo.value.ProjectType,
      Program: this.recoInfo.value.Program,
      OriginationLead: this.recoInfo.value.OriginationLead,
      OriginationPromoter: this.recoInfo.value.OriginationPromoter,
      OriginationStatus: this.recoInfo.value.OriginationStatus,
      ApprovedBuyer: this.recoInfo.value.ApprovedBuyer,
      ProjectApproval: this.recoInfo.value.ProjectApproval,
      ERPAApproval: this.recoInfo.value.ERPAApproval,
      PercentageMktPrice: this.recoInfo.value.PercentageMktPrice, 
      ProspectPriority: this.recoInfo.value.ProspectPriority,
      ProjectAlive: this.recoInfo.value.ProjectAlive,
      ExpectedERPASigningDate: this.recoInfo.value.ExpectedERPASigningDate,
      ExpectedLOISigningDate: this.recoInfo.value.ExpectedLOISigningDate,
      NotesOriginationTeam: this.recoInfo.value.NotesOriginationTeam,
      NotesChanges: this.recoInfo.value.NotesChanges,
    }

    this.originacionService.updateOriginacion(dataSend, this.proyectoSelected?.idprojects, this.token?.access_token).subscribe(response => {
      if(response.message == "Se guardó correctamente") {
        this.messageService.add({ severity: 'success', summary: 'Save success!', detail: "Save succesfully!" });
        this.getOriginacionById();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
      }
    })
  }
  
}