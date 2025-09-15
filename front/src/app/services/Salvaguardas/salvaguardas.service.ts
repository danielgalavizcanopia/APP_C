import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class SalvaguardasService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getSalvaguardas(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Salvaguardas/getSalvaguardas/${idProyecto}/`, token);
    }

    setSalvaguardas(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "Salvaguardas/setSalvaguardas";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    
}