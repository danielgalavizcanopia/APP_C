import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilApiService } from '../util-api.service';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../login.service';
import { Observable, throwError } from 'rxjs';
import { Projects } from 'src/app/interfaces/Portafolio/NewProject/Newproject.interface';
import { UpdateProjects } from 'src/app/interfaces/Portafolio/NewProject/UpdateNewProject.interface';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
  })
export class RequestProjectUpdate {
   private url:string = environment.url;
constructor(private http: HttpClient,  private _apiService : UtilApiService, private _usuarioService : UsuarioService){
}
  updateNewProject(nuevosDatos: any, token: string = ''): Observable<any> {
    const url = this.url + "proyectos/spprojectshist/";
    return this._apiService.sendPostTokenRequest(nuevosDatos, url, token);
  }
  FnDetailRequest(p_idproyectohist: number, token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `proyectos/setprojecthist/${p_idproyectohist}/`, token);
  }
  Fnstatemunbyagrario(idnucleoAgrario: number, token: string = ''): Observable<any[]> {
    return this._apiService.sendGetRequest(this.url + `proyectos/stateandmuni/${idnucleoAgrario}/`, token)
  }
  sendPutRequest(nuevosDatos: UpdateProjects, idprojects: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
   const url = this.url + `proyectos/putprojects/${idprojects}/`; // URL específica con el idprojects

    return this.http.put(url, nuevosDatos, { headers: headers, observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === 201) {
          return response.body; // retorna los datos actualizados del proyecto
        }
        throw new Error(response.statusText);
      }),
      catchError((error: any) => {
        console.error(error);
        throw new Error('Error al actualizar el proyecto');
      })
    );
  }
  
}