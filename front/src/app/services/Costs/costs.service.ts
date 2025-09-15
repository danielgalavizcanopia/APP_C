import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class CostsService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){
        
    }

    getCarbonEquivalentCertificates(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Costs/getCarbonEquivalentCertificates/${idProyecto}/`, token);
    }

    /**
     * Borrar los endpoints antiguos, dado que se darán de baja de la api por completo
     */

    /** ENDPOINTS NUEVOS */

    /** MAIN WEB SERVICES SUMMARY COST */
    getSummaryCostByProject(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `summaryCost/getSummaryCostByProject/${idProyecto}/`, token);
    }


    /** SUBMODULOS */
    /** ANNUAL COST */
    getAnnualCostByProject(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `summaryCost/getAnnualCostByProject/${idProyecto}/`, token);
    }

    setAnnualCostByProject(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "summaryCost/setAnnualCostByProject";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    /** UPFRONT COST DEDUCTIONS */
    getUpfrontCostDeductionByProject(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `summaryCost/getUpfrontCostDeductionByProject/${idProyecto}/`, token);
    }

    setUpfrontCostDeductionByProject(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "summaryCost/setUpfrontCostDeductionByProject";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }


    /** ANNUAL COST DEDUCTIONS */
    getAnnualCostDeductionsByProject(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `summaryCost/getAnnualCostDeductionsByProject/${idProyecto}/`, token);
    }

    setAnnualCostDeductionsByProject(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "summaryCost/setAnnualCostDeductionsByProject";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    /** UPFRONT COST */
    getUpfrontCostByProject(idProyecto: number = 0, token: string): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `summaryCost/getUpfrontCostByProject/${idProyecto}/`, token);
    }

    setUpfrontCostByProject(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "summaryCost/setUpfrontCostByProject";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    /** LOCK/UNLOCK SUMMARY COST */
    getLockSummaryCost(token: string): Observable<any[]> {  
        return this._apiService.sendGetRequest(this.url + `summaryCost/getLockSummaryCost/`, token);
    }

    setLockSummaryCost(data: any, token: string = ''): Observable<any[]>{
        const url = this.url + "summaryCost/setLockSummaryCost";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }
}