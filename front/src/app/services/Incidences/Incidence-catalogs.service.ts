import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class IncidenceCatalogsServices {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getincidentimpact(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "IncidenceCatalogs/getincidentimpact/", token);
    }
    getInvolvedSIL(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "IncidenceCatalogs/getInvolvedSIL/", token);
    }
    getIncidenceType(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "IncidenceCatalogs/getIncidenceType/", token);
    }
    getCanopiaUsers(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "IncidenceCatalogs/getCanopiaUsers/", token);
    }
    getUserProManager(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "IncidenceCatalogs/getUserProManager/", token);
    }
    getStatusIncidence(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "IncidenceCatalogs/getStatusIncidence/", token);
    }
    getLogByIdProject(idprojects: number = 0,token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + `IncidenceCatalogs/getLogByIdProject/${idprojects}`, token);
    }
}