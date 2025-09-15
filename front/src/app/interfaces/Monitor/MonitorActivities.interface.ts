

export interface ActivitiesApproved {
    Idactividadrelcuantitativo: number;
    IdActividaddata:            number;
    Idcuantitativo:             number;
    nombreCuantitativo:         string;
    estimado:                   number;
    totalutilizado:             number;
    Idmetrica:                  number;
    Metrica:                    string;
}

export interface ReporteoByActivity {
    IdReporteActividadCuantitativo: number;
    Idreporteoactividades:          number;
    Idactividadrelcuantitativo:     number;
    IdActividaddata:                number;
    NombreActividad:                string;
    Idcuantitativo:                 number;
    NombreCuantitativo:             string;
    AvanceCuantitativo:             number;
    begindate:                      Date;
    enddate:                        Date;
    calculatedprogress:             string;
    NumJornales:                    number;
    participatingM:                 number;
    participatingW:                 number;
    status:                         number;
    DateCreate:                     string;
    IDUserCreate:                   number;
    DateModify:                     null;
    IDUserModify:                   null;
}

export interface ActivitiesReportsAdvances {
    IdActividadRelCuantitativo:  number;
    IdReporteoActividades:       number;
    Idcuantitativo:              number;
    AvanceCuantitativo:          number;
    calculatedprogress:          string;
    begindate:                   Date;
    enddate:                     Date;
    NumJornales:                 number;
    participatingM:              number;
    participatingW:              number;
    DateCreate:                  Date;
    IdstatusReporteoActividades: number;
    StatusName:                  string;
}


export interface ActivitiesDates {
    idrpnumber:       number;
    Idplananual:      number;
    IdActividaddata:  number;
    nombreactividad:  string;
    actividaddatestart: Date;
    actividaddateend:   Date;
    StartDateActual:  null;
    EndDateActual:    null;
    StartDelayed:     null;
    EndDelayed:       null;
}

export interface ActivitiesReportedByID {
    IdActividaddata:            number;
    idactivitiesprojects:       number;
    Actividad:                  string;
    idrpnumber:                 number;
    EstimadoUSD:                number;
    Ca_o_pex:                   number;
    idopexsubaccount:           number;
    NombreOpex:                 string;
    idcapexsubaccount:          null;
    NombreCapex:                null;
    actividaddatestart:         Date;
    actividaddateend:           Date;
    NombreEvaluador:            null;
    IdActividadRelCuantitativo: number;
    Idcuantitativo:             number;
    estimado:                   number;
    NombreCuantitativo:         string;
    Idmetrica:                  number;
    Metrica:                    string;
    IdstatusReporteoActividades: number;
    Idstatus:                   number;
}

export interface ActivitiesMonitoringExpand {
    IdActividaddata: number;
    Actividad:       string;
    StatusName:      string;
    reporting:       Reporting[];
}

export interface Reporting {
    IdActividaddata:            number;
    Idactividadrelcuantitativo: number;
    Idcuantitativo:             number;
    cuantitativo:               string;
    estimado:                   number;
    Idmetrica:                  number;
    Metrica:                    string;
    Idreporteoactividades:      number;
    AvanceCuantitativo:         number;
    calculatedprogress:         string;
    NumJornales:                number;
    participatingM:             number;
    participatingW:             number;
    DateCreate:                 Date;
}


