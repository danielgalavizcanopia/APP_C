import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../../../services/util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class ctprojectareaService {
   private url:string = environment.url;
  constructor(private http: HttpClient,  private _apiService : UtilApiService){

  }

  getViewProjectArea(idProjects: number = 0, token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `ProjectAreaSig/viewbyid/${idProjects}`, token);
  }

  getviewbyidhist(idProjects: number = 0, token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `ProjectAreaSig/viewbyidhist/${idProjects}/`, token);
  }

  fnAreaproject(): Observable<any[]> {
    return this._apiService.sendGetSinToken(this.url + "/ProjectAreaSig/getAreaproject/");
  }
  fnctCertificacion(token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + "sigcatalogos/getctCertifi/", token);
  }
  fncatRan(token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `sigcatalogos/catRan/`, token);
  }
  fngetctstatusvalidnap(token: string = ''): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + `sigcatalogos/getctstatusvalidnap/`, token);
  }
  fngetCatalogleadsig(token: string = ''): Observable<any[]>{
    return this._apiService.sendGetRequest(this.url + `sigcatalogos/getctlead/`, token);
  }
  
}