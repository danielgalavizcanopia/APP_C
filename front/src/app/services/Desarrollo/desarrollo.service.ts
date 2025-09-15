import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class desarrolloService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getDesarrolloByProject(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Desarrollo/getDesarrolloByProject/${idProyecto}/`, token);
    }

    setDesarrolloAndCRT(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "Desarrollo/setDesarrolloAndCRT";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    
}