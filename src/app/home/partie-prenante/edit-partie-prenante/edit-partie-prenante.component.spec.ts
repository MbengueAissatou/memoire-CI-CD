import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartiePrenanteComponent } from './edit-partie-prenante.component';

describe('EditPartiePrenanteComponent', () => {
  let component: EditPartiePrenanteComponent;
  let fixture: ComponentFixture<EditPartiePrenanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPartiePrenanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPartiePrenanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
