import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalNewProjectComponent } from 'src/app/modal-new-project/modal-new-project.component';
import { LayoutService } from 'src/app/services/app.layout.service';
// import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent {
    timeout: any = null;
    @ViewChild(ModalNewProjectComponent, { static: false }) modalNewProject!: ModalNewProjectComponent;

    @ViewChild('menuContainer') menuContainer!: ElementRef;

    buttonvisible!: boolean;

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
      this.checkScreenSize();
    }
  
    private checkScreenSize(): void {
      if(window.innerWidth < 800) this.buttonvisible = true;
      else this.buttonvisible = false;
    }
    constructor(public layoutService: LayoutService, public el: ElementRef, private router: Router,) {
        this.checkScreenSize();
    }

    logOut(){
        sessionStorage.clear()
        this.router.navigate(['/']);
      }
    

    onMouseEnter() {
        if (!this.layoutService.state.anchored) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.layoutService.state.sidebarActive = true;
           
    
        }
    }

    onMouseLeave() {
        if (!this.layoutService.state.anchored) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => this.layoutService.state.sidebarActive = false, 300);
            }
        }
    }

    anchor() {
        this.layoutService.state.anchored = !this.layoutService.state.anchored;
    }

    openModal(showModal : boolean): void {
     this.modalNewProject.openModalNewProject(showModal);
    }
}
