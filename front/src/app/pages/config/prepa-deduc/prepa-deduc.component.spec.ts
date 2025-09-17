import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepaDeducComponent } from './prepa-deduc.component';

describe('PrepaDeducComponent', () => {
  let component: PrepaDeducComponent;
  let fixture: ComponentFixture<PrepaDeducComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepaDeducComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepaDeducComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
