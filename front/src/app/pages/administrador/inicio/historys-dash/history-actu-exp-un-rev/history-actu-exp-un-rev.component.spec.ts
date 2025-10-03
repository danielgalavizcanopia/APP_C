import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryActuExpUnRevComponent } from './history-actu-exp-un-rev.component';

describe('HistoryActuExpUnRevComponent', () => {
  let component: HistoryActuExpUnRevComponent;
  let fixture: ComponentFixture<HistoryActuExpUnRevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryActuExpUnRevComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryActuExpUnRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
