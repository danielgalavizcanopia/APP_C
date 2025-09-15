import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class LegalCatalogsService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getLeadLegal(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "LegalCatalogo/getLeadLegal/", token);
    }
    getDDSattus(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "LegalCatalogo/getDDSattus/", token);
    }
    getMEKYCStatus(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "LegalCatalogo/getMEKYCStatus/", token);
    }
    getProyectosLegal(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "LegalCatalogo/getProyectosLegal/", token);
    }
}