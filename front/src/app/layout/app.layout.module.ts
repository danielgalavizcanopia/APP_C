
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { AppLayoutComponent } from './app.layout.component';
import { AppTopbarComponent } from '../shared/administrador/topbar/app.topbar.component';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { AppBreadcrumbComponent } from '../shared/administrador/breadcrumb/app.breadcrumb.component';
import { AppMenuComponent } from '../shared/administrador/menu/app.menu.component';
import { AppSidebarComponent } from '../shared/administrador/sidebar/app.sidebar.component';
import { AppMenuitemComponent } from '../shared/administrador/menu/app.menuitem.component';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
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
import { RatingModule } from 'primeng/rating';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { AppRoutingModule } from '../app-routing.module';
import { StyleClassModule } from 'primeng/styleclass';

import { AppConfigComponent } from './config/app.config.component';
import { InicioComponent } from '../pages/administrador/inicio/inicio.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { NodeService } from '../services/node.service';
import { PhotoService } from '../services/photo.service';
import { ProductService } from '../services/product.service';
import { MenuService } from './app.menu.service';
import { NewProyectComponent } from '../pages/administrador/new-proyect/new-proyect.component';
import { NavBarComponent } from '../pages/nav-bar/nav-bar.component';
import { ModalNewProjectComponent } from '../modal-new-project/modal-new-project.component';
import { AlertaComponent } from '../util/alerta.component';
import { NewprojectUpdateComponent } from '../pages/administrador/newproject-update/newproject-update.component';
import { SupplierTrackerComponent } from '../pages/areas/Monitoring-extern/Supplier-tracker/Supplier-tracker.component';
import { FinancialTrackerComponent } from '../pages/areas/Monitoring-extern/Financial-tracker/Financial-tracker.component';
import { AllMonitorsComponent } from '../pages/areas/Monitoring-extern/all-monitors/all-monitors.component';
import { BudgetTrackerComponent } from '../pages/areas/Monitoring-extern/budget-tracker/budget-tracker.component';
import { DashboardReportsComponent } from '../pages/reports/DashboardReports/DashboardReports.component';
import { IncidencesComponent } from '../pages/reports/DashboardReports/Incidences/Incidences.component';
import { BitacoraProyectosComponent } from '../pages/reports/DashboardReports/bitacora-proyectos/bitacora-proyectos.component';
import { BitacoraFormComponent } from '../pages/reports/DashboardReports/bitacora-proyectos/bitacora-form/bitacora-form.component';
import { Dashboard2Component } from '../pages/administrador/dashboard2/dashboard2.component';
import { ActivityDetailComponent } from '../pages/administrador/dashboard2/ActivityDetail/ActivityDetail.component';
import { MarketingComponent } from '../pages/commercialisation/marketing/marketing.component';
import { AnnualPlanningComponent } from '../pages/management/AnnualPlanning/AnnualPlanning.component';
import { BudgetsComponent } from '../pages/management/budgets/budgets.component';
import { HistoryAnnualPlansComponent } from '../pages/management/history-annual-plans/history-annual-plans.component';
import { ByTransactionComponent } from '../pages/areas/Monitoring-extern/by-transaction/by-transaction.component';
import { CaOpSetComponent } from '../pages/settlement/ca-op-set/ca-op-set.component';
import { CdrComponent } from '../pages/settlement/cdr/cdr.component';
import { SettlementComponent } from '../pages/settlement/settlement.component';



@NgModule({
    declarations: [
        AlertaComponent,
        ModalNewProjectComponent,
        AppConfigComponent,
        AppLayoutComponent,
        AppBreadcrumbComponent,
        AppSidebarComponent,
        AppTopbarComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        InicioComponent,
        NewProyectComponent,
        NavBarComponent,
        NewprojectUpdateComponent,
        SupplierTrackerComponent,
        FinancialTrackerComponent,
        AllMonitorsComponent,
        BudgetTrackerComponent,
        BitacoraProyectosComponent,
        BitacoraFormComponent,
        DashboardReportsComponent,
        IncidencesComponent,
        Dashboard2Component,
        ActivityDetailComponent,
        MarketingComponent,
        AnnualPlanningComponent,
        BudgetsComponent,
        HistoryAnnualPlansComponent,
        ByTransactionComponent,
        SettlementComponent,
        CdrComponent,
        CaOpSetComponent,

    ],
    imports: [
        ConfirmDialogModule,
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
        ReactiveFormsModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CustomerService, NodeService,
        PhotoService, ProductService, MenuService, ConfirmDialogModule, NewProyectComponent
    ],
    exports: [
        NavBarComponent,// Exporting the component here
        AlertaComponent 
      ],
})
export class AppLayoutModule { }
