import { Injectable } from '@angular/core';
import { Projects } from '../interfaces/Portafolio/NewProject/Newproject.interface';
import { Subject } from 'rxjs';

@Injectable()
export class ItemService {

  public $visible = new Subject<Projects>();

  constructor() { }

}