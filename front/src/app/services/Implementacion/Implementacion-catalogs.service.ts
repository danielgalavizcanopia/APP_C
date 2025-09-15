import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class ImplementationCatalogsService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getCtActivities(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getCtActivities/", token);
    }

    getCapexSubAccounts(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getCapexSubAccounts/", token);
    }

    getOpexSubAccounts(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getOpexSubAccounts/", token);
    }

    getSOPs(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getSOPs/", token);
    }

    getCoordinadores(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getCoordinadores/", token);
    }

    getejecutorCampo(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getejecutorCampo/", token);
    }

    getevaluador(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getevaluador/", token);
    }

    getseguimiento(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getseguimiento/", token);
    }

    getsupervisores(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getsupervisores/", token);
    }

    getStatusValidacion(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getStatusValidacion/", token);
    }

    getStatusAnnualPlan(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getStatusAnnualPlan/", token);
    }

    getIndicadoresCuantitativos(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getIndicadoresCuantitativos/", token);
    }

    getIndicadoresCuantitativosByKPI(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getIndicadoresCuantitativosByKPI/", token);
    }

    getOds(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getOds/", token);
    }

    getRelatedGoals(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getRelatedGoals/", token);
    }

    getManagers(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "implementationCatalogs/getManagers/", token);
    }
}