import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaOpSetComponent } from './ca-op-set.component';

describe('CaOpSetComponent', () => {
  let component: CaOpSetComponent;
  let fixture: ComponentFixture<CaOpSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaOpSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaOpSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
