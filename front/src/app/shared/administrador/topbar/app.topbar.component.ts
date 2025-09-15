import { Projects } from '../../../interfaces/Portafolio/NewProject/Newproject.interface';
import { FieldsetModule } from 'primeng/fieldset';
import { ProjectUsuarioService } from './../../../services/newProject/admin.service';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';
import { AppSidebarComponent } from '../sidebar/app.sidebar.component';
import { Router } from '@angular/router';
import { NodeService } from 'src/app/services/node.service';
import { CtPendientes } from 'src/app/services/Notify/ctPendientes.service';
import { CtNofifyProjectUpdate } from 'src/app/interfaces/Catalogos/Request/Ctnotify.interface';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { MenuItem } from 'primeng/api';
// import { AppSidebarComponent } from '../../../layout/app.sidebar.component';

interface Prueba {
    name: string;
    code: string;
}

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent {
//dropdaw con buscador
    items: MenuItem[] = [];
    countries!: Prueba[];
    selectedCountry!: any;

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('searchinput') searchInput!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    searchActive: boolean = false;
    Projects !: any[];
    selectedProjects: any;
    ctNofifyProjectUpdate!: any [];
    notificationsCount = 0;
    token: any;
    notificaciones!: any[];

    
    buttonvisible!: boolean;


    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
      this.checkScreenSize();
    }
  
    private checkScreenSize(): void {
      if(window.innerWidth > 800) this.buttonvisible = true;
      else this.buttonvisible = false;
    }
  
    constructor(public layoutService: LayoutService, public el: ElementRef, 
        private ctPendientes: CtPendientes,
        private router: Router, private projectUsuarioService: ProjectUsuarioService,
        private _authGuardService: authGuardService,
        private readonly serviceObsProject$: ObservableService,

      ) { 
        this.checkScreenSize()
        this.token = this._authGuardService.getToken()
        this.getProjects();
        this.observaProjectSelected();
        this.Fnnotifypendientes();
    }

    observaProjectSelected() {
      /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
      this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
        if(project){
          this.selectedCountry = this.Projects.find(x => x.idprojects == project.idprojects);
        } else {

        }
      });
    }

    public getProjects(){
      let savedValue = sessionStorage.getItem('selectedOption') || '';
      this.projectUsuarioService.getProjectsNew(this.token.access_token).subscribe((files: any) => {
          this.Projects = files.projects; // Asignar los archivos al array Projects cuando se complete la operación
          if(savedValue){
            this.selectedCountry = this.Projects.find(x => x.ProjectName == savedValue);
            this.onProjectSelected(this.selectedCountry)
          }
      });
    }

    activateSearch() {
        this.searchActive = true;
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 100);
    }

    deactivateSearch() {
        this.searchActive = false;
    }
    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }
    
    onSidebarButtonClick() {
        this.layoutService.showSidebar();
    }
    logOut(){
        sessionStorage.clear()
        this.serviceObsProject$.setProject({
          idprojects      : 0 ,
          Folio_project   : '', 
          ProjectName     : '', 
          Aggregation     : 0, 
          idAggregation: 0,
          Counterpart     : '', 
          NucleoAgrario   : '', 
          TipoPropiedad   : '', 
          Municipio       : '', 
          Estado          : '', 
          Status           : 0,
          Id_ProyectoCAR  : 0
      });

        this.router.navigate(['/']);
      }

      ngOnInit() {
        //dropdaw con buscador
        this.countries = [
            { name: 'Australia', code: 'AU' },
            { name: 'Brazil', code: 'BR' },
            { name: 'China', code: 'CN' },
            { name: 'Egypt', code: 'EG' },
            { name: 'France', code: 'FR' },
            { name: 'Germany', code: 'DE' },
            { name: 'India', code: 'IN' },
            { name: 'Japan', code: 'JP' },
            { name: 'Spain', code: 'ES' },
            { name: 'United States', code: 'US' }
        ];


    }
    redirectToNotifications() {
        this.router.navigate(['/NotifyProject']);
      }
      
      Fnnotifypendientes(): void {
        this.ctPendientes.FnCtpendientes(this.token.access_token)
          .subscribe(
            (response: any) => {
              if (response) {
                this.ctNofifyProjectUpdate = response.ctNotify;
                if(this.ctNofifyProjectUpdate.length == 0){
                  this.items.push({
                    label: 'No hay notificaciones nuevas',
                  })
                } else {
                  this.items = []
                  for(let notifies of this.ctNofifyProjectUpdate){
                    this.items.push({
                      label: notifies.ProjectName,
                      routerLink: '/NotifyProject'
                    })
                  }
                }
                this.notificationsCount = this.ctNofifyProjectUpdate.length;
                // Map the list of notifications to a new list of notificaciones for the p-splitButton
                this.notificaciones[0].notificacion = this.ctNofifyProjectUpdate.map((notify) => {
                  return {
                    label: notify.ProjectName || 'Unknown',
                    icon: 'pi pi-bell',
                    command: () => this.FnshowNotify(notify)
                  }
                });
    
                
              }
            },
            error => {
              console.error("Error al obtener pendientes notificaciones:", error);
            }
          );
    }
    FnshowNotify(notify: CtNofifyProjectUpdate): void {
        // Aquí puedes definir qué hacer cuando se selecciona una notificación
    
        // Por ejemplo, podrías mostrar los detalles de la notificación en un cuadro de diálogo o realizar alguna otra acción.
        // También puedes navegar a una página específica o realizar una acción basada en los datos de la notificación.
    }

    // this.serviceObsProject$.setProject(project);
    onProjectSelected(project: Projects){
      this.serviceObsProject$.setProject(project);
      sessionStorage.setItem('selectedOption', project?.ProjectName);
    }

    supportAirtable(){
      window.open('https://airtable.com/appAneQC940ueXitu/shrgVTXKDUHA84FE8', '_blank');
    }

    supportHelpedsk(){
      window.open('https://apps.powerapps.com/play/e/default-443ce54c-24bb-4b32-8795-1beae5de4545/a/9eac15de-9548-4a3c-87a0-40c1d5719615?tenantId=443ce54c-24bb-4b32-8795-1beae5de4545&hint=20155b03-fdbb-4b1a-83a5-e6601cb95297&source=sharebutton&sourcetime=1742493470149', '_blank');
    }
    
}