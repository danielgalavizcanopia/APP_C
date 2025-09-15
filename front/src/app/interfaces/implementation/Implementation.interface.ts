export interface ActivityData {
    IdActividaddata:      number;
    NombreActividad:      null;
    idactivitiesprojects: number;
    Actividad:            string;
    idrpnumber:           number;
    objetivo:             string;
    Idsop:                number;
    actividaddatestart:   Date;
    actividaddateend:     Date;
    EstimadoUSD:          number;
    Ca_o_pex:             number;
    idopexsubaccount:     null;
    opexsubaccount:       null;
    idcapexsubaccount:    number;
    capexsubaccount:      string;
    Cualitativos:         string;
    linkdelarchivo:       null;
    UserEjecutordeCampo:  string;
    IDUserCoordinador:    number;
    IDUserSeguimiento:    number;
    UserSupervisor:       string;
    IDUserEvaluador:      number;
    IDUserCreate:         number;
    IDUserModify:         null;
    status:               number;
    IdstatusValidacion:   null;
    Idvalidacion:         null;
    idcapexaccounts:      number;
    idopexaccounts:       null;
    StatusPlan:           string;
    statusvalidateplan:     string;
}

export interface AnnualPlan {
    Idplananual:   number;
    name:          string;
    FolioPadi:     string;
    idrpnumber:    number;
    description:   string;
    Observaciones: string;
    status:        number;
    idprojects:    number;
    DateCreate:    Date;
}

export interface ActivitiesByAnnualPlan {
    Idactividad_Rel_PlanAnual: number;
    Idplananual:               number;
    IdActividaddata:           number;
    Actividad:                 string;
    NombreActividad:           string;
    objetivo:                  string;
    actividaddatestart:          Date;
    actividaddateend:            Date;
    EstimadoUSD:               number;
    RP_Number:                 string;
    ShortDescriptionSOP:       string;
    Metrica:                   string;
    numberKPI:                 number;
    Ca_o_pex:                  number;
    idopexsubaccount:          null;
    idcapexsubaccount:         number;
    Cualitativos:              string;
    MetaCuantitativos:         string;
    linkdelarchivo:            string;
    ReportingQuien:            string;
    ReportingComo:             string;
    ReportingCuando:           Date;
    UserEjecutordeCampo:     string;
    IDUserCoordinador:         string;
    IDUserSeguimiento:         string;
    UserSupervisor:          string;
    IDUserEvaluador:           string;
    DateCreate:                Date;
    IDUserCreate:              number;
    SOPdescription:            string;
    Cuantitativos:             string;
    ReportingData:             string;
}

export interface ActivitiesWithoutAnnualPlan {
    IdActividaddata:      number;
    idactivitiesprojects: number;
    Actividad:            string;
    NombreActividad:      null;
    EstimadoUSD:          number;
    Idactividad_Rel_PlanAnual?: number;
    Idplananual?: number;
}

export interface SDGByODS {
    IdGoalTarget:           number;
    TargetShortDescription: string;
}


