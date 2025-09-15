import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaActividadComponent } from './area-actividad.component';

describe('AreaActividadComponent', () => {
  let component: AreaActividadComponent;
  let fixture: ComponentFixture<AreaActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaActividadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
