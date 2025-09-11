import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaysComponent } from './edit-pays.component';

describe('EditPaysComponent', () => {
  let component: EditPaysComponent;
  let fixture: ComponentFixture<EditPaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
