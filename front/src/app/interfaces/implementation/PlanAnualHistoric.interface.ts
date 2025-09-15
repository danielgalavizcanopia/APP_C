export interface AnnualPlanHistoric {
    Idplananualhist: number;
    Idplananual:     number;
    name:            string;
    idrpnumber:      number;
    description:     string;
    Observaciones:   string;
    status:          number;
    idprojects:      number;
    backup_date:     Date;
}

export interface ActividadesByPlanHistorico {
    Idplananual:           number;
    name:                  string;
    idrpnumber:            number;
    description:           string;
    Observaciones:         string;
    status:                number;
    idprojects:            number;
    backup_date:           Date;
    IdActividaddata:       number;
    NombreActividad:       string;
    Actividad:             string;
    RP_Number:             string;
    objetivo:              string;
    SOPdescription:        null;
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
    linkdelarchivo:        string;
    ReportingData:         string;
    UserEjecutordeCampo:   string;
    IDUserCoordinador:     string;
    IDUserSeguimiento:     string;
    UserSupervisor:        string;
    IDUserEvaluador:       string;
    DateCreateActividad:   Date;
    IDUserCreateActividad: number;
}
