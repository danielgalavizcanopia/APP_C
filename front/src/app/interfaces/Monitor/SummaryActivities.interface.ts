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
    Ledger:        string;
    totalPlanned:  number;
    totalPaid:     number;
    totalApproved: number;
    beneficiaries: Beneficiary[];
}

export interface Beneficiary {
    Type_of_Beneficiary: TypeOfBeneficiary;
    totalPlanned:        number;
    totalPaid:           number;
    suppliers:           Supplier[];
}

export enum TypeOfBeneficiary {
    DirectCommunityBenefit = "Direct Community Benefit",
    ServiceProviders = "Service Providers",
}

export interface Supplier {
    Type_of_Supplier: TypeOfSupplier;
    totalPlanned:     number;
    totalPaid:        number;
    items:            Item[];
}

export enum TypeOfSupplier {
    Canopia = "Canopia",
    Car = "CAR",
    CommunityEmployment = "Community Employment",
    EquipmentForCommunity = "Equipment for Community",
    LocalTechnicalServiceProviders = "Local Technical Service Providers",
    ServiceProductProviders = "Service/product providers",
    Vvb = "VVB",
}

export interface Item {
    Ledger:               string;
    idsubaccount:         number;
    concepto_subaccount:  string;
    Actividad:            null | string;
    Type_of_Beneficiary:  TypeOfBeneficiary;
    IdtypeofBeneficiary:  number;
    Type_of_Supplier:     TypeOfSupplier;
    IdtypeofSupplier:     number;
    idprojects:           number;
    idrpnumber:           number;
    Amount_USD:           number | null;
    EstimadoUSD:          number | null;
    idactivitiesprojects: number;
}


export interface ByTransaction {
    id:          number;
    accountType: string;
    total:       number;
    accounts:    TransactionAccount[];
}

export interface TransactionAccount {
    idrpnumber:        number;
    principalAccount:  PrincipalAccount;
    idTransaction:     number;
    accountName:       string;
    Actividad:         null | string;
    typeofBeneficiary: TypeofBeneficiary;
    typeofSupplier:    TypeofSupplier;
    Amount_USD:        number;
    createdAt:         Date;
    recipient:         Recipient;
}

export enum PrincipalAccount {
    The51010Contingencia = "510.10 Contingencia",
    The5101CAROnsiteVerification = "510.1 CAR Onsite Verification",
    The5104MonitoringBaseline = "510.4 Monitoring Baseline",
    The5105OnsiteImplementation = "510.5 Onsite Implementation",
    The5106GastosDeGestionDeProyecto = "510.6 Gastos de Gestion de Proyecto",
    The5107PDDDevelopment = "510.7 PDD Development",
    The5108Registration = "510.8 Registration",
    The5109VerificationSupport = "510.9 Verification Support",
}

export enum Recipient {
    Canopia = "Canopia",
    Community = "Community",
    Empty = "",
    ThirdParty = "Third party",
}

export enum TypeofBeneficiary {
    DirectCommunityBenefit = "Direct Community Benefit",
    ServiceProviders = "Service Providers",
}

export enum TypeofSupplier {
    Canopia = "Canopia",
    Car = "CAR",
    CommunityEmployment = "Community Employment",
    EquipmentForCommunity = "Equipment for Community",
    LocalTechnicalServiceProviders = "Local Technical Service Providers",
    ServiceProductProviders = "Service/product providers",
}


export interface DateRangesByProject {
    Resultado:              string;
    Reporting_period_start: Date;
    Reporting_period_end:   Date;
    Min_idrpnumber:         number;
    Max_idrpnumber:         number;
}


