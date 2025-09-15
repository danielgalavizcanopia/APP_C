import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilApiService } from '../util-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettlementService {

  private url:string = environment.url;

  constructor(private http: HttpClient,  private _apiService : UtilApiService){

  }

  getSettlement(idProyecto: number = 0, idrp: number = 0, token: string): Observable<any[]> {
      return this._apiService.sendGetRequest(this.url + `settlement/getSettlement/${idProyecto}/${idrp}`, token);
  }

  setSettlement(data: any, token: string = ''): Observable<any[]>{
    const url = this.url + "settlement/setSettlement";
    return this._apiService.sendPostTokenRequest(data, url, token);
  }

  getSettlementDetails(idsettlement: number = 0, idrp: number = 0, token: string): Observable<any[]> {
      return this._apiService.sendGetRequest(this.url + `settlement/getSettlementDetails/${idsettlement}/${idrp}`, token);
  }

  getSettlementDeductions(idsettlement: number = 0, idrp: number = 0, token: string): Observable<any[]> {
      return this._apiService.sendGetRequest(this.url + `settlement/getSettlementDeductions/${idsettlement}/${idrp}`, token);
  }

  getRPCountByProject(idProyecto: number = 0, token: string): Observable<any[]> {
      return this._apiService.sendGetRequest(this.url + `settlement/getRPCountByProject/${idProyecto}`, token);
  }

  setStatusSettlement(data: any, token: string = ''): Observable<any[]>{
    const url = this.url + "settlement/setStatusSettlement";
    return this._apiService.sendPostTokenRequest(data, url, token);
  }

  getTotalApprovedByAssembly(idProyecto: number = 0, idRP: number = 0, token: string): Observable<any[]> {
      return this._apiService.sendGetRequest(this.url + `settlement/getTotalApprovedByAssembly/${idProyecto}/${idRP}`, token);
  }

  setDeleteSettlement(data: any, token: string = ''): Observable<any[]>{
    const url = this.url + "settlement/setDeleteSettlement";
    return this._apiService.sendPostTokenRequest(data, url, token);
  }

  downloadSettlementReport(ProjectName:any, idProject:any, rpnumbers:string ,token: string) {
      const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
      });

      this.http.get(this.url + `settlement/getSettlementXLSX/${idProject}/${rpnumbers}`, {
        headers,
        responseType: 'blob',
      }).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SettlementReport${ProjectName}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      }, (error) => {
        console.error('Error al descargar el Excel', error);
      });
  }
}
