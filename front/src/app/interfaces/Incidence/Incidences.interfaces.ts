export interface Incidences {
    IdIncidence:               number;
    idprojects:                number;
    UserReporting:                   string;
    IdincidenceType:           null;
    ShortDescIncidenceType:    null;
    DateIncidence:             Date;
    LocationIncidence:         string;
    IdIncidentImpact:          number;
    ShortDescriptionImpact:    string;
    ForestryOwner:             string;
    IdInvolvedSIL:             number;
    CCinvolved:                number;
    OthersInvolved:            string;
    IncidenceCauses:           string;
    IncidenceDescription:      string;
    ImmediateActions:          string;
    Impact:                    string;
    ForestryOwnerRequirements: string;
    SILRequirements:           string;
    DateSuggestedAttention:    Date;
    idbitacora:                null;
    Idusuariosname:            number;
    IdUserNotifyTo:            number;
    StatusName:                null;
    status:                    number;
    IDUserCreate:              number;
    IDUserModify:              number;
    DateCreate:                Date;
    DateModify:                Date;
}



export interface HistoryIncidenceStatus {
    IdIncidence:                 number;
    Idstatusreporteoactividades: number;
    StatusName:                  string;
    StatusDescription:           string;
    IDUserCreate:                number;
    IDUserModify:                null;
    DateCreate:                  Date;
    DateModify:                  null;
}

export interface EvidencesByIncidence {
    IdIncidenceEvidence: number;
    IdIncidence:         number;
    EvidenceLink:        string;
    nameevidence:        string;
    status:              number;
}

export interface CCInvolvedSelected {
    IdIncidenceRelCanopiaInvolved: number;
    IdIncidence:                   number;
    IdCanopiaInvolved:             number;
    NameUserInvolved:              string;
    status:                        number;
}

