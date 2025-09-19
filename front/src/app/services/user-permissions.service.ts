import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UtilApiService } from './util-api.service';
import { environment } from 'src/environments/environment';

export interface AccessUser {
  IDUser: number;
  Name: string;
  Email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserPermissionsService {
  private url: string = environment.url;

  constructor(
    private http: HttpClient, 
    private _apiService: UtilApiService
  ) {}

  getAccessUsersStatusProjects(token: string): Observable<any> {
    return this._apiService.sendGetRequest(this.url + "dashboards/getAccessUsersStatusProjects", token);
  }

  checkUserHasStatusPermission(currentUserId: number, token: string): Observable<boolean> {
    return this.getAccessUsersStatusProjects(token).pipe(
      map((response: any) => {
        if (response.valido === 1 && response.result) {
          return response.result.some((user: AccessUser) => user.IDUser === currentUserId);
        }
        return false;
      })
    );
  }
}