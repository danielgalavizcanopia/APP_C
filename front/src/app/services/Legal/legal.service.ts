import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class LegalService {
    private url:string = environment.url;
    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getLegal(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Legal/getLegal/${idProyecto}/`, token);
    }

    setLegal(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "Legal/setLegal";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

}