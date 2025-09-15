import { OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { ObservableService } from 'src/app/services/Observables/observableProject.service';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit, OnDestroy {
  token: any;
  model: any[] = [];
  proyectoSelected: Projects | null = null;
  menuProject = new Array();
  isSelectedProject: boolean = false;
  selectedProject$ = this.serviceObsProject$.selectedProject$;
  itemSubscription!: Subscription;
  constructor(
    private itemService: ItemService,
    private readonly serviceObsProject$: ObservableService,
    public _authGuardService: authGuardService) {
    this.token = this._authGuardService.getToken();
  } // Inyecta ItemService en el constructor
  ngOnInit() {

    this.menuProjectDefinition()
    // this.obtenMenuProjectDetalle();
    this.observaProjectSelected();
    this.obtenMenu();

    // Recuperar el valor del sessionStorage
    const proyectoString = sessionStorage.getItem("proyectoSelected");
    // Verificar si el valor existe en sessionStorage
    if (proyectoString) {
      // Parsear el valor de sessionStorage a un objeto Projects
      this.proyectoSelected = JSON.parse(proyectoString);
    }

  }
  ngOnDestroy() {
    // No olvides desuscribirte para evitar pérdidas de memoria
    if (this.itemSubscription) {
      this.itemSubscription.unsubscribe();
    }
  }
  observaProjectSelected() {
    /*** Este sirve para saber que proyecto ha sido seleccionado y se copia este bloque */
    this.serviceObsProject$.selectedProject$.subscribe((project: Projects) => {
      this.proyectoSelected = project;

      if (this.isSelectedProject == false) {
        // this.model[0].items.push(this.obtenMenuProjectDetalle()[0]);

        // Encontrar el objeto con la etiqueta 'Proyectos' y agregarle la propiedad 'item'
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

  menuProjectDefinition() {
    this.menuProject = [
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
            items: [
              {
                label: 'Annual Plan Activities',
                icon: 'pi pi-briefcase',
                routerLink: ['/Activities']
              },
              {
                label: 'Manage Annual Plan',
                icon: 'pi pi-book',
                routerLink: ['/HistoryDrafts']
              },
            ]
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
              //   label: 'Reports',
              //   icon: 'pi pi-file',
              //   routerLink: ['Reports']
              // },
              {
                label: 'Project Log',
                icon: 'pi pi-file',
                routerLink: ['/Project-log']
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
            icon: 'pi pi-book',
          },
        ]
      },
      {
        label: 'REGISTRATION/ISSUANCE',
        icon: 'pi pi-fw pi-align-left',
        items: [
          {
            label: 'Execution',
            icon: 'pi pi-book',
          },
        ]
      },
      {
        label: 'SETTLEMENT',
        icon: 'pi pi-fw pi-map',
        items: [
          {
            label: 'Execution',
            icon: 'pi pi-book',
            routerLink: ["/settlement"]
          },
        ]
      },
    ];

    return this.menuProject;




  }

  obtenMenuProjectDetalle() {
    return [
      {
        label: 'Project Detail',
        icon: 'pi pi-filter',
      }];
  }

  obtenMenu() {
    this.model = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: ["/home"],
      },
      {
        label: 'Projects',
        icon: 'pi pi-folder',
        routerLink: ["/new-proyect"],

      },
      {
        label: 'Support',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Support Airtable',
            icon: 'pi pi-question-circle',
            url: 'https://airtable.com/appAneQC940ueXitu/shrgVTXKDUHA84FE8',
            target: '_blank'
          },
          {
            label: 'Support HelpDesk',
            icon: 'pi pi-question-circle',
            url: 'https://apps.powerapps.com/play/e/default-443ce54c-24bb-4b32-8795-1beae5de4545/a/9eac15de-9548-4a3c-87a0-40c1d5719615?tenantId=443ce54c-24bb-4b32-8795-1beae5de4545&hint=20155b03-fdbb-4b1a-83a5-e6601cb95297&source=sharebutton&sourcetime=1742493470149',
            target: '_blank'
          },
        ]
      }

    ];

    if (this.token?.positionId == 1 || this.token?.positionId == 9 || this.token?.positionId == 3) {
      this.model.push(
        {
          label: 'Tools',
          icon: 'pi pi-wrench',
          items: [
            {
              label: 'Capex Accounts',
              icon: 'pi pi-wallet',
              routerLink: ["/capex-accounts"]
            },
            {
              label: 'Opex Accounts',
              icon: 'pi pi-wallet',
              routerLink: ["/opex-accounts"]
            },
            {
              label: 'Project Log Catalogs',
              icon: 'pi pi-fw pi-cog',
              routerLink: ["/bitacora-catalogs"]
            },
            {
              label: 'SOP configuration',
              icon: 'pi pi-fw pi-cog',
              routerLink: ["/SOP-config"]
            },
            {
              label: 'Users',
              icon: 'pi pi-fw pi-users',
              routerLink: ["/Users"]
            },
            {
              label: 'Activities',
              icon: 'pi pi-fw pi-file-edit',
              routerLink: ["/ActivitiesCatalog"]
            }

          ],
        }
      )
    }
  }

}
