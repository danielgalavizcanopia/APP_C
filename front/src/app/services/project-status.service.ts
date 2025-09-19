import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from './util-api.service';
import { environment } from 'src/environments/environment';

export interface StatusProject {
  IdpstatusProject: number;
  statusProject: string; 
}

export interface SetStatusRequest {
  idprojects: number;
  IdpstatusProject: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectStatusService {
  private url: string = environment.url;

  constructor(
    private http: HttpClient, 
    private _apiService: UtilApiService
  ) {}

  getStatusProject(token: string): Observable<any> {
    return this._apiService.sendGetRequest(this.url + "dashboards/getStatusProject", token);
  }

  setProjectStatus(data: SetStatusRequest, token: string): Observable<any> {
    const url = this.url + "dashboards/setProjectStatus";
    return this._apiService.sendPostTokenRequest(data, url, token);
  }
}