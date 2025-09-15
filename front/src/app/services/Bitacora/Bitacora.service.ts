import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class BitacoraService {
    private url:string = environment.url;

    constructor(private http: HttpClient,  private _apiService : UtilApiService){
        
    }

    getBitacoraByProject(idprojects: any, token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Bitacora/getBitacoraByProject/${idprojects}/`, token);
    }

    getDocumentBitacora(fileName: string): Observable<Blob> {
        return this.http.get(`${this.url}${fileName}`, { responseType: 'blob' });
      }

    getBitacoraByID(idCategoriaEv: number, token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Bitacora/getBitacoraById/${idCategoriaEv}/`, token);
    }

    setBitacoraProject(data: any, file: File, token: string=''): Observable<any[]>{
        const url = this.url + "Bitacora/setBitacora";
        return this._apiService.sendPostTokenRequestWithFile(data, file, url, token);
    }

    getBitacoraFiltered(data: any, token: string=''): Observable<any[]>{
        const url = this.url + "Bitacora/getBitacoraFiltered";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    updateEvidencia(data: any, file: File, token: string=''): Observable<any[]>{
        const url = this.url + "Bitacora/updateEvidencia";
        return this._apiService.sendPostTokenRequestWithFile(data, file, url, token);
    }

    setValidateEvidence(data: any, token: string=''): Observable<any[]>{
        const url = this.url + "Bitacora/setValidateEvidence";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    getEvidenciasByBitacora(idCategoriaEv: number, token: string = ''): Observable<any[]> {
        return this._apiService.sendGetRequest(this.url + `Bitacora/getEvidenciasByBitacora/${idCategoriaEv}/`, token);
    }

    getLinkEvidenciasByBitacora(data: any, token: string = ''): Observable<any[]> {
        const url = this.url + "Bitacora/getLinkEvidenciasByBitacora";
        return this._apiService.sendPostTokenRequest(data, url, token);
    }

    downloadExcel(params: any, ProjectName: any, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    
        this.http.get(this.url + `Bitacora/getBitacoraXLSX`, {
          headers,
          params,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = ProjectName+'.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }

    downloadExcelEvidences(params: any, ProjectName: any, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    
        this.http.get(this.url + `Bitacora/getBitacoraWithEvidences`, {
          headers,
          params,
          responseType: 'blob',
        }).subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = ProjectName+'_Evidences.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }, (error) => {
          console.error('Error al descargar el Excel', error);
        });
    }
    
    downloadWord(params: any, ProjectName: any, token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        this.http.get(this.url + `Bitacora/getBitacoraDOCX`, {
            headers,
            params,
            responseType: 'blob',
          }).subscribe((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = ProjectName+'.docx';
            a.click();
            window.URL.revokeObjectURL(url);
          }, (error) => {
            console.error('Error al descargar el Word', error);
          });
      }

}