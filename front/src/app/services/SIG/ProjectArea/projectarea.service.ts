import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../../../services/util-api.service';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../../login.service';


@Injectable({
    providedIn: 'root'
  })
export class ProjectAreaService {
   private url:string = environment.url;
constructor(private http: HttpClient,  private _apiService : UtilApiService, private _usuarioService : UsuarioService){
}
  fnSaveProjectArea(datosT: any, token:string = ''): Observable<any> {
    const url = this.url + "ProjectAreaSig/setproyectarea/";
    return this._apiService.sendPostTokenRequest(datosT, url, token);
  }

  fnUpdateProjectArea(data: any, idProyecto: number = 0, token: string): Observable<any> {
    return this._apiService.sendPutRequest(data, this.url + `ProjectAreaSig/putProjectArea/${idProyecto}/`, token);
  }
}