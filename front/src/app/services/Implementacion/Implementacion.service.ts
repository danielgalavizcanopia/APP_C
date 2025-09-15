import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class ImplementacionService {
    private url:string = environment.url;
    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getActivitiesData(idprojects: number = 0, token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + `Implementation/getActivitiesData/${idprojects}/`, token);
    }

    getIndicadoresCuantitativosByActividad(idActividad: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getIndicadoresCuantitativosByActividad/${idActividad}/`, token);
    }

    getOdsByActividad(idActividad: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getOdsByActividad/${idActividad}/`, token);
    }

    getODSFilteredTargets(idOds: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getODSFilteredTargets/${idOds}/`, token);
    }

    getReporteoByActividad(idActividad: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getReporteoByActividad/${idActividad}/`, token);
    }

    getGoalsTargetByActivity(idActividad: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getGoalsTargetByActivity/${idActividad}/`, token);
    }


    setActivitiesData(data: any, file: File, token: string=''): Observable<any[]>{
        const url = this.url + "Implementation/setActivitiesData";
        return this._apiService.sendPostTokenRequestWithFile(data, file, url, token);
    }

    deleteIndicators(data: any, token: string=''): Observable<any[]>{
        const url = this.url + "Implementation/deleteIndicators";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }
    
    deleteReporting(data: any, token: string=''): Observable<any[]>{
        const url = this.url + "Implementation/deleteReporting";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    setValidaciones(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "Implementation/setValidaciones";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    setUsuariosName(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "Implementation/setUsuariosName";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    setCuantitativos(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "Implementation/setCuantitativos";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    setPlanAnnual(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "Implementation/setPlanAnnual";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    getPlanAnualByProject(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getPlanAnualByProject/${idProyecto}/`, token);
    }



    getActividadesByPlanAnual(idPlanAnnual: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getActividadesByPlanAnual/${idPlanAnnual}/`, token);
    }

    getActividadesWithoutPlanAnual(idrpnumber: number = 0, idProyecto: number = 0, idplan: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getActividadesWithoutPlanAnual/${idrpnumber}/${idProyecto}/${idplan}`, token);
    }

    getPlanAnualById(idPlanAnnual: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getPlanAnualById/${idPlanAnnual}/`, token);
    }

    downloadWord(idPlanAnnual: number = 0, ProjectName: any,token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        this.http.get(this.url + `Implementation/generateDocxAnnualPlan/${idPlanAnnual}/`, {
            headers,
            responseType: 'blob',
          }).subscribe((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = ProjectName+'.docx';
            a.click();
            window.URL.revokeObjectURL(url);
          }, (error) => {
            console.error('Error al descargar el Word', error);
          });
      }

    downloadExcel(idPlanAnnual: number = 0, ProjectName: any,token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `Implementation/generateXLSXAnnualPlan/${idPlanAnnual}/`, {
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

     downloadExcelDraft(idprojects: number = 0, idrpnumber: any, ProjectName: any, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `Implementation/generateXLSXDraft/${idprojects}/${idrpnumber}`, {
          headers,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = ProjectName+'_DraftPreview.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }

    /** HISTORICOS */
    getPlanAnualHistorico(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getPlanAnualHistorico/${idProyecto}/`, token);
    }

    getActividadesByPlanAnualHistorico(idPlananual: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getActividadesByPlanAnualHistorico/${idPlananual}/`, token);
    }

    getIndicadoresCuantitativosByActividadHistorico(idActividad: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getIndicadoresCuantitativosByActividadHistorico/${idActividad}/`, token);
    }
    getReportingByActividadHistorico(idActividad: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Implementation/getReportingByActividadHistorico/${idActividad}/`, token);
    }


}