import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ReportingPeriodsService {
   private url:string = environment.url;
constructor(private http: HttpClient,  private _apiService : UtilApiService){
}

  getReportingPeriods(idProyecto: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `RP/getReportingPeriods/${idProyecto}/`, token);
  }

  getReportingPeriodsVolumeYear(idProyecto: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `RP/getReportingPeriodsVolumeYear/${idProyecto}/`, token);
  }

  setReportingPeriods(data: any, token: string = '') : Observable<any> {
    const url = this.url + "RP/setReportingPeriods/";
    return this._apiService.sendPostTokenRequest(data, url, token);
  }

  getReportingPeriodsbyID(idrp: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `RP/getReportingPeriodsByID/${idrp}/`, token);
  }

  getReportingPeriodsSummary(idProyecto: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `RP/getReportingPeriodsSummary/${idProyecto}/`, token);
  }

  downloadExcel(idprojects: number = 0, ProjectName: any,token: string) {
    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
    });

    this.http.get(this.url + `RP/generateXLSXReportingPeriod/${idprojects}/`, {
      headers,
      responseType: 'blob',
    }).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = ProjectName+'.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }, (error) => {
      console.error('Error al descargar el Excel', error);
    });
  }

}