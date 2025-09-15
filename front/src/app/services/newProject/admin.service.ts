import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { UsuarioService } from '../login.service';


@Injectable({
    providedIn: 'root'
  })
export class ProjectUsuarioService {
   private url:string = environment.url;
constructor(private http: HttpClient,  private _apiService : UtilApiService, private _usuarioService : UsuarioService){
}
getUsers(token : string): Observable<any[]> {
   // return this.http.get<any[]>(`${this.url}/usuarios/users/`);
   return this._apiService.sendGetRequest(this.url + "/usuarios/users",token);
  }
   getProjectsNew(token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + "proyectos/get_projects/", token);
//    return this.http.get<any[]>(`${this.url}/proyectos/show-projects/`);
  }
  saveNewProject(datosT: any, token: string = ''): Observable<any> {
  const url = this.url + "proyectos/post_projects/";
  // const token = this._usuarioService.obtenerToken();
  return this._apiService.sendPostTokenRequest(datosT, url, token);
}
FngetDetaillProject(idprojects: number, token: string = ''): Observable<any[]> {
  return this._apiService.sendGetRequest(this.url + `proyectos/projectsByiddetaill/${idprojects}/`, token);
}

}
