export interface DashboardOverView {
    idprojects:               number;
    ProjectCounterpart:       string;
    idprojecttype:            number;
    ProjecType:               string;
    Periodo_Mas_Cercano:      string;
    currentRP:                number;
    CDRss_issued_to_date:     number;
    Expected_cdrs_current_rp: number;
    Id_ProyectoCAR:           string;
}

export interface SummaryBenefitTracker {
    id:           number;
    name:         string;
    totalPlanned: number;
    totalPaid:    number;
    variance:     number;
    percentage:   number;
    rows:         SummaryBenefitTrackerRow[];
}

export interface SummaryBenefitTrackerRow {
    id:           number;
    name:         Name;
    totalPlanned: number;
    totalPaid:    number;
    variance:     number;
    rows:         RowRow[];
}

export enum Name {
    Canopia = "Canopia",
    Car = "CAR",
    LegalAndAccountingAdvisors = "Legal and Accounting Advisors",
    LocalTechnicalServiceProviders = "Local Technical Service Providers",
    Pending = "pending",
    ServiceProductProviders = "Service/product providers",
    Vvb = "VVB",
}

export interface RowRow {
    id:      number;
    Type:    Name;
    concept: string;
    planned: number;
    paid:    number;
}

export interface TopODSbyProject {
    Idglobalgoals:            number;
    ShortDescriptionODSs:     string;
    TotalUsos:                number;
}

export interface ActivitiesByOds {
    IdActividaddata:      number;
    idactivitiesprojects: number;
    Actividades:          string;
    Idglobalgoals:        number;
    ShortDescriptionODSs: string;
}

export interface ActivityDetailsByOds {
    IdActividaddata:       number;
    idactivitiesprojects:  number;
    Actividad:             string;
    idrpnumber:            number;
    objetivo:              string;
    SOPdescription:        string;
    actividaddatestart:    Date;
    actividaddateend:      Date;
    EstimadoUSD:           number;
    Ca_o_pex:              number;
    idopexsubaccount:      number;
    nombreOpex:            string;
    idcapexsubaccount:     number;
    nombreCapex:           string;
    Cualitativos:          string;
    Cuantitativos:         string;
    linkdelarchivo:        null;
    ReportingData:         string;
    UserEjecutordeCampo:   string;
    IDUserCoordinador:     string;
    IDUserSeguimiento:     string;
    UserSupervisor:        string;
    IDUserEvaluador:       string;
    DateCreateActividad:   Date;
    IDUserCreateActividad: number;
}

export interface IncidencesByProject {
    IdIncidence:          number;
    IncidenceDescription: string;
    DateIncidence:        Date;
    Name:                 string;
    UltimoStatus:         null;
    MaxDate:              null;
}

export interface SummaryActivitiesTracker {
    EstimadoUSDCapex:     number;
    AmountCapex:          number;
    VarianceCapexPercent: number;
    EstimadoUSDOpex:      number;
    AmountOpex:           number;
    VarianceOpexPercent:  number;
    TotalEstimadoUSD:     number;
    TotalPagadoUSD:       number;
    TotalVariancePercent: number;
}

export interface ActivitiesByProject {
    IdActividaddata:      number;
    idprojects:           number;
    idactivitiesprojects: number;
    projectsactivities:   string;
    idrpnumber:           number;
    Actividad:            string;
}

export interface KPIByActivity {
    Metrica:                     string;
    estimado:                    number;
    AvanceCuantitativo:          null;
    calculatedprogress:          null;
    IdstatusReporteoActividades: null;
    StatusName:                  null;
}

export interface MacroProcessByProject {
    MacroProcess: string;
}

export interface MacroProcessCatalog {
    Idmacroprocess: number;
    macroprocess:   string;
}

export interface KeyMilestoneByMacro {
    MacroprocessName: string;
    IdKeyMilestone:   number;
    Idmacroprocess:   number;
    SubProcess:       string;
    IdhitoProceso:    number;
    Milestone:        string;
    idbitacora:       number;
    PlannedStartDate: Date;
    PlannedEndDate:   Date;
    Alert:            number;
    ActualEndDate:    Date;
    ActualStartDate:  Date;
}

export interface CountIndicencesNEvidences {
    idprojects:        number;
    total_evidencias:  number;
    total_incidencias: number;
}
