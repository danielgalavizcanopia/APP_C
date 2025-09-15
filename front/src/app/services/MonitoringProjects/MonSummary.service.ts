import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class MonSummaryService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getSumTotalCapexOpexEC(idProyecto: number = 0, token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + `MonitorSummary/getSumTotalCapexOpexEC/${idProyecto}/`, token);
    }

    getSummaryActivitiesByProject(idProyecto: number = 0,year: number = 2024, token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + `MonitorSummary/getSummaryActivitiesByProject/${idProyecto}/${year}/`, token);
    }

    setSummaryMoves(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "MonitorSummary/setSummaryMoves";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }
}