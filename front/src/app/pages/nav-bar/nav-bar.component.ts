import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';

import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']

})
export class NavBarComponent {

  token: any;
  items!: MenuItem[];
  model: any[] = [];
    proyectoSelected: Projects | null = null;
    menuProject = new Array();
    isSelectedProject: boolean = false;
    selectedProject$ = this.serviceObsProject$.selectedProject$;
    constructor(
      public _authGuardService: authGuardService,
      private readonly serviceObsProject$: ObservableService, ) {
        this.token = this._authGuardService.getToken();
       }
  ngOnInit() {
    this.observaProjectSelected();
    if(this.token?.area == "SILs"){
      this.items = [
        {
          label: 'IMPLEMENTATION',
          icon: 'pi pi-book',
          items: [
            {
              label: 'Annual Planning',
              icon: 'pi pi-desktop',
              routerLink: ['/AnnualPlanning']
              // items: [
              //   {
              //     label: 'Annual Plan'
              //     , icon: 'pi pi-briefcase',
              //     routerLink: ['/AnnualPlanning']
              //   }                  
              // ]
          },
          {
            label: 'Execution & Monitoring',
            icon: 'pi pi-briefcase',
            items: [
              {
                label: 'Activity Monitoring',
                icon: 'pi pi-desktop',
                routerLink: ["/Monitor-activities"]
              },
            ]
          },
          ]
        },
        {
          label: 'REPORTING',
          icon: 'pi pi-fw pi-folder',
          items: [
            {
              label: 'Execution',
              icon: 'pi pi-book',
              items: [
                {
                  label: 'Reporting Periods',
                  icon: 'pi pi-book',
                  routerLink: ['/Reporting-periods']
                },
                // {
                //   label: 'Project Log',
                //   icon: 'pi pi-file',
                //   routerLink: ['/Project-log']
                // },
                {
                  label: 'Project Log',
                  icon: 'pi pi-file',
                  routerLink: ['Reports']
                },
              ]
            },
          ]
        },
      ];
    } else {
      this.items = [
        {
          label: 'DASHBOARD PROJECT DETAILS',
          icon: 'pi pi-chart-bar',
          routerLink: ["/DashboardProjectDetail"]
        },
        {
          label: 'ORIGINATION',
          icon: 'pi pi-globe',
          items: [
            {
              label: 'Origination',
              icon: 'pi pi-arrow-up',
              routerLink: ["/Origination"]
            },
            {
              label: 'Development',
              icon: 'pi pi-chart-line',
              routerLink: ["/Development"]
            },
            {
              label: 'SIG',
              icon: 'pi pi-map',
              routerLink: ["/SIG"]
            },
  
            {
              label: 'Safeguard',
              icon: 'pi pi-shield',
              routerLink: ["/Safeguard"]
            },
            {
              label: 'Legal',
              icon: 'pi pi-folder',
              routerLink: ["/Legal"]
            },
            {
              label: 'MRV',
              icon: 'pi pi-chart-bar',
              routerLink: ["/MRV"]
            },
            {
              label: 'Carbon Equivalent',
              icon: 'pi pi-money-bill',
              routerLink: ["/Carbon-equivalent"]
            },
            // {
            //   label: 'Appendix ERPA',
            //   routerLink: ["/Appendix-ERPA"]
            // },
            {
              label: 'Summary Costs',
              icon: 'pi pi-calculator',
              routerLink: ["/Summary-Costs"]
            }
          ]
        },
        {
          label: 'IMPLEMENTATION',
          icon: 'pi pi-book',
          items: [
            {
                label: 'Strategic Planning',
                icon: 'pi pi-desktop',
            },
            {
              label: 'Annual Planning',
              icon: 'pi pi-desktop',
              routerLink: ['/AnnualPlanning']
              // items: [
              //   {
              //     label: 'Annual Plan'
              //     , icon: 'pi pi-briefcase',
              //     routerLink: ['/AnnualPlanning']
              //   }                  
              // ]
          },
          {
            label: 'Execution & Monitoring',
            icon: 'pi pi-briefcase',
            items: [
              {
                label: 'Activity Monitoring',
                icon: 'pi pi-desktop',
                routerLink: ["/Monitor-activities"]
              },
              {
                label: 'Financial Monitoring',
                icon: 'pi pi-money-bill',
                routerLink: ["/Financial-Monitoring"]
              },
              // {
              //   label: 'Benefits Distribution Tracker',
              //   icon: 'pi pi-desktop',
              //   routerLink: ["/Benefit-Distribution-Tracker"]
              // },
            ]
          },
          {
            label: 'Review',
            icon: 'pi pi-briefcase',
          },
  
          /** PENDIENTES DE REACOMODAR */
            // {
            //   label: 'Estrategic activities',
            //   icon: 'pi pi-desktop',
            //   routerLink: ["/Monitor-proyectos"]
            // },
            // {
            //   label: 'Budget Tracker',
            //   icon: 'pi pi-desktop',
            //   routerLink: ["/Monitor-Activities-Summary"]
            // },
          ]
        },
        {
          label: 'REPORTING',
          icon: 'pi pi-fw pi-folder',
          items: [
            {
              label: 'Execution',
              icon: 'pi pi-book',
              items: [
                {
                  label: 'Reporting Periods',
                  icon: 'pi pi-book',
                  routerLink: ['/Reporting-periods']
                },
                // {
                //   label: 'Project Log',
                //   icon: 'pi pi-file',
                //   routerLink: ['/Project-log']
                // },
                {
                  label: 'Project Log',
                  icon: 'pi pi-file',
                  routerLink: ['Reports/ProjectLog']
                },
              ]
            },
  
  
          ]
        },
        {
            label: 'VERTIFICATION',
            icon: 'pi pi-fw pi-file-edit',
            items: [
              {
                label: 'Planning',
                icon: 'pi pi-book',
              },
              {
                label: 'Execution',
                icon: 'pi pi-briefcase',
              },
            ]
          },
          {
            label: 'REGISTRATION/ISSUANCE',
            icon: 'pi pi-fw pi-align-left',
            items: [
              {
                label: 'Execution',
                icon: 'pi pi-briefcase',
              },
            ]
          },
          {
            label: 'SETTLEMENT',
            icon: 'pi pi-fw pi-map',
            items: [
              {
                label: 'Execution',
                icon: 'pi pi-briefcase',
                routerLink: ["/settlement"]
              },
            ]
          },
          {
            label: 'COMMERCIALISATION',
            icon: 'pi pi-fw pi-map',
            items: [
              {
                label: 'Execution',
                icon: 'pi pi-briefcase',
                items: [
                  {
                    label: 'Marketing',
                    icon: 'pi pi-desktop',
                    routerLink: ["/Marketing"]
                  },
                ]
              },
            ]
          },
      ];
    }
  }
  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
        this.proyectoSelected = project;

        if(this.isSelectedProject == false){
            var proyectosIndex = this.model[0].items.findIndex((item: any) => item.label === 'Proyecto Detalle');
            if (proyectosIndex !== -1) {
                this.model[0].items[proyectosIndex].items = [];
                for (let key in this.menuProject) {
                    this.model[0]?.items[3].items.push(this.menuProject[key]);
                }
            }
            this.isSelectedProject = true;
        }
    })
    /*** TERMINA EL BLOQUE DE  proyecto */
}
}

