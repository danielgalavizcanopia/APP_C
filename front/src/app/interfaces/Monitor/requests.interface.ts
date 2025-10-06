export interface TransactionDetails {
    TotalTransacciones:         number;
    IdP_R_Estructurada:         number;
    Original_Ledger:            string;
    NewLedger:                  string;
    OriginalRP:                 number;
    NewRP:                      null;
    Original_idcapexsubaccount: null;
    conceptoCapexOriginal:      null;
    Newidcapexsubaccount:       null;
    conceptoCapexNew:           null;
    accountCapexOriginal:       null;
    accountOpexOriginal:        string;
    Original_idopexsubaccount:  number;
    conceptoOpexOriginal:       string;
    Newidopexsubaccount:        number;
    conceptoOpexNew:            string;
    Justification:              string;
    Original_Amount_USD:        number;
    CreatedDate:                Date;
}

export interface HistoryActualRequests {
    Idactualreviewrequest: number;
    iduserautho:           number;
    authorizationDate:     Date;
    idstatusautho:         number;
    Name:                  string;
    Email:                 string;
    AuthorizationComment:  string;
    StatusNombre:          string;
}

export interface ActualRequest {
    Idactualreviewrequest: number;
    idprojects:            number;
    LedgerType:            string;
    idrpnumber:            number;
    idsubaccount:          number;
    nombre_subcuenta:      string;
    idstatusrequest:       number;
    ProjectName:           string;
    TotalChanges:          number;
    OriginalTotal:         number;
}

export interface HistoryRequests {
    ProjectName:                string;
    requestDate:                Date;
    Original_Ledger:            string;
    NewLedger:                  string;
    Original_idrpnumber:        number;
    New_idrpnumber:             number;
    Original_idcapexsubaccount: number;
    Original_idopexsubaccount:  null;
    New_idcapexsubaccount:      null;
    New_idopexsubaccount:       number;
    Original_Amount_USD:        number;
}
