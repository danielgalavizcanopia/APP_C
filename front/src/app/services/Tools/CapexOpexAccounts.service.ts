import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class CapexOpexAccountsService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){
        
    }

    getCapexAccounts(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "tools/getCapexAccounts/", token);
    }
    getCapexSubaccounts(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "tools/getCapexSubaccounts/", token);
    }
    getOpexAccounts(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "tools/getOpexAccounts/", token);
    }
    getOpexSubaccounts(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "tools/getOpexSubaccounts/", token);
    }

    setCapexAccounts(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "tools/setCapexAccounts";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }
    setCapexSubaccounts(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "tools/setCapexSubaccounts";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }
    setOpexAccounts(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "tools/setOpexAccounts";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }
    setOpexSubaccounts(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "tools/setOpexSubaccounts";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }


}