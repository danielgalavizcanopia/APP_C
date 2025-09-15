export interface ActivitiesByRP {
    IdActividaddata:             number;
    Actividad:                   string;
    CategoriaMarketing:          string;
    idprojects:                  number;
    idrpnumber:                  number;
    IdstatusReporteoActividades: number;
}

export interface ActivityReporting {
    Idactividadrelcuantitativo:  number;
    estimado:                    number;
    Idreporteoactividades:       number;
    Idcuantitativo:              number;
    Cuantitativos:               string;
    AvanceCuantitativo:          number;
    Metrica:                     string;
    begindate:                   Date;
    enddate:                     Date;
    calculatedprogress:          string;
    NumJornales:                 number;
    participatingM:              number;
    participatingW:              number;
    SumaParticipantes:           number;
    TotalParticipantes:          number;
    IdstatusReporteoActividades: number;
    status:                      number;
    DateCreate:                  Date;
    IDUserCreate:                number;
    SumaTotalJornales:           number;
}

