import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { InicioComponent } from './pages/administrador/inicio/inicio.component';
import { ForgotPasswordComponent } from './pages/publico/forgotpassword/forgotpassword.component';
import { LoginComponent } from './pages/publico/login/login.component';
import { NewPasswordComponent } from './pages/publico/newpassword/newpassword.component';
import { RegisterComponent } from './pages/publico/register/register.component';
import { NewProyectComponent } from './pages/administrador/new-proyect/new-proyect.component';
import { NewOrigination } from './pages/areas/originacion/originacion.component';
import { ComponenSigComponent } from './pages/modulos-areas/sig/componen-sig/componen-sig.component';
import { AreaProyectoComponent } from './pages/modulos-areas/sig/area-proyecto/area-proyecto.component';
import { NewprojectUpdateComponent } from './pages/administrador/newproject-update/newproject-update.component';
import { MonitorProyectosComponent } from './pages/areas/monitor-avances/monitor-proyectos/monitor-proyectos.component';
import { authGuardService } from './services/Secret/auth-guard.service';
import { MRVComponent } from './pages/areas/MRV/mrv.component';
import { MonitorAvancesComponent } from './pages/areas/monitor-avances/monitor-avances.component';
import { LegalComponent } from './pages/areas/legal/legal.component';
import { SalvaguardasComponent } from './pages/areas/salvaguardas/salvaguardas.component';
import { BitacoraProyectosComponent } from './pages/reports/DashboardReports/bitacora-proyectos/bitacora-proyectos.component';
import { BitacoraFormComponent } from './pages/reports/DashboardReports/bitacora-proyectos/bitacora-form/bitacora-form.component';
import { ReportingPeriodsComponent } from './pages/reports/reporting-periods/reporting-periods.component';
import { ReportingPeriodsFormComponent } from './pages/reports/reporting-periods/reporting-periods-form/reporting-periods-form.component';
import { CarbonEquivalentComponent } from './pages/costs/carbon-equivalent/carbon-equivalent.component';
import { CapexAccountsComponent } from './pages/config/capex-accounts/capex-accounts.component';
import { OpexAccountsComponent } from './pages/config/opex-accounts/opex-accounts.component';
import { CapexSubaccountsComponent } from './pages/config/capex-accounts/capex-subaccounts/capex-subaccounts.component';
import { OpexSubaccountsComponent } from './pages/config/opex-accounts/opex-subaccounts/opex-subaccounts.component';
import { DesarrolloComponent } from './pages/areas/desarrollo/desarrollo.component';
import { PermissionGuard } from './services/Secret/permissions-guard.service';
import { SummaryCostsComponent } from './pages/costs/summary-costs/summary-costs.component';
import { bitacoraCtComponent } from './pages/config/bitacoraCt/bitacoraCt.component';
import { ActivitiesSummaryComponent } from './pages/areas/activities-summary/activities-summary.component';
import { BudgetsComponent } from './pages/management/budgets/budgets.component';
import { BudgetpreviewComponent } from './pages/management/budgetpreview/budgetpreview.component';
import { HistoryAnnualPlansComponent } from './pages/management/history-annual-plans/history-annual-plans.component';
import { SOPComponent } from './pages/config/sop/sop.component';
import { TabplanComponent } from './pages/management/tabplan/tabplan.component';
import { UsuariosComponent } from './pages/config/Usuarios/Usuarios.component';
import { SupplierTrackerComponent } from './pages/areas/Monitoring-extern/Supplier-tracker/Supplier-tracker.component';
import { FinancialTrackerComponent } from './pages/areas/Monitoring-extern/Financial-tracker/Financial-tracker.component';
import { AllMonitorsComponent } from './pages/areas/Monitoring-extern/all-monitors/all-monitors.component';
import { ActivitiesCatalogComponent } from './pages/config/activities-catalog/activities-catalog.component';
import { DashboardReportsComponent } from './pages/reports/DashboardReports/DashboardReports.component';
import { Dashboard2Component } from './pages/administrador/dashboard2/dashboard2.component';
import { MarketingComponent } from './pages/commercialisation/marketing/marketing.component';
import { AnnualPlanningComponent } from './pages/management/AnnualPlanning/AnnualPlanning.component';
import { SettlementComponent } from './pages/settlement/settlement.component';

@NgModule({
    imports: [RouterModule.forRoot([
        //conexion landing simple y login consola | carpeta publico
        {
            path: '',
            component: LoginComponent,
        },

        {
            path: 'registro',
            component: RegisterComponent,
        },
        {
            path: 'new-password',
            component: NewPasswordComponent,
        },
        {
            path: 'recuperar',
            component: ForgotPasswordComponent,
        },

        //sistema conexion menu y login shared .ts | carpeta administrador
        {
            path: '', component: AppLayoutComponent,
            children: [
                /** AREAS ROUTES */
                {
                    path: 'home',
                    component: InicioComponent,
                },
                {
                    path: 'new-proyect',
                    component: NewProyectComponent,
                },
                {
                    path: 'NotifyProject',
                    component: NewprojectUpdateComponent,
                },
                {
                    path: 'Development',
                    component: DesarrolloComponent,
                },
                {
                    path: 'DashboardProjectDetail',
                    component: Dashboard2Component
                },
                {
                    path: 'Origination',
                    component: NewOrigination,
                },
                {
                    path: 'Monitor-activities',
                    component: MonitorAvancesComponent
                },
                {
                    path: 'Monitor-activities-create',
                    component: MonitorProyectosComponent
                },
                {
                    path: 'Monitor-activities-edit/:rp/:id',
                    component: MonitorProyectosComponent
                },
                {
                    path: 'Budget-Tracker',
                    component: ActivitiesSummaryComponent
                },
                {
                    path: 'Financial-Monitoring',
                    component: AllMonitorsComponent
                },
                {
                    path: 'SIG',
                    component: ComponenSigComponent,
                },
                {
                    path: 'areadeproyecto',
                    component: AreaProyectoComponent
                },
                {
                    path: 'Safeguard',
                    component: SalvaguardasComponent,
                },
                {
                    path: 'Legal',
                    component: LegalComponent,
                },
                {
                    path: 'MRV',
                    component: MRVComponent,
                },

                /** COSTS ROUTES */
                {
                    path: 'Carbon-equivalent',
                    component: CarbonEquivalentComponent
                },
                {
                    path: 'Summary-Costs',
                    component: SummaryCostsComponent
                },

                /** REPORTS ROUTES */
                {
                    path: 'Reports/:tab',
                    component: DashboardReportsComponent
                },
                {
                    path: 'Project-log',
                    component: BitacoraProyectosComponent
                },
                {
                    path: 'Project-log-create',
                    component: BitacoraFormComponent
                },
                {
                    path: 'Project-log-edit/:id',
                    component: BitacoraFormComponent
                },
                {
                    path: 'Reporting-periods',
                    component: ReportingPeriodsComponent
                },
                {
                    path: 'Reporting-periods-create',
                    component: ReportingPeriodsFormComponent
                },
                {
                    path: 'Reporting-periods-edit/:id',
                    component: ReportingPeriodsFormComponent
                },

                /** MANAGEMENT ROUTES */
                {
                    path: 'AnnualPlanning',
                    component: AnnualPlanningComponent
                },
                {
                    path: 'Activities',
                    component: BudgetsComponent
                },
                {
                    path: 'AnnualPlan-preview/:id',
                    component: BudgetpreviewComponent
                },
                {
                    path: 'HistoryDrafts',
                    component: HistoryAnnualPlansComponent
                },
                {
                    path: 'HistoryPlan/:id',
                    component: TabplanComponent
                },
                {
                    path: 'Marketing',
                    component: MarketingComponent
                },
                /** TOOLS ROUTES */
                {
                    path: 'capex-accounts',
                    component: CapexAccountsComponent
                },
                {
                    path: 'capex-subaccounts',
                    component: CapexSubaccountsComponent
                },
                {
                    path: 'opex-accounts',
                    component: OpexAccountsComponent
                },
                {
                    path: 'opex-subaccounts',
                    component: OpexSubaccountsComponent
                },
                {
                    path: 'bitacora-catalogs',
                    component: bitacoraCtComponent
                },
                {
                    path: 'SOP-config',
                    component: SOPComponent
                },
                {
                    path: 'Users',
                    component: UsuariosComponent
                },
                {
                    path: 'ActivitiesCatalog',
                    component: ActivitiesCatalogComponent
                },
                //menu de settlement
                {
                    path: 'settlement',
                    component: SettlementComponent
}

            ],
            canActivate: [authGuardService]
        }

    ])],
    exports: [RouterModule]
})
export class AppRoutingModule { }
