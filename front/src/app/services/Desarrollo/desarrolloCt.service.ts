import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class DesarrolloCtService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){
        
    }
    
    getLicencesPermits(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getLicencesPermits/", token);
    }

    getLeadDesarrollo(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getLeadDesarrollo/", token);
    }

    getDevelopmentStatus(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getDevelopmentStatus/", token);
    }

    getRegistry(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getRegistry/", token);
    }

    getMethodology(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getMethodology/", token);
    }

    getConfidenceoffrontcost(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getConfidenceoffrontcost/", token);
    }

    getCBAcalculatorversion(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getCBAcalculatorversion/", token);
    }

    getConfidenceofcreditingactivityarea(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getConfidenceofcreditingactivityarea/", token);
    }

    getProjectcondition(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getProjectcondition/", token);
    }

    getERScalculatorversion(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getERScalculatorversion/", token);
    }

    getMercuriaddstatus(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getMercuriaddstatus/", token);
    }

    getEstimatepermanence(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getEstimatepermanence/", token);
    }

    getEstimateleakeage(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getEstimateleakeage/", token);
    }

    getEstimatedmrvrequirements(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getEstimatedmrvrequirements/", token);
    }

    getRegistrationroute(token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + "DesarrolloCatalogs/getRegistrationroute/", token);
    }

}