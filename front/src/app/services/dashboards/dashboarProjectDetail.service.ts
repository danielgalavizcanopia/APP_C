import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilApiService } from '../util-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboarProjectDetailService {

  private url:string = environment.url;
  
  constructor(private http: HttpClient,  private _apiService : UtilApiService){

  }

  getprojectOverview(idProyecto: number = 0, token: string): Observable<any[]> {
      return this._apiService.sendGetRequest(this.url + `dashboards/getprojectOverview/${idProyecto}/`, token);
  }

  getSummaryBenefitTracker(idProyecto: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `dashboards/getSummaryBenefitTracker/${idProyecto}/`, token);
  }

  getSummaryByActivitiesTracker(idProyecto: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `dashboards/getSummaryByActivitiesTracker/${idProyecto}/`, token);
  }

  getTopODSByProject(idProyecto: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `dashboards/getTopODSByProject/${idProyecto}/`, token);
  }

  getActivitiesByOds(idProyecto: number = 0, idOds: number = 0,token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `dashboards/getActivitiesByOds/${idProyecto}/${idOds}`, token);
  }

  getActivityDetailByOdsAndProject(IdActividaddata: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `dashboards/getActivityDetailByOdsAndProject/${IdActividaddata}/`, token);
  }

  getIncidenceByProject(idProyecto: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `dashboards/getIncidenceByProject/${idProyecto}/`, token);
  }

  getKPIActivitiesByActivity(idActivity: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `dashboards/getKPIActivitiesByActivity/${idActivity}/`, token);
  }

  getActivitiesByProject(idProyecto: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `dashboards/getActivitiesByProject/${idProyecto}/`, token);
  }

  getMacroProcessCatalog(token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `dashboards/getMacroProcessCatalog`, token);
  }

  getKeyMilestonesByMacroprocess(idProyecto: number = 0, idMacro: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `dashboards/getKeyMilestonesByMacroprocess/${idProyecto}/${idMacro}`, token);
  }

  getCountEvidencesNIncidences(idProyecto: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `dashboards/getCountEvidencesNIncidences/${idProyecto}/`, token);
  }

}
