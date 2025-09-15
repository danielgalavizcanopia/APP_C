import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenPedComponent } from './componen-ped.component';

describe('ComponenPedComponent', () => {
  let component: ComponenPedComponent;
  let fixture: ComponentFixture<ComponenPedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenPedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenPedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
