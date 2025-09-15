import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UtilApiService {

    constructor(private _http: HttpClient) {}



    public sendPostRequest(aEnviar: any, url: string): Observable<any> {
        let json = JSON.stringify(aEnviar);
        let params = "json=" + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(url, json, { headers: headers });
    } // sendPostRequest

    public sendPostTokenRequest(aEnviar: any, url: string, token: string = ''): Observable<any> {
        let json = JSON.stringify(aEnviar);
        let params = "json=" + json;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': ': ' + token + '' });;
        return this._http.post(url, json, { headers: headers });
    } // sendPostRequest

    public sendGetRequest( url: string , token: any): Observable<any> {
  
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
       // let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': ': ' + token + '' });
        return this._http.get<any>(url, { headers: headers });
    } // sendGetRequest

    sendPostTokenRequestWithFile(jsonBody: any, file: File, url: string, token: string): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('body', JSON.stringify(jsonBody));
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      return this._http.post(url, formData, { headers });
    }

    public sendPutRequest(aEnviar: any, url: string, token: string): Observable<any> {
        let json = JSON.stringify(aEnviar);
        let params = "json=" + json;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });;
        return this._http.put(url, json, { headers: headers });
      } // sendPutRequest
     public sendGetSinToken( url: string ): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer`
          });
       // let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': ': ' + token + '' });
        return this._http.get<any>(url, { headers: headers });
    } 
}