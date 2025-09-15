import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class CtPendientes {
   private url:string = environment.url;
constructor(private http: HttpClient,  private _apiService : UtilApiService){
}
  FnCtpendientes(token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + "notificacion/ctNotify", token);
  }
  FnCtAllStatus(token: string = ''):Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + "notificacion/NotifyByAllstatus/", token);
}
}