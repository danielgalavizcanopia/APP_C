import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class IncidenceService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getIndicencesByProject(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Incidence/getIndicencesByProject/${idProyecto}/`, token);
    }

    setIncidences(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "Incidence/setIncidences";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    setIncidenceStatus(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "Incidence/setIncidenceStatus";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    setInvolvedSIL(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "Incidence/setInvolvedSIL";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    getCanopiaInvolvedByIncidence(idIncidence: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Incidence/getCanopiaInvolvedByIncidence/${idIncidence}/`, token);
    }

    getHistoryStatus(idIncidence: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Incidence/getHistoryStatus/${idIncidence}/`, token);
    }

    getEvidencesByIncidence(idIncidence: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Incidence/getEvidencesByIncidence/${idIncidence}/`, token);
    }

    setEvidencesByIncidences(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "Incidence/setEvidencesByIncidences";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }
    
    downloadBenefitMonitorExcel(idProyecto: any, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `Incidence/getIncidencesReportXLSX/${idProyecto}`, {
          headers,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'IncidencesByProject.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }

    downloadGeneralIncidences(token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `Incidence/getGeneralIncidencesReportsXLSX`, {
          headers,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'GeneralIncidencesReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }

    
}