import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaProyectoComponent } from './area-proyecto.component';

describe('AreaProyectoComponent', () => {
  let component: AreaProyectoComponent;
  let fixture: ComponentFixture<AreaProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
