import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class OriginacionService {
   private url:string = environment.url;
   
    constructor(private http: HttpClient,  private _apiService : UtilApiService){
    }

  getOriginacion(idProyecto: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `Originacion/originationbyid/${idProyecto}/`, token);
  }

  setOriginacion(originacion: any, token: string = '') : Observable<any> {
    const url = this.url + "Originacion/postorigination/";
    return this._apiService.sendPostTokenRequest(originacion, url, token);
  
  }

  updateOriginacion(data: any,idProyecto: number = 0, token: string = ''): Observable<any> {
    return this._apiService.sendPutRequest(data, this.url + `Originacion/puttorigination/${idProyecto}/`, token);
  }

}