import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class SOPCatalogService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){
        
    }

    getSOP(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "toolsSOP/getSOP/", token);
    }

    setSOP(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "toolsSOP/setSOP";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }



}