import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class CatalogosService {
   private url:string = environment.url;
constructor(private http: HttpClient,  private _apiService : UtilApiService){
}
  getCt_Estados(token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + "catalogos/get_estados/", token);
  }
  getCt_aggregation(token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + "catalogos/getaggregation/", token);
  }
  getMunXestado(idEstado: number, token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `catalogos/municipalities/${idEstado}/`, token);
  }
  getagrarioBymun(id_mun:number, token: string = ''): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + `catalogos/agrario/${id_mun}/`, token)
  }
  // http://127.0.0.1:8000/Originacion/ctimplpar

  /** CATALOGOS ORIGINACIÓN */
  getctimplpar(token: string): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + "Originacioncatalogos/ctimplpar/", token);
  }

  getctLandtenure(token: string): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + "Originacioncatalogos/ctLandtenure/", token);
  }

  getctprojecttype(token: string): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + "Originacioncatalogos/ctprojecttype/", token);
  }

  getctprogram(token: string): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + "Originacioncatalogos/ctprogram/", token);
  }

  getctleadsoriginacion(token: string): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + "Originacioncatalogos/ctleadsoriginacion/", token);
  }

  getoripromoter(token: string): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + "Originacioncatalogos/oripromoter/", token);
  }

  getstatusorigi(token: string): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + "Originacioncatalogos/statusorigi/", token);
  }

  getctapprovedbuyer(token: string): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + "Originacioncatalogos/ctapprovedbuyer/", token);
  }
  
  getctprospecpriority(token: string): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + "Originacioncatalogos/ctprospecpriority/", token);
  }

  getctprojectalive(token: string): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + "Originacioncatalogos/ctprojectalive/", token);
  }
  
}