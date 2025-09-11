import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartiePrenanteComponent } from './add-partie-prenante.component';

describe('AddPartiePrenanteComponent', () => {
  let component: AddPartiePrenanteComponent;
  let fixture: ComponentFixture<AddPartiePrenanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPartiePrenanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPartiePrenanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
