import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginacionComponent } from './originacion.component';

describe('OriginacionComponent', () => {
  let component: OriginacionComponent;
  let fixture: ComponentFixture<OriginacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OriginacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OriginacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
