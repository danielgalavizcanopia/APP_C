import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalService } from './local.service';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
@Injectable()

export class authGuardService {
  public url: string;
  private permissions: any[] = [];
  constructor(
    private http: HttpClient,
    private router: Router,
    private localService: LocalService
  ) {
    this.url = environment.url;

  }


  async sendToken(usr: any) {
    if (usr) {
      let usuario = await this.localService.setJsonValue('LoggedInUser', usr);
      //localStorage.setItem("LoggedInUser", usr)
    }

  }
  async sendKey(key: string) {
    let llave = await this.localService.setJsonValue('token', key);
    //localStorage.setItem("token", key)
  }
  getUser() {

    return this.localService.getJsonValue('LoggedInUser');
    //return JSON.parse(localStorage.getItem('LoggedInUser'));
  }
  getToken() {
    return this.localService.getJsonValue('token');
    // return localStorage.getItem('token');
  }
  getPermisos() {
    return this.localService.getJsonValue('permisos');
    //return JSON.parse(localStorage.getItem('permisos'));
  }
  isLoggednIn() {
    return this.getToken() !== null;
  }
  logout() {
    return this.localService.clearToken();
    //localStorage.removeItem("LoggedInUser")
    //  localStorage.clear();
    this.router.navigate(["/"]);
  }
  sendPerfilMenu(perfil : any){
    this.localService.setJsonValue('permisos', perfil);
  }

  canActivate(): boolean {
    if (this.isLoggednIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }


  setPermissions(permissions: any[]) {
    this.localService.setJsonValue('permisos', permissions);
  }

  // Método para verificar si el usuario tiene un permiso específico
  hasPermission(permission: any): boolean {
    this.permissions = this.localService.getJsonValue('permisos')
    return this.permissions.find(x => x.idareas == permission || x.idareas == 9 || x.idareas == 1);
  }

  checkPermissionAndRedirect(permission: any, redirectUrl: string = '/home') {
    if (!this.hasPermission(permission)) {
      this.router.navigate([redirectUrl]);
      return false;
    }
    return true;

  }

}




