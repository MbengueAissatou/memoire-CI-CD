import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBailleurComponent } from './add-bailleur.component';

describe('AddBailleurComponent', () => {
  let component: AddBailleurComponent;
  let fixture: ComponentFixture<AddBailleurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBailleurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBailleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
