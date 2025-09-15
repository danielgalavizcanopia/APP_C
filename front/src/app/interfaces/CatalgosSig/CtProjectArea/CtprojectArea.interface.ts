export interface CatalogRequestalRan {
    IdsolicitudRAN:number;
    SolictiudalRAM?:string;
}
export interface Catalogcertificacion{
    Idcertificacion:number;
    Certificacion?:string;
}

export interface Catalogstatusvalidacionap{
    IdStatusValidacionAP:number;
    StatusValicionAP?:string;

}
export interface Catalogleadsig{
    IdLeadSIG:number;
    LeadSIG?:string;
}

export interface ActivityArea {
    IdAreaactividad: number;
    idprojects: number;
    IdStatusValidacionAA: number;
    IdVersionAA: number;
    IdLeadSIG: number;
    ObservacionesAA?: string;
}

