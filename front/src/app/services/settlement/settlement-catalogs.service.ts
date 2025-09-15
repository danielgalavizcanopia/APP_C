import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilApiService } from '../util-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettlementCatalogsService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){

    }

    getSettlementCurrency(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "settlementCatalogs/getSettlementCurrency/", token);
    }

    getPaymentType(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "settlementCatalogs/getPaymentType/", token);
    }

    getDeductionType(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "settlementCatalogs/getDeductionType/", token);
    }

    getPercentageMktByProject(idproject: number = 0, token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + `settlementCatalogs/getPercentageByProject/${idproject}`, token);
    }

    getStatusSettlement(token: string = ''): Observable<any[]>{
        return this._apiService.sendGetRequest(this.url + "settlementCatalogs/getStatusSettlement/", token);
    }

}
