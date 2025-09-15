import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class MRVService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getMRV(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `MRV/getMRV/${idProyecto}/`, token);
    }

    setMRV(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "MRV/setMRV";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    
}