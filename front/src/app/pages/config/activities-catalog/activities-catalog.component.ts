import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Activity, MacroProcess } from 'src/app/interfaces/Activities/activity.interface';
import { authGuardService } from 'src/app/services/Secret/auth-guard.service';
import { ActivitiesService } from 'src/app/services/Tools/Activities.service';
import { regex } from 'src/app/util/regex';

@Component({
  selector: 'app-activities-catalog',
  templateUrl: './activities-catalog.component.html',
  styleUrls: ['./activities-catalog.component.scss']
})
export class ActivitiesCatalogComponent {
  token: any;

  activityForm!: FormGroup;
  activities: Activity[] = [];
  activitySelected!: Activity | null;
  macroprocess: MacroProcess[] = [];

  visible: boolean = false;

  showDialog(){
    this.visible = true;
  }

  hideDialog(){
    this.visible = false;
    this.activitySelected = null;
    this.activityForm.reset();
  }

  constructor(
    public _authGuardService: authGuardService,
    private _activitiesService: ActivitiesService,
    private _fb: FormBuilder,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
  ){
    this.token = this._authGuardService.getToken();
    this.initFormulario();
    this.getActivities();
    this.getMacroProcess();
  }

  initFormulario(){
    this.activityForm = this._fb.group({
      idactivitiesprojects: [],
      projectsactivities: [, [Validators.required, Validators.pattern(regex.activityName)]],
      LargeDescriptionactivities: [Validators.required, Validators.pattern(regex.activityName)],
      Idmacroprocess: [Validators.required],
    })

    this.activityForm.reset();
  }

  getActivities(){
    this._activitiesService.getActivities(this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.activities = resp.result;
      }
    });
  }

  getMacroProcess(){
    this._activitiesService.getMacroProcess(this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.macroprocess = resp.result;
      }
    });
  }

  onRowSelected(activity: Activity){
    this.activitySelected = activity;

    this.activityForm.patchValue({
      idactivitiesprojects: this.activitySelected.idactivitiesprojects,
      projectsactivities: this.activitySelected.projectsactivities,
      LargeDescriptionactivities: this.activitySelected.LargeDescriptionactivities,
      Idmacroprocess: this.activitySelected.Idmacroprocess,
    });

    this.visible = true;
  }

  confirm(event: any) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteActivity()
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            this.hideDialog();
        }
    });
  }

  deleteActivity(){
    let data = {
      idactivitiesprojects:this.activitySelected?.idactivitiesprojects,
      projectsactivities: this.activityForm.value.projectsactivities,
      LargeDescriptionactivities: this.activityForm.value.LargeDescriptionactivities,
      Idmacroprocess: this.activityForm.value.Idmacroprocess,
      status: 0
    }

    this._activitiesService.setActivities(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
        this.getActivities();
        this.hideDialog();
      }
    });
  }

  saveActivity(){
    if(!this.activityForm.valid){
      return this.messageService.add({ severity: 'error', summary: 'All fields required', detail: "All fields required, please try again"});
    }

    let data = {
      idactivitiesprojects: this.activitySelected ? this.activitySelected.idactivitiesprojects : 0,
      projectsactivities: this.activityForm.value.projectsactivities,
      LargeDescriptionactivities: this.activityForm.value.LargeDescriptionactivities,
      Idmacroprocess: this.activityForm.value.Idmacroprocess,
      status: 1
    }

    this._activitiesService.setActivities(data, this.token?.access_token).subscribe((resp: any) => {
      if(resp.valido == 1){
        this.messageService.add({ severity: 'success', summary: 'Save Successfully', detail: "All fields saved!"});
        this.getActivities();
        this.hideDialog();
      }
    });

  }


  
}
