import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../../../services/util-api.service';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../../login.service';
import { ActivityArea } from 'src/app/interfaces/CatalgosSig/CtProjectArea/CtprojectArea.interface';


@Injectable({
    providedIn: 'root'
  })
export class ActivityAreaService {
   private url:string = environment.url;
    constructor(private http: HttpClient,  private _apiService : UtilApiService, private _usuarioService : UsuarioService){

    }

    /** GET AND SET ACTIVITY AREA */
    getactivitiesbyid(idProjects: number = 0, token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `activityarea/getactivitiesbyid/${idProjects}`, token);
    }
    
    setactivities(activityArea: ActivityArea, token: string = '') : Observable<any> {
        const url = this.url + "activityarea/setactivities/";
        return this._apiService.sendPostTokenRequest(activityArea, url, token);
    }


    /** CATALOG ACTIVITY AREA */
    getvalidacionArea(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "sigcatalogos/validacion/", token);
    }

    getVersionAA(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "sigcatalogos/catversionaa/", token);
    }

    /** SERVICIOS PED */
    getResultAP(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "sigcatalogos/resultAp/", token);
    }

    getctseccionAA(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "sigcatalogos/ctseccionAA/", token);
    }

    getctpoblacionAA(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "sigcatalogos/ctpoblacionAA/", token);
    }

    getctActivityAG(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "sigcatalogos/ctActivityAG/", token);
    }

    getctEncuestas(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "sigcatalogos/ctEncuestas/", token);
    }

    getctsubSidiosAA(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "sigcatalogos/ctsubSidiosAA/", token);
    }

    getctPendienteAA(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "sigcatalogos/ctPendienteAA/", token);
    }

    getctChangeofCoverage(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "sigcatalogos/ctChangeofCoverage/", token);
    }

    getctresultPedAA(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "sigcatalogos/ctresultPedAA/", token);
    }


}