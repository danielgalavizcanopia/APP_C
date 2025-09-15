import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { BitacoraService } from 'src/app/services/Bitacora/Bitacora.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { Clipboard } from '@angular/cdk/clipboard';
// import { ExcelService } from 'src/app/services/excelExports/excel.service';
import { Table } from 'primeng/table';
import { BitacoraCatalogsService } from 'src/app/services/Bitacora/bitacora-catalogs.service';
import { UsuarioService } from 'src/app/services/login.service';
import { Users } from 'src/app/interfaces/Users/User.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bitacora-proyectos',
  templateUrl: './bitacora-proyectos.component.html',
  styleUrls: ['./bitacora-proyectos.component.scss']
})
export class BitacoraProyectosComponent {
  @ViewChild('dt1') dt1!: Table;
  data!: Event;

  handleGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dt1.filterGlobal(input.value, 'contains');
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  HitosProcess: any[] = [];
  Users: Users[] = [];
  User: any;
  Milestone: any;
  StartDate: any;
  EndDate: any;
  LogTitle: any;
  Folio: any;
  loading: boolean = false;
  token: any;
  proyectoSelected: Projects | null = null;
  bitacora!: any[];
  evidencesByLog!: any[];

  visible!: boolean;
  showDialog() {
      this.visible = true;
  }
  
  onHideDialog(){
      this.visible = false;
  }
  sidebarVisible: boolean = false;

  clear(table: Table) {
    table.clear();
  }

  visibleFilter: boolean = false;

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
    readonly serviceObsProject$: ObservableService, public _authGuardService: authGuardService, private bitacoraService: BitacoraService, private _clipboard: Clipboard,
    private bitacoraCatalogsService: BitacoraCatalogsService,
    private usuarioservice : UsuarioService, private datepipe: DatePipe,
    
) {
        this.token = this._authGuardService.getToken();
        this.observaProjectSelected();
        this.getHitosProcess();
        this.getUsers();
    }

    observaProjectSelected() {
        /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
        this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
          if(project){
            this.proyectoSelected = project;
            this.getLinkEvidenciasByBitacora();
          } else {
    
          }
        });
      }


    getLinkEvidenciasByBitacora(){
      let data = {
        fechaInicio: this.datepipe.transform(this.StartDate, 'yyyy-MM-dd'),
        fechaFin: this.datepipe.transform(this.EndDate, 'yyyy-MM-dd'),
        IDHitoProceso: this.Milestone,
        blogTitle: this.LogTitle,
        Foliobitacora: this.Folio,
        IDUser: this.User,
        idprojects: this.proyectoSelected?.idprojects,
      }
      this.loading = true;
        this.bitacoraService.getLinkEvidenciasByBitacora(data, this.token?.access_token).subscribe((resp: any) => {
            if(resp.valido == 1){
                this.loading = false;
                this.evidencesByLog = resp.result;
            }
        });
    }

    copyLink(link: string){
        this._clipboard.copy(link)
    }

    openLinkEvidence(url: string) {
      window.open(url , '_blank');
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

    getUsers(){
      this.usuarioservice.getUsers(this.token?.access_token).subscribe((resp: any) => {
          if(resp.valido == 1){
            this.Users = resp.result;
          }
      });
    }

    exportToExcel() {
      let data = {
        fechaInicio: this.datepipe.transform(this.StartDate, 'yyyy-MM-dd'),
        fechaFin: this.datepipe.transform(this.EndDate, 'yyyy-MM-dd'),
        IDHitoProceso: this.Milestone,
        blogTitle: this.LogTitle,
        Foliobitacora: this.Folio,
        IDUser: this.User,
        idprojects: this.proyectoSelected?.idprojects,
      }
      this.bitacoraService.downloadExcel(data, this.proyectoSelected?.ProjectName +'ProjectLog', this.token?.access_token)
    }

    exportEvidencesToExcel() {
      let data = {
        fechaInicio: this.datepipe.transform(this.StartDate, 'yyyy-MM-dd'),
        fechaFin: this.datepipe.transform(this.EndDate, 'yyyy-MM-dd'),
        IDHitoProceso: this.Milestone,
        blogTitle: this.LogTitle,
        Foliobitacora: this.Folio,
        IDUser: this.User,
        idprojects: this.proyectoSelected?.idprojects,
      }
      this.bitacoraService.downloadExcelEvidences(data, this.proyectoSelected?.ProjectName +'ProjectLog', this.token?.access_token)
    }

    exportToWord() {
      let data = {
        fechaInicio: this.datepipe.transform(this.StartDate, 'yyyy-MM-dd'),
        fechaFin: this.datepipe.transform(this.EndDate, 'yyyy-MM-dd'),
        IDHitoProceso: this.Milestone,
        blogTitle: this.LogTitle,
        Foliobitacora: this.Folio,
        IDUser: this.User,
        idprojects: this.proyectoSelected?.idprojects,
      }
      this.bitacoraService.downloadWord(data, this.proyectoSelected?.ProjectName +'ProjectLog', this.token?.access_token)
    }

}
