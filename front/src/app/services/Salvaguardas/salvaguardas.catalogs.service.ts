import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class SalvaguardaCatalogsService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getbiodiversity(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "SalvaguardaCatalogos/getbiodiversity/", token);
    }

    geths(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "SalvaguardaCatalogos/geths/", token);
    }

    getHumanRights(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "SalvaguardaCatalogos/getHumanRights/", token);
    }

    getIndigenousPeople(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "SalvaguardaCatalogos/getIndigenousPeople/", token);
    }

    getLeadSafeGuards(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "SalvaguardaCatalogos/getLeadSafeGuards/", token);
    }

    getNegativeHS(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "SalvaguardaCatalogos/getNegativeHS/", token);
    }

    getProjects(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "SalvaguardaCatalogos/getProjects/", token);
    }

    getSafeguardNHapproach(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "SalvaguardaCatalogos/getSafeguardNHapproach/", token);
    }

    getShareHoldersEngagement(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "SalvaguardaCatalogos/getShareHoldersEngagement/", token);
    }

    getSocialCommunityNH(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "SalvaguardaCatalogos/getSocialCommunityNH/", token);
    }

    getStatusSafeguard(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "SalvaguardaCatalogos/getStatusSafeguard/", token);
    }


    

}