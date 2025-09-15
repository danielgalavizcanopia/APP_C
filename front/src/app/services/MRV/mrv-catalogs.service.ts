import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class MRVCatalogsService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getMrvLead(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MRVCatalogo/getMrvLead/", token);
    }

    getleakeage(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MRVCatalogo/getleakeage/", token);
    }

    getmrvrequirements(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MRVCatalogo/getmrvrequirements/", token);
    }

    getpermanence(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MRVCatalogo/getpermanence/", token);
    }
    
    getstatusmrv(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MRVCatalogo/getstatusmrv/", token);
    }

    

}