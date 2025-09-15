import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewprojectUpdateComponent } from './newproject-update.component';

describe('NewprojectUpdateComponent', () => {
  let component: NewprojectUpdateComponent;
  let fixture: ComponentFixture<NewprojectUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewprojectUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewprojectUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
