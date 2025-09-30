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
