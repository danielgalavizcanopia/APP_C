import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class BitacoraAdminCtService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){
        
    }

    getHitosProcess(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "toolsLog/getHitoProcess/", token);
    }

    getCategories(token: string = ''): Observable<any[]> {
      return this._apiService.sendGetRequest(this.url + "toolsLog/getCategories/", token);
    }

    getEvidences(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "toolsLog/getEvidences/", token);
    }

    setHitosProcess(data: any, token: string = ''): Observable<any[]>{
      const url = this.url + "toolsLog/setHitoProcess";
      return this._apiService.sendPostTokenRequest(data, url, token);
    }

    setCategories(data: any, token: string = ''): Observable<any[]>{
      const url = this.url + "toolsLog/setCategories";
      return this._apiService.sendPostTokenRequest(data, url, token);
    }

    setEvidences(data: any, token: string = ''): Observable<any[]>{
      const url = this.url + "toolsLog/setEvidences";
      return this._apiService.sendPostTokenRequest(data, url, token);
    }

    setCatRelationship(data: any, token: string = ''): Observable<any[]>{
      const url = this.url + "toolsLog/setCatRelationship";
      return this._apiService.sendPostTokenRequest(data, url, token);
    }
}