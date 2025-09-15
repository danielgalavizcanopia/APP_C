export interface SummaryCostCapexOpex {
    TotalEstimatedCost: number;
    Totalcapex:         number;
    Totalopex:          number;
}

export interface BudgetTrackerData {
    id:               number;
    Name:             string;
    Approved:         number;
    PlannedTotal:     number;
    PaidTotal:        number;
    ProvisionalTotal: number;
    Accounts:         Account[];
}

export interface Account {
    type:                 Type;
    idcapexsubaccount:    number;
    idrpnumber?:          number;
    idactivitiesprojects: number;
    NombreActividad:      string;
    AccountNum:           string;
    Planned:              number;
    Actual:               number;
    Provisional:          number;
}

export enum Type {
    Capex = "Capex",
}


export interface CapexAccount {
    type:            string;
    NombreActividad: string;
    Planned:         number;
    AccountNum:      string;
    Approved:        number;
    Actual:          number;
    Reconciled:      number;
}

export interface OpexAccount {
    type:            string;
    NombreActividad: string;
    Planned:         number;
    AccountNum:      string;
    Approved:        number;
    Actual:          number;
    Reconciled:      number;
}

export interface FinancialTracker {
    id:       number;
    Name:     string;
    Assembly: number;
    Approved: number;
    Planned: number;
    Paid: number;
    Provisional: number;
    Accounts: Account[];
}

export interface Account {
    id:          number;
    AccountName: string;
    Approved:    number;
    Planned:     number;
    Paid:        number;
    subAccounts: SubAccount[];
}

export interface SubAccount {
    id:      number;
    Name:    string;
    account: string;
    planned: number;
    paid:    number | null;
}

export interface BenefitTracker {
    id:       number;
    Name:     string;
    Approved: number;
    Planned:  number;
    Paid:     number;
    Accounts: Account[];
}


export interface ByTransaction {
    id:          number;
    accountType: string;
    total:       number;
    accounts:    Account[];
}

