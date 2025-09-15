import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilApiService } from '../util-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private url:string = environment.url;
  
  constructor(private _apiService : UtilApiService) { }

  getActivities(token: string = ''): Observable<any[]> {
      return this._apiService.sendGetRequest(this.url + "Activities/getActivities/", token);
  }
  
  setActivities(data: any, token: string = ''): Observable<any[]>{
      const url = this.url + "Activities/setActivities";
      return this._apiService.sendPostTokenRequest(data, url, token);
  }

  getMacroProcess(token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + "Activities/getMacroProcess/", token);
}

}
 