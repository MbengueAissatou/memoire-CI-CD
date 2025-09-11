import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCircuitFactureComponent } from './add-circuit-facture.component';

describe('AddCircuitFactureComponent', () => {
  let component: AddCircuitFactureComponent;
  let fixture: ComponentFixture<AddCircuitFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCircuitFactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCircuitFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
