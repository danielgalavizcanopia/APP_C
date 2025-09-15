import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';


declare var $: any;

@Component({
  selector: 'app-alerta',
  template: `<p-confirmDialog ></p-confirmDialog>`,
   providers: [ConfirmationService]
})
export class AlertaComponent implements OnInit {

  constructor( private _confirmationService: ConfirmationService, private router: Router ) { }

  ngOnInit() {
    
  }

  alerta( header: string, titulo: string, mensaje: string, campo: string ) :void  {
    this._confirmationService.confirm({
        message: mensaje,
        header: header,
        acceptLabel: 'Cierra',
        accept: () => { this.cierraModal( campo ); }
    });
  }

  exito( header: string, titulo: string, mensaje: string, campo: string, redirect:string ) :void  {
    this._confirmationService.confirm({
        message: mensaje,
        header: header,
        acceptLabel: 'Ingresar',
        accept: () => { this.redirectModal( redirect ); }
    });
  }
  
  
  error( header: string, titulo: string, mensaje: string, campo: string ) :void  {
    this._confirmationService.confirm({
        message: mensaje,
        header: header,
        acceptLabel: 'Aceptar',
        accept: () => { this.cierraModal( campo ); }
    });
  }

  public cierraModal( campo: string): void {
    if ( !campo || campo == '' ) {
      campo = 'no';
    }
    campo = "#" + campo;
    setTimeout(function() { $(campo).focus() },10);
  }

  
  public redirectModal(redirect: string){
    if(redirect == "1"){
      this.router.navigate(['/login']);
    }
  }
  
}