import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class MonCatalogService {
    private url:string = environment.url;
    private DateDownload = new Date();

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getActivitiesByRP(token: string = '',rpnumber: number, idProyecto: number = 0): Observable<any[]>{ 
        return this._apiService.sendGetRequest(this.url + `MonitorCatalogo/getActividadesByProject/${rpnumber}/${idProyecto}`, token);
    }

    getLeadDesarrollo(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MonitorCatalogo/get_leadDesarrollo/", token);
    }

    getTypeActivities(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MonitorCatalogo/get_typeActivities/", token);
    }
    getMetricas(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MonitorCatalogo/get_metricas/", token);
    }
    getActivitiesProjects(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MonitorCatalogo/get_ActivitiesProjects/", token);
    }
    getActivitiesStatus(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MonitorCatalogo/get_statusdesarrollo/", token);
    }
    getCuentasCapex(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MonitorCatalogo/get_CCapex/", token);
    }
    getSubCuentasCapex(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MonitorCatalogo/get_SubCCapex/", token);
    }
    getCuentasOpex(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MonitorCatalogo/get_COpex/", token);
    }

    getStatusReporteoActividades(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "MonitorCatalogo/getStatusReporteoActividades/", token);
    }

    getMonitorActivities(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `MonitorActivities/getMonitorActivities/${idProyecto}/`, token);
    }

    getReporteoByActivity(idactividad: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `MonitorActivities/getReporteoByActivity/${idactividad}`, token);
    }

    getReportActDetailById(idactividad: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `MonitorActivities/getReportActDetailById/${idactividad}`, token);
    }

    getActivitiesApproved(token: string = '',rpnumber: number, idProyecto: number = 0): Observable<any[]>{ 
        return this._apiService.sendGetRequest(this.url + `monitorActivities/getActivitiesApproved/${rpnumber}/${idProyecto}`, token);
    }

    getActivitiesDates(token: string = '',rpnumber: number, idProyecto: number = 0): Observable<any[]>{ 
        return this._apiService.sendGetRequest(this.url + `monitorActivities/getMonitorDates/${rpnumber}/${idProyecto}`, token);
    }

    getReporteActividadByProject(rpnumber: number, idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `MonitorActivities/getReporteActividadByProject/${rpnumber}/${idProyecto}`, token);
    }

    getBudgetTrackerByProjectRP(rpnumber: number, idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `MonitorSummary/getBudgetTrackerByProjectRP/${idProyecto}/${rpnumber}`, token);
    }

    getFinancialTracker(rpnumber: number, idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `MonitorSummary/getFinancialTracker/${idProyecto}/${rpnumber}`, token);
    }

    getBenefitsTracker(rpnumber: number, idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `MonitorSummary/getBenefitsTracker/${idProyecto}/${rpnumber}`, token);
    }

    getTransactionTracker(rpnumber: number, idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `MonitorSummary/getTransactionTracker/${idProyecto}/${rpnumber}`, token);
    }


    setStatusReporteoactivities(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "MonitorActivities/setStatusReporteoactivities";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }
    
    setReporteoActivities(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "MonitorActivities/setReporteoActivities";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }


    getActivitiesByProject(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `MonitorActivities/getActivitiesByProject/${idProyecto}/`, token);
    }

    getActivityPlan(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `MonitorActivities/getActivityPlan/${idProyecto}/`, token);
    }

    downloadDatesExcel(idProyecto: any, rpnumber: number = 0, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `MonitorActivities/generateDatesXlsxReport/${rpnumber}/${idProyecto}`, {
          headers,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Monitor_Dates_Report.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }

    downloadKPIMonitorExcel(idProyecto: any, rpnumber: number = 0, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `MonitorActivities/generateReporteActividadByProject/${rpnumber}/${idProyecto}`, {
          headers,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Monitor_KPIMonitor_Report.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }

    downloadGeneralKPIReport(token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `MonitorActivities/generateKPIGeneralReport`, {
          headers,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'GeneralKPIMonitor.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }

    downloadBTMonitorExcel(idProyecto: any, rpnumber: number = 0, ProjectName: string = '', token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `MonitorSummary/generateXLSXBT/${idProyecto}/${rpnumber}`, {
          headers,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = ProjectName + '_ByActivities_Report-' + this.DateDownload.toISOString().split('T')[0] + '.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }

    downloadFTMonitorExcel(idProyecto: any, rpnumber: number = 0, ProjectName:string  = '', token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `MonitorSummary/generateXLSXFT/${idProyecto}/${rpnumber}`, {
          headers,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = ProjectName + '_ByAccounts_Report-' + this.DateDownload.toISOString().split('T')[0] + '.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }

    downloadBenefitMonitorExcel(idProyecto: any, rpnumber: number = 0, ProjectName:string  = '', token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `MonitorSummary/generateXLSXBenefitDTracker/${idProyecto}/${rpnumber}`, {
          headers,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = ProjectName + '_BenefitDistribution_Report-' + this.DateDownload.toISOString().split('T')[0] + '.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }

    downloadTransactionMonitor(idProyecto: any, rpnumber: number = 0, ProjectName:string  = '', token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `MonitorSummary/getTransactionTrackerXLSX/${idProyecto}/${rpnumber}`, {
          headers,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = ProjectName + '_Transactions_Report-' + this.DateDownload.toISOString().split('T')[0] + '.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }

    /** PROVISIONAL REPORT */
    downloadProvisionalReport(Folio_project: any, ProjectName: string = '', idProject:any, rpnumbers:string ,token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        this.http.get(this.url + `MonitorSummary/getProvisionalXlsx/${Folio_project}/${idProject}/${rpnumbers}`, {
          headers,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = ProjectName+'_Provisional_Report-' + this.DateDownload.toISOString().split('T')[0] + '.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }
    
}