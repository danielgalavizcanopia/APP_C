import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class BitacoraCatalogsService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){
        
    }
    
    getHitosProcess(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "BitacoraCatalogos/getHitosProcess/", token);
    }

    getCategoriaEvidencia(idHito: number, token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `BitacoraCatalogos/getCategoriaEvidencia/${idHito}/`, token);
    }

    getTipoEvidencia(idCategoriaEv: number, token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `BitacoraCatalogos/getTipoEvidencia/${idCategoriaEv}/`, token);
    }
}