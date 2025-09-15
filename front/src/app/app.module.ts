import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';


// PrimeNG Components for demos
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
//import {FullCalendarModule} from '@fullcalendar/angular';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { HttpClientModule } from '@angular/common/http';
import { StyleClassModule } from 'primeng/styleclass';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgotPasswordComponent } from './pages/publico/forgotpassword/forgotpassword.component';
import { LoginComponent } from './pages/publico/login/login.component';
import { NewPasswordComponent } from './pages/publico/newpassword/newpassword.component';
import { RegisterComponent } from './pages/publico/register/register.component';
import { MenuService } from './layout/app.menu.service';
import { CustomerService } from './services/customer.service';
import { NodeService } from './services/node.service';
import { PhotoService } from './services/photo.service';
import { ProductService } from './services/product.service';
import { UtilApiService } from './services/util-api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { authGuardService } from './services/Secret/auth-guard.service';
import { NewOrigination } from './pages/areas/originacion/originacion.component';

import { ItemService } from './services/item.service';
import { ComponenSigComponent } from './pages/modulos-areas/sig/componen-sig/componen-sig.component';
import { AreaProyectoComponent } from './pages/modulos-areas/sig/area-proyecto/area-proyecto.component';
import { AreaActividadComponent } from './pages/modulos-areas/sig/area-actividad/area-actividad.component';
import { ComponenPedComponent } from './pages/modulos-areas/sig/componen-ped/componen-ped.component';
import { ObservableService } from './services/Observables/observableProject.service';
import { MonitorProyectosComponent } from './pages/areas/monitor-avances/monitor-proyectos/monitor-proyectos.component';
import { MonitorAvancesComponent } from './pages/areas/monitor-avances/monitor-avances.component';
import { MRVComponent } from './pages/areas/MRV/mrv.component';
import { SalvaguardasComponent } from './pages/areas/salvaguardas/salvaguardas.component';
import { LegalComponent } from './pages/areas/legal/legal.component';
import { MRVCatalogsService } from './services/MRV/mrv-catalogs.service';
import { MRVService } from './services/MRV/mrv.service';
import { LegalService } from './services/Legal/legal.service';
import { LegalCatalogsService } from './services/Legal/legal-catalogs.service';

import { BitacoraCatalogsService } from './services/Bitacora/bitacora-catalogs.service';
import { BitacoraService } from './services/Bitacora/Bitacora.service';
import { ReportingPeriodsComponent } from './pages/reports/reporting-periods/reporting-periods.component';
import { ReportingPeriodsFormComponent } from './pages/reports/reporting-periods/reporting-periods-form/reporting-periods-form.component';
import { CarbonEquivalentComponent } from './pages/costs/carbon-equivalent/carbon-equivalent.component';
import { UpfrontCostComponent } from './pages/costs/upfront-cost/upfront-cost.component';
import { AnnualOMComponent } from './pages/costs/annual-om/annual-om.component';
import { UpfrontCostDeductionComponent } from './pages/costs/upfront-cost-deduction/upfront-cost-deduction.component';
import { AnnualOMDeductionsComponent } from './pages/costs/annual-omdeductions/annual-omdeductions.component';
import { CapexAccountsComponent } from './pages/config/capex-accounts/capex-accounts.component';
import { OpexAccountsComponent } from './pages/config/opex-accounts/opex-accounts.component';
import { CapexSubaccountsComponent } from './pages/config/capex-accounts/capex-subaccounts/capex-subaccounts.component';
import { OpexSubaccountsComponent } from './pages/config/opex-accounts/opex-subaccounts/opex-subaccounts.component';
import { DesarrolloComponent } from './pages/areas/desarrollo/desarrollo.component';
import { ReportingPeriodsService } from './services/ReportingPeriods/ReportingP.service';
import { CostsService } from './services/Costs/costs.service';
import { NoEmojiDirective } from './directives/no-emoji.directive';
import { HitosComponent } from './pages/config/bitacoraCt/hitos/hitos.component';
import { CategoriasComponent } from './pages/config/bitacoraCt/categorias/categorias.component';
import { TipoEvidenciasComponent } from './pages/config/bitacoraCt/tipo-evidencias/tipo-evidencias.component';
import { SummaryCostsComponent } from './pages/costs/summary-costs/summary-costs.component';
import { CapexOpexAccountsService } from './services/Tools/CapexOpexAccounts.service';
import { BitacoraAdminCtService } from './services/Bitacora/bitacora-adminct.service';
import { bitacoraCtComponent } from './pages/config/bitacoraCt/bitacoraCt.component';
import { RelationShipBtCtComponent } from './pages/config/bitacoraCt/relation-ship-bt-ct/relation-ship-bt-ct.component';
import { RPCatalogsService } from './services/ReportingPeriods/RPCatalogs.service';
import { DesarrolloCtService } from './services/Desarrollo/desarrolloCt.service';
import { desarrolloService } from './services/Desarrollo/desarrollo.service';
import { ActivitiesSummaryComponent } from './pages/areas/activities-summary/activities-summary.component';

import { MonSummaryService } from './services/MonitoringProjects/MonSummary.service';
import { BudgetpreviewComponent } from './pages/management/budgetpreview/budgetpreview.component';
import { EncryptionService } from './services/helpers/crypt.service';
import { SOPComponent } from './pages/config/sop/sop.component';
import { PlansBackupComponent } from './pages/management/plans-backup/plans-backup.component';
import { TabplanComponent } from './pages/management/tabplan/tabplan.component';
import { ImplementacionService } from './services/Implementacion/Implementacion.service';
import { ImplementationCatalogsService } from './services/Implementacion/Implementacion-catalogs.service';
import { SOPCatalogService } from './services/Tools/SOPCatalogs.service';
import { UsuariosComponent } from './pages/config/Usuarios/Usuarios.component';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { ActivitiesCatalogComponent } from './pages/config/activities-catalog/activities-catalog.component';
import { ActivitiesService } from './services/Tools/Activities.service';
import { IncidenceService } from './services/Incidences/Incidence.service';
import { IncidenceCatalogsServices } from './services/Incidences/Incidence-catalogs.service';
import { DashboarProjectDetailService } from './services/dashboards/dashboarProjectDetail.service';
import { SettlementService } from './services/settlement/settlement.service';
import { SettlementCatalogsService } from './services/settlement/settlement-catalogs.service';

// Registrar la localización es-MX
registerLocaleData(localeEsMx);
@NgModule({
    declarations: [
        
        AppComponent,
        RegisterComponent,
        NewPasswordComponent,
        LoginComponent,
        ForgotPasswordComponent,
        NewOrigination,
        ComponenSigComponent,
        AreaProyectoComponent,
        AreaActividadComponent,
        ComponenPedComponent,
        MonitorProyectosComponent,
        MonitorAvancesComponent,
        MRVComponent,
        SalvaguardasComponent,
        LegalComponent,
        ReportingPeriodsComponent,
        ReportingPeriodsFormComponent,
        CarbonEquivalentComponent,
        UpfrontCostComponent,
        AnnualOMComponent,
        UpfrontCostDeductionComponent,
        AnnualOMDeductionsComponent,
        CapexAccountsComponent,
        OpexAccountsComponent,
        CapexSubaccountsComponent,
        OpexSubaccountsComponent,
        DesarrolloComponent,
        NoEmojiDirective,
        HitosComponent,
        CategoriasComponent,
        TipoEvidenciasComponent,
        SummaryCostsComponent,
        bitacoraCtComponent,
        RelationShipBtCtComponent,
        ActivitiesSummaryComponent,
        BudgetpreviewComponent,
        SOPComponent,
        PlansBackupComponent,
        TabplanComponent,
        UsuariosComponent,
        ActivitiesCatalogComponent,
        
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,

        StyleClassModule,
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarModule,
        AvatarGroupModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        ChipModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        //FullCalendarModule,
        GalleriaModule,
        ImageModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TagModule,
        TerminalModule,
        TimelineModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        FormsModule, 
        ReactiveFormsModule,
        
        
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CustomerService, NodeService,
        PhotoService, ProductService, MenuService,UtilApiService, MessageService,authGuardService,
        ItemService, ObservableService, ConfirmationService, DatePipe, MRVCatalogsService, MRVService,
        LegalService, LegalCatalogsService, BitacoraCatalogsService, BitacoraService, ReportingPeriodsService,CostsService,
        CapexOpexAccountsService, BitacoraAdminCtService, RPCatalogsService, DesarrolloCtService, desarrolloService, MonSummaryService,
        EncryptionService, ImplementacionService, ImplementationCatalogsService, SOPCatalogService, ActivitiesService,
        IncidenceService, IncidenceCatalogsServices,DashboarProjectDetailService, SettlementService, SettlementCatalogsService
    ],
   
    bootstrap: [AppComponent]
})
export class AppModule { }
