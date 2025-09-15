import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProyectComponent } from './new-proyect.component';

describe('NewProyectComponent', () => {
  let component: NewProyectComponent;
  let fixture: ComponentFixture<NewProyectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewProyectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProyectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
