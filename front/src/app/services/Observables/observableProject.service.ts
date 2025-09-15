import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Projects } from '../../interfaces/Portafolio/NewProject/Newproject.interface';


const initProyecto  : Projects =  {
    idprojects      : 0 ,
    Folio_project   : '', 
    ProjectName     : '', 
    Aggregation     : 0, 
    idAggregation: 0,
    Counterpart     : '', 
    NucleoAgrario   : '', 
    TipoPropiedad   : '', 
    Municipio       : '', 
    Estado          : '', 
    Status           : 0,
    Id_ProyectoCAR  :0,
}

@Injectable({
  providedIn: 'root'
})

export class ObservableService {

    private proyecto$ = new BehaviorSubject<Projects>(initProyecto);
    private validacion$ = new BehaviorSubject<any>("");

    private refresh$ = new Subject<void>();


    /** PARA UPDATE DE PADIS */
    private refreshSource = new Subject<void>(); // o Subject<any> si quieres mandar datos
    refreshPADI$ = this.refreshSource.asObservable();


    triggerRefresh() {
        this.refreshSource.next();
    }

    
    constructor() { }


    get selectedProject$() : Observable<Projects> {
        return this.proyecto$.asObservable();
    }

    setProject(project : Projects) : void {
        this.proyecto$.next(project);
    }


    get catchValidation$():Observable<any> {
        return this.validacion$.asObservable();
    }

    setcatch(validation: any) {
        this.validacion$.next(validation);
    }

    get catchRefresh$():Observable<any> {
        return this.refresh$.asObservable();
    }

    setValidation() {
        this.refresh$.next();
    }



}