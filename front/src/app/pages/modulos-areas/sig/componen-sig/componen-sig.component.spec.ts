import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenSigComponent } from './componen-sig.component';

describe('ComponenSigComponent', () => {
  let component: ComponenSigComponent;
  let fixture: ComponentFixture<ComponenSigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenSigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenSigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
