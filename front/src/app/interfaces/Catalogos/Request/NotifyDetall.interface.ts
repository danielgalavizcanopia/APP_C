export interface Notification {
    idproyectohist    : number;                     
    idprojects        : number;
    ProjectName      ?: string;
    idaggregation     : number;
    Counterpart      ?: string;
    idnucleoAgrario   : number;         
    Justification    ?: string;
    idstatusauthorization : number;         
    authorizationDate?: string;
    requestDate      ?: string;
    iduserrequest    : number;         
    iduserautho      : number;         
    statusauthorization?: string;  
}