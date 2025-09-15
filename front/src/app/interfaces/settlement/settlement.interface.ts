export interface PercentageMktOrigination {
    PercentageMktPrice: number;
}

export interface Settlement {
    Idsettlement:            number;
    folio:                   string;
    DateCreate:              Date;
    idrpnumber:              number;
    typeofcurrency:          string;
    rp_count:                number;
    settlement_volume:       number;
    vintage_range:           string;
    pricecanopia:            number;
    markert_price_avg:       number;
    PercentageMktPrice_avg:  number;
    project_gross_income:    number;
    Approved:                number;
    ACD:                     number;
    Final_Upfront_Deduction: number;
    Project_Net_Income:      number;
    status:                  number;
    statusdirection:         number;
}


export interface SettlementDetails {
    Idsettlementdetails: number;
    Idsettlement:        number;
    idrpnumber:          number;
    settlement_volume:   number;
    vintage:             number;
    Idprepayment:        number;
    markert_price:       number;
    PercentageMktPrice:  number;
    pricecanopia:        number;
    Total:               number;
}

export interface SettlementDeductions {
    Idsettlement:      number;
    idrpnumber:        number;
    Idtypededuction:   number;
    idcapexsubaccount: number;
    idopexsubaccount:  null;
    cost:              number;
    statusdeduction:   number;
}

export interface RPCount {
    idprojects: number;
    rp_count:   number;
}

export interface TotalApprovedByAssembly {
    idprojects:             number;
    idrpnumber:             number;
    Total_byRP_EstimadoUSD: number;
}
