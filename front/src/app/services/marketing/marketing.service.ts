import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilApiService } from '../util-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketingService {
  private url:string = environment.url;
  
  constructor(private _apiService : UtilApiService) {

  }

  getActivitiesByRPmark(idProyecto: number = 0, idRP: number, token: string): Observable<any[]> {
      return this._apiService.sendGetRequest(this.url + `marketing/getActivitiesByRPmark/${idProyecto}/${idRP}`, token);
  }

  getReportingByActivitymark(idactivity: number = 0, token: string): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `marketing/getReportingByActivitymark/${idactivity}`, token);
  }
  
  setImportAcivityEventCatalog(data: any, token: string = ''): Observable<any[]>{
      const url = this.url + "marketing/setImportAcivityEventCatalog";
      return this._apiService.sendPostTokenRequest(data, url, token);
  }

}
