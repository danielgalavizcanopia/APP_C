import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashFinancialComponent } from './dash-financial.component';

describe('DashFinancialComponent', () => {
  let component: DashFinancialComponent;
  let fixture: ComponentFixture<DashFinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashFinancialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
