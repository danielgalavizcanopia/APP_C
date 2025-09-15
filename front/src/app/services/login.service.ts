import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilApiService } from './util-api.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private config = environment.url
  private apiUrl: string = this.config +'login/';


  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,  private _apiService : UtilApiService) {}

  iniciarSesion(body: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, body, this.httpOptions);
  }

  registrarUsuario(dataRgister: any): Observable<any> {
    return this.http.post<any>(this.config + 'register', dataRgister, this.httpOptions);
  }
  
  obtenerToken(): Observable<string> {
    const token = sessionStorage.getItem('access');
    
    return of(token || ''); // Utiliza of() para envolver el token en un observable
  }


  getUsers(token: string){
    return this._apiService.sendGetRequest(this.config + `getUsers`, token);
  }

  setUsers(data: any, token: string = ''): Observable<any[]>{
    const url = this.config + "setUsers";
    return this._apiService.sendPostTokenRequest(data, url, token);
  }

  getCtPositions(token: string){
    return this._apiService.sendGetRequest(this.config + `getCtPositions`, token);
  }
  
}
