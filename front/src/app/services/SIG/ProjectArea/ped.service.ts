import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../../../services/util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class pedService {
   private url:string = environment.url;
  constructor(private http: HttpClient,  private _apiService : UtilApiService){

  }

  getped(idProjects: number = 0, token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `ped/getped/${idProjects}`, token);
  }

  setPED(body: any, token: string = '') : Observable<any> {
    const url = this.url + "ped/postped/";
    return this._apiService.sendPostTokenRequest(body, url, token);
}

  
}