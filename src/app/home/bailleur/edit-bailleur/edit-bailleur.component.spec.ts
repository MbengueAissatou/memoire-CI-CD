import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBailleurComponent } from './edit-bailleur.component';

describe('EditBailleurComponent', () => {
  let component: EditBailleurComponent;
  let fixture: ComponentFixture<EditBailleurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBailleurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBailleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
